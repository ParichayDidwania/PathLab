const express = require('express');
const router = express.Router();
const OrderModel = require('../schemas/order');
const CONSTANTS = require('../constants/constants');
const ProductCatalogue = require('../helpers/productCatalogue');
const moment = require('moment');

router.get('/bookings/:start', async (req, res) => {
    const regex = new RegExp('^\\d+$');
    const start = req.params.start && regex.test(req.params.start) ? parseInt(req.params.start) : 0;

    const [
        orderDocs,
        totalOrderCount
    ] = await Promise.all([
        OrderModel.fetchOrdersForAdmin(start, CONSTANTS.PAGINATION_LIMIT),
        OrderModel.fetchOrderCountForAdmin()
    ])

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