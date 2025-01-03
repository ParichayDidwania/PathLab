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

router.get('/download/:order_id', async (req, res) => {
  const order_id = req.params.order_id;
  const orderDoc = await OrderModel.fetchOrderByUserAndId(req.user._id, order_id);
  if(!orderDoc) {
    return res.status(400).send({ error: "This order Id does not exist for this account" });
  }
  
  const file_id = orderDoc.file_id;
  if(file_id) {
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'reports' });
      const fileDocs = await bucket.find({ _id: file_id }).toArray();
      const fileName = fileDocs[0].filename;

      res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
      res.setHeader('Content-Type', 'application/pdf');

      bucket.openDownloadStream(file_id).pipe(res);
  } else {
      res.status(400).send({ message: "File not found" });
  }
})

router.get('/:start', async (req, res) => {
  const regex = new RegExp('^\\d+$');
  const start = req.params.start && regex.test(req.params.start) ? parseInt(req.params.start) : 0;
  const orderDocs = await OrderModel.fetchOrdersByUser(req.user._id, start, CONSTANTS.PAGINATION_LIMIT);

  const orders = [];
  for(const orderDoc of orderDocs) {
    orders.push({
      order_id: orderDoc._id,
      products: Object.keys(orderDoc.products).map((product_id) => { 
        return {
          name: ProductCatalogue.getById(product_id).title,
          quantity: orderDoc.products[product_id]
        }
      }),
      date: moment(orderDoc.date).format("MMMM DD, YYYY"),
      time: orderDoc.time,
      amount: orderDoc.amount,
      status: orderDoc.status,
      file_id: orderDoc.file_id
    })
  }

  const isLast = orders.length < CONSTANTS.PAGINATION_LIMIT;

  res.send(
    { 
      message: "success", 
      data: {
        orders: orders,
        isLast: isLast  
      }
    });
})

router.get('/order/:order_id', async (req, res) => {
  const order_id = req.params.order_id && mongoose.isValidObjectId(req.params.order_id) ? req.params.order_id : undefined;
  if(!order_id) {
    return res.status(400).send({ error: "Invalid Order Id" });
  }

  const orderDoc = await OrderModel.fetchOrderByUserAndId(req.user._id, order_id);
  if(!orderDoc) {
    return res.status(400).send({ error: "This order Id does not exist for this account" });
  }

  const order = {
    order_id: orderDoc._id,
    products: Object.keys(orderDoc.products).map((product_id) => { 
      return {
        name: ProductCatalogue.getById(product_id).title,
        quantity: orderDoc.products[product_id]
      }
    }),
    date: moment(orderDoc.date).format("MMMM DD, YYYY"),
    time: orderDoc.time,
    amount: orderDoc.amount,
    status: orderDoc.status,
    members: orderDoc.members,
    address: orderDoc.address
  };

  res.send({
    message: "success",
    data: order
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

    orderData.amount = ProductCatalogue.getCartItemsCost(orderData.products);
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

    try {
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
          link_amount: orderData.amount,
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
            notify_url: `${process.env.DOMAIN}/cashfree/webhook/${orderId}/${counter}/${id}`
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
        res.status(400).send({
          for: "page",
          error: "Payment gateway is down"
        });
      }
    } catch (err) {
      console.log(err);
      res.status(400).send({
        for: "page",
        error: "Payment gateway is down"
      });
    }
})
module.exports = router;
