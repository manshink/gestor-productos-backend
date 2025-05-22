const Cart = require('../models/Cart');
const Product = require('../models/Product');

const createCart = async (req, res) => {
    try {
        const cart = new Cart();
        await cart.save();
        res.status(201).json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const getCartById = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }
        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(404).json({
            status: 'error',
            message: error.message
        });
    }
};

const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        
        // Verificar si el producto existe
        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }

        // Buscar el carrito
        let cart = await Cart.findById(cid);
        if (!cart) {
            // Si el carrito no existe, crear uno nuevo
            cart = new Cart();
        }

        // Verificar si el producto ya está en el carrito
        const existingProduct = cart.products.find(p => p.product.toString() === pid);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        
        // Poblar los productos antes de enviar la respuesta
        await cart.populate('products.product');
        
        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const removeProductFromCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid);
        await cart.save();
        
        await cart.populate('products.product');
        
        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const updateCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        cart.products = req.body.products;
        await cart.save();
        
        await cart.populate('products.product');
        
        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const updateProductQuantity = async (req, res) => {
    try {
        const { quantity } = req.body;
        if (!quantity || quantity < 0) {
            return res.status(400).json({
                status: 'error',
                message: 'La cantidad debe ser un número positivo'
            });
        }

        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        const product = cart.products.find(p => p.product.toString() === req.params.pid);
        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado en el carrito'
            });
        }

        product.quantity = quantity;
        await cart.save();
        
        await cart.populate('products.product');
        
        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        cart.products = [];
        await cart.save();
        
        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const getCartView = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) {
            return res.status(404).render('error', { message: 'Carrito no encontrado' });
        }

        // Calcular el total
        const total = cart.products.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        res.render('carts/detail', {
            cart,
            total
        });
    } catch (error) {
        console.error('Error al obtener vista del carrito:', error);
        res.status(500).render('error', { message: 'Error al obtener el carrito' });
    }
};

module.exports = {
    createCart,
    getCartById,
    addProductToCart,
    removeProductFromCart,
    updateCart,
    updateProductQuantity,
    clearCart,
    getCartView
}; 