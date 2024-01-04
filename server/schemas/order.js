const mongoose = require('mongoose');
const CONSTANTS = require('../constants/constants');

const OrderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, index: true },
    date: { type: Date },
    time: { type: String },
    address: { type: String },
    members: [{
        name: { type: String },
        gender: { type: String }
    }],
    status: { type: Number, default: CONSTANTS.ORDER_STATUS.PAYMENT_PENDING }
}, { timestamps: true })

class OrderModelClass {
    static async createOrder(orderData) {
        const doc = await OrderModel.create({
            user_id: orderData.user_id,
            date: orderData.date,
            time: orderData.time,
            address: orderData.address,
            members: orderData.members,
            status: CONSTANTS.ORDER_STATUS.PAYMENT_PENDING
        })

        return doc;
    }

    static async deleteOrder(order_id) {
        await OrderModel.deleteOne({ _id: order_id });
    }
}

OrderSchema.loadClass(OrderModelClass);
const OrderModel = mongoose.model("order", OrderSchema, "orders");

module.exports = OrderModel;