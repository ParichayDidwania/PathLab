const express = require("express");
const SlotFunction = require("../functions/slot");
const SlotModel = require("../schemas/slot");
const OrderModel = require("../schemas/order");
const router = express.Router();
const HelperClass = require("../helpers/helper");
const ProductCatalogue = require("../helpers/productCatalogue");
const mongoose = require('mongoose');
const moment = require('moment');
const CONSTANTS = require("../constants/constants");

router.get('/slots', async(req, res) => {
    const slots = await SlotFunction.checkAndCreateSlots();
    const formattedSlots = SlotFunction.formatDate(slots);
    res.send({ 
        message: "success",
        data: formattedSlots
    })
})

router.post('/book', async(req, res) => {
    const orderData = {
        user_id: req.user._id,
        address: req.body.address,
        members: req.body.members,
        products: req.body.cart
    }

    if (
      HelperClass.isNullOrEmptyObject(orderData.address, ["address_1", "city", "state", "pin_code", "phone"]) || 
      HelperClass.isNullOrEmptyArrayOfObjects(orderData.members, ["name", "gender"]) ||
      HelperClass.isNullOrEmptyObject(orderData.products)
    ) {
      res.status(400).send({
        for: "page",
        error: "Provided data is incomplete"
      });
      return;
    }

    const { counter, id } = req.body.slot;

    const slotDoc = await SlotModel.fetchSlotByCounterAndId(counter, id);
    if(slotDoc && (slotDoc.slots[0].booked || slotDoc.slots[0].tempBooked)) {
        res.status(400).send({
            for: "slot",
            error: "Slot has already been booked by someone else"
        });
        return;
    }

    orderData.date = slotDoc.on;
    orderData.time = slotDoc.slots[0].time;

    const orderId = new mongoose.mongo.ObjectId();
    const orderExpiry = moment().add(10, 'm');
    const paymentExpiry = moment(orderExpiry).subtract(CONSTANTS.PAYMENT_EXPIRATION_OFFSET, 'm');

    const order = await OrderModel.createOrder(orderId, orderExpiry, orderData, SlotFunction.getCounter());
    const slotBooking = await SlotModel.bookSlotByCounterAndId(counter, id, order._id, order.expiresAt);

    if(slotBooking.modifiedCount == 0) { // for 2 bookings at same time
        await OrderModel.deleteOrder(order._id);
        res.status(400).send({
            for: "slot",
            error: "Slot has already been booked by someone else"
        });
        return;
    }

    let cashfreeCall = await fetch(`${process.env.CASHFREE_TEST_URL}/links`,{
      method: "POST",
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-api-version': '2022-09-01',
        'x-client-id': process.env.CASHFREE_ID,
        'x-client-secret': process.env.CASHFREE_SECRET
      },
      body: JSON.stringify({
        link_id: orderId,
        link_amount: ProductCatalogue.getCartItemsCost(orderData.products),
        link_currency: "INR",
        link_purpose: "Payment for some product",
        customer_details: {
          customer_phone: orderData.address.phone.toString(),
          customer_email: req.user.email,
          customer_name: req.user.name
        },
        link_expiry_time: paymentExpiry,
        link_notify: {
          send_sms: true,
          send_email: true
        },
        link_meta: {
          payment_methods: "upi,cc,dc,nb",
          return_url: `${process.env.WEBSITE_URL}/success`,
          notify_url: `https://612c-73-119-14-155.ngrok-free.app/cashfree/webhook/${orderId}/${counter}/${id}`
        }
      })
    })

    if(cashfreeCall.status === 200) {
      cashfreeCall = await cashfreeCall.json();
      res.send({
        message: "success",
        data: {
          url: cashfreeCall.link_url
        }
      });
    } else {
      cashfreeCall = await cashfreeCall.json();
      console.log(cashfreeCall);
      res.status(400).send({
        for: "page",
        error: "Payment gateway is down"
      });
    }
})
module.exports = router;