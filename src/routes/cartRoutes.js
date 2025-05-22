const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Rutas de carritos
router.post('/', cartController.createCart);
router.get('/:cid', cartController.getCartById);
router.post('/:cid/products/:pid', cartController.addProductToCart);
router.delete('/:cid/products/:pid', cartController.removeProductFromCart);
router.put('/:cid', cartController.updateCart);
router.put('/:cid/products/:pid', cartController.updateProductQuantity);
router.delete('/:cid', cartController.clearCart);

module.exports = router; 