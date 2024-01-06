const express = require('express');
const DetailModel = require('../schemas/detail');
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

module.exports = router;