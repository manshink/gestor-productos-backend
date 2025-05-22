require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const connectDB = require('./config/database');
const productController = require('./controllers/productController');
const cartController = require('./controllers/cartController');

// Verificar variables de entorno
console.log('Variables de entorno cargadas:');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);

const app = express();

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine({
    helpers: {
        multiply: function(a, b) {
            return a * b;
        }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB
connectDB();

// Rutas API
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/carts', require('./routes/cartRoutes'));

// Rutas de vistas
app.get('/products', productController.getProductsView);
app.get('/products/:pid', productController.getProductDetailView);
app.get('/carts/:cid', cartController.getCartView);

app.get('/carts/:cid', async (req, res) => {
    try {
        const response = await fetch(`http://localhost:${process.env.PORT}/api/carts/${req.params.cid}`);
        const data = await response.json();
        
        // Calcular el total
        const total = data.payload.products.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        res.render('carts/detail', { 
            cart: data.payload,
            total: total
        });
    } catch (error) {
        res.status(500).render('error', { message: error.message });
    }
});

// Ruta de error
app.get('/error', (req, res) => {
    res.render('error', { message: 'Ha ocurrido un error' });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: 'Ha ocurrido un error en el servidor' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 