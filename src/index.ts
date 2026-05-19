import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import restaurantRoutes from './routes/restaurantRoutes';
import { pool } from './db/connection';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Probar conexión a BD
pool.connect()
    .then(() => console.log('✅ Base de datos conectada'))
    .catch((err) => console.error('❌ Error de conexión', err));

// Usar nuestras nuevas rutas
app.use('/api/restaurants', restaurantRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});