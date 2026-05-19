import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db/connection';

// Importar todas las rutas
import restaurantRoutes from './routes/restaurantRoutes';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import driverRoutes from './routes/driverRoutes';
import orderRoutes from './routes/orderRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Probar conexión a BD
pool.connect()
    .then(() => console.log('✅ Base de datos conectada'))
    .catch((err) => console.error('❌ Error de conexión', err));

// Activar todas las rutas
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});