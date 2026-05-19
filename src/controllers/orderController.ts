import { Request, Response } from 'express';
import { pool } from '../db/connection';

// Obtener pedidos
export const getOrders = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM orders');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo pedidos' });
    }
};

// Crear pedido
export const createOrder = async (req: Request, res: Response) => {
    try {
        const { user_id, restaurant_id, total_price } = req.body;
        const result = await pool.query(
            'INSERT INTO orders (user_id, restaurant_id, total_price) VALUES ($1, $2, $3) RETURNING *',
            [user_id, restaurant_id, total_price]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error creando pedido' });
    }
};

// NUEVA FUNCIÓN: Actualizar el estado y asignar repartidor
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        // Obtenemos el ID del pedido desde la URL (ej: /api/orders/1)
        const { id } = req.params;
        // Obtenemos los nuevos datos desde el cuerpo de la petición
        const { driver_id, status } = req.body;

        const result = await pool.query(
            'UPDATE orders SET driver_id = $1, status = $2 WHERE id = $3 RETURNING *',
            [driver_id, status, id]
        );

        // Validamos si el pedido realmente existía
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error actualizando pedido:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};