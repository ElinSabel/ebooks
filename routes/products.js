const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products or search by name : eg. http://localhost:5001/products?name=prince
router.get('/', async (req, res) => {
    try {
        const { name } = req.query;  // Extract the search parameter from the query string
        let products;

        if (name) {
            // If a search name is provided, find products matching the name (case-insensitive)
            products = await Product.find({ name: { $regex: name, $options: 'i' } });
        } else {
            // If no search parameter, return all products
            products = await Product.find();
        }

        res.status(200).json(products); // Send response with products
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET the choosen category 
/* router.get('/category/:category', async (req, res) => {
    // res.json(({message: req.params.category}))
    try {
        res.json(await Product.find(req.params.productId));
    } catch(error) {
        res.json({message: error});
    }
}); */

module.exports = router;