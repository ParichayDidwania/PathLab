const mongoose = require('mongoose');
const CONSTANTS = require('../constants/constants');

const OrderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, index: true },
    counter: { type: Number },
    products: {},
    amount: { type: Number },
    date: { type: Date },
    time: { type: String },
    address: {},
    members: [{
        name: { type: String },
        gender: { type: String }
    }],
    status: { type: Number, default: CONSTANTS.ORDER_STATUS.PAYMENT_PENDING },
    expiresAt: { type: Date }
}, { timestamps: true })

class OrderModelClass {
    static async createOrder(orderId, orderExpiry, orderData, counter) {
        const doc = await OrderModel.create({
            _id: orderId,
            user_id: orderData.user_id,
            counter: counter,
            products: orderData.products,
            amount: orderData.amount,
            date: orderData.date,
            time: orderData.time,
            address: orderData.address,
            members: orderData.members,
            status: CONSTANTS.ORDER_STATUS.PAYMENT_PENDING,
            expiresAt: orderExpiry
        })

        return doc;
    }

    static async fetchOrdersByUser(user_id, skip, limit) {
        return await OrderModel.find({ user_id: user_id, status: { $gte: CONSTANTS.ORDER_STATUS.BOOKED } }).skip(skip).limit(limit).sort({ _id: -1 });
    }

    static async deleteOrder(order_id) {
        await OrderModel.deleteOne({ _id: order_id });
    }

    static async deleteOrders(order_id_arr) {
        OrderModel.deleteMany({ _id: { $in: order_id_arr } }).exec();
    }

    static async updateStatusToBooked(order_id) {
        await OrderModel.updateOne({ _id: order_id }, { $set: { status: CONSTANTS.ORDER_STATUS.BOOKED }, $unset: { expiresAt: "" } });
    }
}

OrderSchema.loadClass(OrderModelClass);
const OrderModel = mongoose.model("order", OrderSchema, "orders");

module.exports = OrderModel;