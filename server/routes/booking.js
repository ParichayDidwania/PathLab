const express = require("express");
const SlotFunction = require("../functions/slot");
const SlotModel = require("../schemas/slot");
const OrderModel = require("../schemas/order");
const router = express.Router();

router.get('/slots', async(req, res) => {
    const slots = await SlotFunction.checkAndCreateSlots();
    res.send({ 
        message: "success",
        data: slots
    })
})

router.post('/book', async(req, res) => {
    const orderData = {
        user_id: req.user._id,
        address: req.body.address,
        members: req.body.members,
    }

    const { counter, id } = req.body.slot;

    const slotDoc = await SlotModel.fetchSlotByCounterAndId(counter, id);
    if(slotDoc.slots[0].booked || slotDoc.slots[0].tempBooked) {
        res.status(400).send({
            error: "Slot has already been booked by someone else"
        });
        return;
    }

    orderData.date = slotDoc.on;
    orderData.time = slotDoc.slots[0].time;

    const order = await OrderModel.createOrder(orderData);
    const slotBooking = await SlotModel.bookSlotByCounterAndId(counter, id, order._id);

    if(slotBooking.modifiedCount == 0) { // for 2 bookings at same time
        await OrderModel.deleteOrder(order._id);
        res.status(400).send({
            error: "Slot has already been booked by someone else"
        });
        return;
    }

    res.send({
        message: "success"
    })
})

module.exports = router;