const express = require('express');
const mongoose = require('mongoose'); // added mongoose since it search for its ObjectID
const router = express.Router();
const Product = require('../models/Product');
 
// GET products with optional filtering by name and category, http://localhost:5001/products?_id=''&name=''&categories='','(om man vill ha flera categorier)'
router.get('/', async (req, res) => {
    try {
        const { _id, name, categories } = req.query;
        const filter = {};
 
        // Filter by ID
        if (_id) {
            if (mongoose.Types.ObjectId.isValid(_id)) {
                filter._id = _id; // Ensure it's a valid ObjectId before filtering
            } else {
                return res.status(400).json({ message: 'Invalid _id format.' });
            }
        }
        // Filter by Name, non sensetive to case
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
 
        // Filter by categories (handling arrays)
        if (categories) {
            const categoriesArray = categories.split(','); // Split by comma for multiple categories
            filter.categories = { $in: categoriesArray.map(cat => new RegExp(cat, 'i')) }; // Case-insensitive
        }
 
        const products = await Product.find(filter);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
});
 

module.exports = router;