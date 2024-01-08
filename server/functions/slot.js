const CONSTANTS = require('../constants/constants');
const OrderModel = require('../schemas/order');
const SlotModel = require('../schemas/slot');
const moment = require('moment');

class SlotFunction {

    static async checkAndCreateSlots() {
        const min = SlotFunction.getCounter();
        const max = min + CONSTANTS.BOOKING_PERIOD;
        let slotDocs = await SlotModel.fetchSlotsByCounters(min, max);
        slotDocs = await SlotFunction.clearExpiredSlots(slotDocs);

        const allCounters = {};

        for(let i = min; i < max; i++) {
            allCounters[i] = false;
        }

        for(let slotDoc of slotDocs) {
            delete allCounters[slotDoc.counter];
        }

        const missingSlots = Object.keys(allCounters).map(x => {
            const counter = parseInt(x);
            return {
                counter: counter,
                on: SlotFunction.getDayFromCounter(counter)
            }
        });

        let finalSlotDocs = [];

        try {
            const missingSlotDocs = await SlotModel.createSlotsByCounters(missingSlots);
            finalSlotDocs = [...slotDocs, ...missingSlotDocs].sort((a, b) => {
                return a.counter - b.counter;
            })
        } catch (err) {
            if(err.name === 'MongoServerError' && err.code === 11000) { //Will hit if multiple create slots are triggered at same time as "counter" is unique index
                finalSlotDocs = await SlotModel.fetchSlotsByCounters(min, max);
            }
        }

        return finalSlotDocs;
    }

    static async clearExpiredSlots(slotDocs) { // WONT DELETE ORDERS
        const clearExpiredSlotPromises = [];
        for(const slotDoc of slotDocs) {
            for(const slot of slotDoc.slots) {
                if(slot.tempBooked && moment().isAfter(moment(slot.expiresAt))) {
                    clearExpiredSlotPromises.push(SlotModel.clearSlotByCounterAndId(slotDoc.counter, slot.id, slot.order_id, true));
                }
            }
        }

        if(clearExpiredSlotPromises.length == 0) {
            return slotDocs;
        } else {
            await Promise.all(clearExpiredSlotPromises);
            const min = SlotFunction.getCounter();
            const max = min + CONSTANTS.BOOKING_PERIOD;
            const latestSlotDocs = await SlotModel.fetchSlotsByCounters(min, max);
            return latestSlotDocs;
        }
    }

    static getCounter() {
        return moment().diff(CONSTANTS.START_DATE, 'd') + 1;
    }

    static getDayFromCounter(counter) { 
        return moment(CONSTANTS.START_DATE).add(counter, 'd');
    }   

    static formatDate(slotDocs) {
        const formattedSlotDocs = [];
        for(const slotDoc of slotDocs) {
            const formattedSlotDoc = slotDoc.toObject();
            formattedSlotDoc.onStr =  moment(formattedSlotDoc.on).format("MMMM DD, YYYY");
            formattedSlotDocs.push(formattedSlotDoc);
        }

        return formattedSlotDocs
    }
}

module.exports = SlotFunction;