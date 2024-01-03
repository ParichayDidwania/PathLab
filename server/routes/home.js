const express = require("express");
const ProductCatalogue = require("../helpers/productCatalogue");
const router = express.Router();

const homeTestIds = [1,2,3,4,4];

router.get('/all', async(req, res) => {
    res.send({
        message: "success",
        data: ProductCatalogue.getAll()
    })
})

router.get('/', async(req, res) => {
    res.send({
        message: "success",
        data: homeTestIds
    })
})

module.exports = router;