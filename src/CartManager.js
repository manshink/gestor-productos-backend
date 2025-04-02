const fs = require('fs').promises;
const path = require('path');

class CartManager {
    constructor() {
        this.carts = [];
        this.path = path.join(__dirname, '../../data/carts.json');
    }

    async initialize() {
        try {
            await fs.access(this.path);
            const data = await fs.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
        } catch (error) {
            await fs.writeFile(this.path, JSON.stringify([], null, 2));
        }
    }

    async saveCarts() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async createCart() {
        await this.initialize();
        const newCart = {
            id: Date.now().toString(),
            products: []
        };
        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }

    async getCartById(id) {
        await this.initialize();
        const cart = this.carts.find(c => c.id === id);
        if (!cart) {
            throw new Error('Cart not found');
        }
        return cart;
    }

    async addProductToCart(cartId, productId) {
        await this.initialize();
        const cart = await this.getCartById(cartId);
        const existingProduct = cart.products.find(p => p.product === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({
                product: productId,
                quantity: 1
            });
        }

        await this.saveCarts();
        return cart;
    }
}

module.exports = CartManager; 