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
}

DetailSchema.loadClass(DetailModelClass);
const DetailModel = mongoose.model("detail", DetailSchema, "details");

module.exports = DetailModel;