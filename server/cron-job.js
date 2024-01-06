require('dotenv').config();
const cron = require('node-cron');

const connectDB = require("./mongoConnection");
const SlotFunction = require('./functions/slot');

async function start() {
    await connectDB();

    cron.schedule('0 * * *', async () => {
        await SlotFunction.clearExpiredSlotCronJob();
    }, {
        scheduled: true,
        // timezone: "America/Sao_Paulo"
    });
}

start();