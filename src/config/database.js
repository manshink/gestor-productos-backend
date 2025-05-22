const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        console.log('Intentando conectar a MongoDB...');
        console.log('URI:', process.env.MONGODB_URI);
        
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout después de 5 segundos
            socketTimeoutMS: 45000, // Timeout de socket después de 45 segundos
            family: 4 // Forzar IPv4
        });
        
        console.log(`MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error de conexión: ${error.message}`);
        console.error('Asegúrate de que MongoDB esté instalado y corriendo en tu sistema.');
        console.error('Si estás usando MongoDB local, verifica que el servicio esté activo.');
        process.exit(1);
    }
};

module.exports = connectDB; 