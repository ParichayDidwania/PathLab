const express = require("express");
const ProductCatalogue = require("../helpers/productCatalogue");
const router = express.Router();

const homeTestIds = [1,2,3,4,4];
// TODO: change this to actual data from db, fetch at intervals
router.get('/all', async(req, res) => {
    res.send({
        message: "success",
        data: ProductCatalogue.getNoDescriptionCatalogue()
    })
})

router.get('/:id', async(req, res) => {
    const id = req.params.id;
    const product = ProductCatalogue.getById(id);
    if(product) {
        res.send({
            message: "success",
            data: product
        })
    } else {
        res.status(400).send({
            message: "Product not found"
        })
    }
})

router.get('/', async(req, res) => {
    res.send({
        message: "success",
        data: homeTestIds
    })
})

module.exports = router;
