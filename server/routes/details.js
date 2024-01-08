const express = require('express');
const DetailModel = require('../schemas/detail');
const HelperClass = require('../helpers/helper');
const router = express.Router();

router.get('/', async (req, res) => {
    const detailDoc = await DetailModel.fetchDetailsByUser(req.user._id);
    if(detailDoc) {
        res.send({
            message: "success",
            data: detailDoc
        })
    } else {
        res.status(400).send({
            error: "Address not found"
        })
    }
})

router.post("/", async (req, res) => {
    let {
        address_1,
        address_2,
        city,
        state,
        pin_code,
        phone
    } = req.body;

    if(
        HelperClass.isNullOrEmptyString(address_1) || 
        HelperClass.isNullOrEmptyString(city) || 
        HelperClass.isNullOrEmptyString(state) || 
        HelperClass.isNullOrEmptyString(pin_code) || 
        HelperClass.isNullOrEmptyString(phone)
    ) {
        res.status(400).send({ error: "Fields are missing" });
        return;
    }

    try {
        pin_code = parseInt(pin_code);
        phone = parseInt(phone);
    } catch (e) {
        res.status(400).send({ error: "Invalid pincode or phone number" });
        return;
    }

    await DetailModel.createOrUpdateDetails({
        user_id: req.user._id,
        address_1,
        address_2,
        city,
        state,
        pin_code,
        phone
    });

    res.send({ message: "success", data: {
        address_1,
        address_2,
        city,
        state,
        pin_code,
        phone
    }});
})

module.exports = router;