const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor() {
        this.products = [];
        this.path = path.join(__dirname, '../data/products.json');
    }

    async initialize() {
        try {
            await fs.access(this.path);
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
            await fs.writeFile(this.path, JSON.stringify([], null, 2));
        }
    }

    async saveProducts() {
        await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
    }

    async getProducts() {
        await this.initialize();
        return this.products;
    }

    async getProductById(id) {
        await this.initialize();
        const product = this.products.find(p => p.id === id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async addProduct(productData) {
        await this.initialize();
    
        if (!productData.title || !productData.description || !productData.code || 
            !productData.price || !productData.stock || !productData.category) {
            throw new Error('Te falto alguna propiedad del producto!');
        }
    
        const newProduct = {
            id: Date.now().toString(),
            title: productData.title,
            description: productData.description,
            code: productData.code,
            price: parseFloat(productData.price),
            status: true,
            stock: parseInt(productData.stock),
            category: productData.category,
            thumbnails: productData.thumbnails || []
        };
    
        this.products.push(newProduct);
        await this.saveProducts();
    
        return newProduct;
    }
    

    async updateProduct(id, productData) {
        await this.initialize();
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('Producto no encontrado');
        }
        this.products[index] = {
            ...this.products[index],
            ...productData,
            id 
        };
        await this.saveProducts();
        return this.products[index];
    }

    async deleteProduct(id) {
        await this.initialize();
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('Producto no encontrado');
        }
        this.products.splice(index, 1);
        await this.saveProducts();
    }
}

module.exports = ProductManager; 