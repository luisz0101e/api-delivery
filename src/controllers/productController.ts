import { Request, Response } from 'express';
import { pool } from '../db/connection';

// Obtener todos los productos
export const getProducts = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error obteniendo productos:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear un nuevo producto
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { restaurant_id, name, description, price } = req.body;

        const result = await pool.query(
            'INSERT INTO products (restaurant_id, name, description, price) VALUES ($1, $2, $3, $4) RETURNING *',
            [restaurant_id, name, description, price]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creando producto:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};