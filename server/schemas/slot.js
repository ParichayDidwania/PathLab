const mongoose = require('mongoose');
const CONSTANTS = require('../constants/constants');

const SlotSchema = new mongoose.Schema({
    counter: { type: Number, index: true, unique: true },
    on: { type: Date },
    slots: []
}, { timestamps: true })

class SlotModelClass {
    static async fetchSlotsByCounters(min, max) {
        return await SlotModel.find({ counter: { $gte: min, $lt: max } });
    }

    static async createSlotsByCounters(slotDataArr) {
        const docs = [];
        const timings = CONSTANTS.TIMINGS.map(x => {
            return {
                id: x.id,
                time: x.time,
                booked: false,
                tempBooked: false
            }
        })
        for(let slotData of slotDataArr) {    
            const doc = await SlotModel.create({
                counter: slotData.counter,
                on: slotData.on,
                slots: timings
            })

            docs.push(doc);
        }

        return docs;
    }

    static async fetchSlotByCounterAndId(counter, id) {
        return await SlotModel.findOne({ counter: counter, "slots.id": id }, { "slots.$": 1, on: 1 });
    }

    static async bookSlotByCounterAndId(counter, id, order_id) {
        return await SlotModel.updateOne({ counter: counter, slots: { $elemMatch: { id: id, booked: false, tempBooked: false } } }, { $set: { "slots.$.tempBooked": true, "slots.$.order_id": order_id } })
    }
}

SlotSchema.loadClass(SlotModelClass);
const SlotModel = mongoose.model("slot", SlotSchema, "slots");

module.exports = SlotModel;