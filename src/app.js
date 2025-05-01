const express = require('express');
const { engine } = require('express-handlebars');
const { createServer } = require('http');
const { Server } = require('socket.io');
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const ProductManager = require('./ProductManager.js');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const PORT = 8080;
const productManager = new ProductManager();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        console.error('Error loading products:', error);
        res.status(500).send('Error loading products');
    }
});

app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error('Error loading products:', error);
        res.status(500).send('Error loading products');
    }
});

io.on('connection', async (socket) => {
    console.log('New client connected');

    try {
        const products = await productManager.getProducts();
        socket.emit('updateProducts', products);
    } catch (error) {
        console.error('Error sending initial products:', error);
    }

    socket.on('newProduct', async (product) => {
        try {
            console.log('Adding new product:', product);
            const newProduct = await productManager.addProduct(product);
            const products = await productManager.getProducts();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error adding product:', error);
            socket.emit('error', { message: error.message });
        }
    });

    socket.on('deleteProduct', async (id) => {
        try {
            console.log('Deleting product:', id);
            await productManager.deleteProduct(id);
            const products = await productManager.getProducts();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error deleting product:', error);
            socket.emit('error', { message: error.message });
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 