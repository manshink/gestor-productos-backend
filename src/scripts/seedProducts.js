require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const products = [
    {
        title: "Smartphone XYZ",
        description: "Último modelo con cámara de alta resolución",
        price: 699.99,
        thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60",
        code: "PHN001",
        stock: 50,
        category: "electronics",
        status: true
    },
    {
        title: "Laptop Pro",
        description: "Potente laptop para profesionales",
        price: 1299.99,
        thumbnail: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60",
        code: "LPT001",
        stock: 30,
        category: "electronics",
        status: true
    },
    {
        title: "Camiseta Básica",
        description: "Camiseta 100% algodón",
        price: 19.99,
        thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60",
        code: "CLT001",
        stock: 100,
        category: "clothing",
        status: true
    },
    {
        title: "Libro de Programación",
        description: "Aprende JavaScript desde cero",
        price: 29.99,
        thumbnail: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60",
        code: "BOK001",
        stock: 75,
        category: "books",
        status: true
    }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado a MongoDB');

        // Limpiar productos existentes
        await Product.deleteMany({});
        console.log('Productos existentes eliminados');

        // Insertar nuevos productos
        await Product.insertMany(products);
        console.log('Productos de prueba agregados exitosamente');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedProducts(); 