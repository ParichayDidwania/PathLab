const express = require('express');
const router = express.Router();
const OrderModel = require('../schemas/order');
const CONSTANTS = require('../constants/constants');
const ProductCatalogue = require('../helpers/productCatalogue');
const moment = require('moment');
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const mongoose = require('mongoose');
const streamifier = require('streamifier');

router.get('/bookings/download/:order_id', async (req, res) => {
    const order_id = req.params.order_id;
    const orderDoc = await OrderModel.fetchOrdersForAdminByOrderId(order_id);
    if(orderDoc.length > 0) {
        const file_id = orderDoc[0].file_id;
        if(file_id) {
            const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'reports' });
            const fileDocs = await bucket.find({ _id: file_id }).toArray();
            const fileName = fileDocs[0].filename;

            res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);

            bucket.openDownloadStream(file_id).pipe(res);
        } else {
            res.status(400).send({ message: "File not found" });
        }
    } else {
        res.status(400).send({ message: "Order not found" });
    }
})

router.get('/bookings/:start', async (req, res) => {
    const regex = new RegExp('^\\d+$');
    const start = req.params.start && regex.test(req.params.start) ? parseInt(req.params.start) : 0;
    const order_id = req.query.order_id ?? undefined;
    const start_date = req.query.start_date ? moment(req.query.start_date) : moment(CONSTANTS.EARLIEST_DATE);
    const end_date = req.query.end_date ? moment(req.query.end_date) : moment(CONSTANTS.LATEST_DATE);
    const isCompleted = req.query.isCompleted ? true : false;

    let orderDocs, totalOrderCount;
    
    if(order_id) {
        orderDocs = await OrderModel.fetchOrdersForAdminByOrderIdWithCompleted(order_id, isCompleted);
        totalOrderCount = orderDocs.length;
    } else {
        [
            orderDocs,
            totalOrderCount
        ] = await Promise.all([
            OrderModel.fetchOrdersForAdmin(start, CONSTANTS.PAGINATION_LIMIT, start_date, end_date, isCompleted),
            OrderModel.fetchOrderCountForAdmin(isCompleted)
        ])
    }

    const orders = [];
    for(const orderDoc of orderDocs) {
        orders.push({
            order_id: orderDoc._id,
            members: orderDoc.members,
            address: orderDoc.address,
            products: Object.keys(orderDoc.products).map((product_id) => { 
                return {
                    name: ProductCatalogue.getById(product_id).title,
                    quantity: orderDoc.products[product_id]
                }
            }),
            date: moment(orderDoc.date).format("MMMM DD, YYYY"),
            time: orderDoc.time,
            amount: orderDoc.amount,
            status: orderDoc.status
        })
    }

    res.send(
        { 
          message: "success", 
          data: {
            orders: orders,
            count: totalOrderCount
          }
        }
    );
})

router.use(upload.single("file"));
router.put('/bookings', async (req, res) => {
    const data = JSON.parse(req.body.data);
    const order_id = data.order_id;
    const status = data.status;
    const file = req.file;

    const validStatuses = [CONSTANTS.ORDER_STATUS.BOOKED, CONSTANTS.ORDER_STATUS.SAMPLE_COLLECTED, CONSTANTS.ORDER_STATUS.COMPLETED];
    if(!validStatuses.includes(status)) {
        return res.status(400).send({ message: "Invalid status" });
    }

    if((status === CONSTANTS.ORDER_STATUS.COMPLETED && !file) || (status !== CONSTANTS.ORDER_STATUS.COMPLETED && file)) {
        return res.status(400).send({ message: `File needs to be uploaded with "COMPLETED" status only` });
    }

    const orderDoc = await OrderModel.fetchOrdersForAdminByOrderId(order_id);
    if(orderDoc.length > 0) {
        let file_id = null;
        if (file) {
            //Delete Existing File
            const existing_file_id = orderDoc[0].file_id;
            if(existing_file_id) {
                const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'reports' });
                bucket.delete(existing_file_id);
            }

            const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'reports' });
            file_id = new mongoose.mongo.ObjectId();
            streamifier.createReadStream(req.file.buffer).pipe(
                bucket.openUploadStreamWithId(file_id, req.file.originalname)
            );
        }
        
        await OrderModel.updateStatusAndFileId(order_id, status, file_id);
        res.send();
    } else {
        res.status(400).send({ message: "Order not found" });
    }
})

module.exports = router;
