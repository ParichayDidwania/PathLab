const mongoose = require('mongoose');

const DetailSchema = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId },
    address_1: { type: String },
    address_2: { type: String },
    city: { type: String },
    state: { type: String },
    pin_code: { type: Number },
    phone: { type: Number }    
}, { timestamps: true })

class DetailModelClass {
    static async fetchDetailsByUser(user_id) {
        return await DetailModel.findOne({ user_id: user_id });
    }

    static async createOrUpdateDetails(detailObj) {
        await DetailModel.updateOne({
            user_id: detailObj.user_id
        }, { $set: {
            address_1: detailObj.address_1,
            address_2: detailObj.address_2,
            city: detailObj.city,
            state: detailObj.state,
            pin_code: detailObj.pin_code,
            phone: detailObj.phone
        }}, { upsert: true });
    }
}

DetailSchema.loadClass(DetailModelClass);
const DetailModel = mongoose.model("detail", DetailSchema, "details");

module.exports = DetailModel;