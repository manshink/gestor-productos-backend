const express = require('express');
const ProductManager = require('../ProductManager.js');

const router = express.Router();
const productManager = new ProductManager();


router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const productData = req.body;
        const newProduct = await productManager.addProduct(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.put('/:pid', async (req, res) => {
    try {
        const productData = req.body;
        const updatedProduct = await productManager.updateProduct(req.params.pid, productData);
        res.json(updatedProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


router.delete('/:pid', async (req, res) => {
    try {
        await productManager.deleteProduct(req.params.pid);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router; 