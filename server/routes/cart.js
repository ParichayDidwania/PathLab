const express = require('express');
const ProductCatalogue = require('../helpers/productCatalogue');
const router = express.Router();

router.post('/price', async (req, res) => {
    const itemCost = ProductCatalogue.getCartItemsCost(req.body.cart);
    const commuteCost = ProductCatalogue.getCommuteCost();
    const total = itemCost + commuteCost;

    res.send({
        message: "success",
        data: {
            "items": itemCost,
            "commute": commuteCost,
            "total": total
        }
    })
})

module.exports = router;