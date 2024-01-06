const mongoose = require('mongoose');
const CONSTANTS = require('../constants/constants');
const moment = require('moment');

const OrderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, index: true },
    counter: { type: Number },
    date: { type: Date },
    time: { type: String },
    address: { type: String },
    members: [{
        name: { type: String },
        gender: { type: String }
    }],
    status: { type: Number, default: CONSTANTS.ORDER_STATUS.PAYMENT_PENDING },
    expiresAt: { type: Date }
}, { timestamps: true })

class OrderModelClass {
    static async createOrder(orderData, counter) {
        const doc = await OrderModel.create({
            user_id: orderData.user_id,
            counter: counter,
            date: orderData.date,
            time: orderData.time,
            address: orderData.address,
            members: orderData.members,
            status: CONSTANTS.ORDER_STATUS.PAYMENT_PENDING,
            expiresAt: moment().add(CONSTANTS.EXPIRATION_WINDOW, 'minutes')
        })

        return doc;
    }

    static async fetchOrdersByCounter(counter) {
        return await OrderModel.find({ counter: counter });
    }

    static async deleteOrder(order_id) {
        await OrderModel.deleteOne({ _id: order_id });
    }

    static async deleteOrders(order_id_arr) {
        OrderModel.deleteMany({ _id: { $in: order_id_arr } }).exec();
    }
}

OrderSchema.loadClass(OrderModelClass);
const OrderModel = mongoose.model("order", OrderSchema, "orders");

module.exports = OrderModel;