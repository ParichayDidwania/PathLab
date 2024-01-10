const express = require('express');
const SlotModel = require('../schemas/slot');
const OrderModel = require('../schemas/order');
const mongoose = require('mongoose');
const router = express.Router();

router.post('/webhook/:order_id/:counter/:id', async (req, res) => {
    if(req.body.type != "PAYMENT_LINK_EVENT") {
        return res.send({ "message": "success" });
    }

    const order_id = new mongoose.mongo.ObjectId(req.params.order_id);
    const counter = parseInt(req.params.counter);
    const id = parseInt(req.params.id);
    const status = req.body.data.order.transaction_status;

    if(!order_id || !counter || !id) {
        return res.send({ "message": "success" }); // webhook needs 200 or it will retry same request
    }

    if(status === "SUCCESS") {
        const update = await SlotModel.confirmBooking(counter, id, order_id); 
        if(update.modifiedCount !== 0) {
            await OrderModel.updateStatusToBooked(order_id);
        }
    } else {
        await SlotModel.clearSlotByCounterAndId(counter, id, order_id);
    }

    res.send({ "message": "success" });
});

module.exports = router;