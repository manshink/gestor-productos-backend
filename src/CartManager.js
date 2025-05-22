const Cart = require('./models/Cart');
const Product = require('./models/Product');

class CartManager {
    constructor() {
        // Ya no necesitamos el path ni el array de carritos
    }

    async createCart() {
        try {
            const newCart = new Cart({
                products: []
            });
            await newCart.save();
            return newCart;
        } catch (error) {
            throw new Error('Error al crear el carrito: ' + error.message);
        }
    }

    async getCartById(id) {
        try {
            const cart = await Cart.findById(id).populate('products.product');
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            return cart;
        } catch (error) {
            throw new Error('Error al obtener el carrito: ' + error.message);
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            const existingProduct = cart.products.find(p => p.product.toString() === productId);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.products.push({
                    product: productId,
                    quantity: 1
                });
            }

            await cart.save();
            return await this.getCartById(cartId);
        } catch (error) {
            throw new Error('Error al agregar producto al carrito: ' + error.message);
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = cart.products.filter(p => p.product.toString() !== productId);
            await cart.save();
            return await this.getCartById(cartId);
        } catch (error) {
            throw new Error('Error al eliminar producto del carrito: ' + error.message);
        }
    }

    async updateCart(cartId, products) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = products;
            await cart.save();
            return await this.getCartById(cartId);
        } catch (error) {
            throw new Error('Error al actualizar el carrito: ' + error.message);
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const product = cart.products.find(p => p.product.toString() === productId);
            if (!product) {
                throw new Error('Producto no encontrado en el carrito');
            }

            product.quantity = quantity;
            await cart.save();
            return await this.getCartById(cartId);
        } catch (error) {
            throw new Error('Error al actualizar la cantidad del producto: ' + error.message);
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = [];
            await cart.save();
            return await this.getCartById(cartId);
        } catch (error) {
            throw new Error('Error al vaciar el carrito: ' + error.message);
        }
    }
}

module.exports = CartManager; 