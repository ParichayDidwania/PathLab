const moment = require('moment');

class CONSTANTS {
    static START_DATE = moment('2024-01-04T04:00:00Z');
    static BOOKING_PERIOD = 7; //days
    static TIMINGS = [
        { id: 1, time: "7:00 AM" },
        { id: 2, time: "8:00 AM" },
        { id: 3, time: "9:00 AM" },
        { id: 4, time: "10:00 AM" },
        { id: 5, time: "11:00 AM" },
        { id: 6, time: "12:00 PM" },
        { id: 7, time: "1:00 PM" },
        { id: 8, time: "2:00 PM" },
        { id: 9, time: "3:00 PM" },
        { id: 10, time: "4:00 PM" },
        { id: 11, time: "5:00 PM" },
        { id: 12, time: "6:00 PM" },
        { id: 13, time: "7:00 PM" },
        { id: 14, time: "8:00 PM" }
    ];

    static ORDER_STATUS = {
        PAYMENT_PENDING: 0,
        BOOKED: 1,
        SAMPLE_COLLECTED: 2,
        COMPLETED: 3
    } 
}

module.exports = CONSTANTS;
