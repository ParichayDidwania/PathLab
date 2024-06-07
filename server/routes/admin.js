const express = require('express');
const router = express.Router();
const OrderModel = require('../schemas/order');
const CONSTANTS = require('../constants/constants');
const ProductCatalogue = require('../helpers/productCatalogue');
const moment = require('moment');

router.get('/bookings/:start', async (req, res) => {
    const regex = new RegExp('^\\d+$');
    const start = req.params.start && regex.test(req.params.start) ? parseInt(req.params.start) : 0;
    const order_id = req.query.order_id ?? undefined;
    const start_date = req.query.start_date ? moment(req.query.start_date) : moment(CONSTANTS.EARLIEST_DATE);
    const end_date = req.query.end_date ? moment(req.query.end_date) : moment(CONSTANTS.LATEST_DATE);

    let orderDocs, totalOrderCount;
    
    if(order_id) {
        orderDocs = await OrderModel.fetchOrdersForAdminByOrderId(order_id);
        totalOrderCount = orderDocs.length;
    } else {
        [
            orderDocs,
            totalOrderCount
        ] = await Promise.all([
            OrderModel.fetchOrdersForAdmin(start, CONSTANTS.PAGINATION_LIMIT, start_date, end_date),
            OrderModel.fetchOrderCountForAdmin()
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

module.exports = router;
