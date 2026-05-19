import { Request, Response } from 'express';
import { pool } from '../db/connection';

// Función para obtener restaurantes (la que ya teníamos)
export const getRestaurants = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM restaurants');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error obteniendo restaurantes:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// NUEVA Función para crear un restaurante
export const createRestaurant = async (req: Request, res: Response) => {
    try {
        // Extraemos los datos que nos enviará la aplicación
        const { name, address, phone } = req.body;

        // Le decimos a PostgreSQL que inserte los datos y nos devuelva (* RETURNING) la fila creada
        const result = await pool.query(
            'INSERT INTO restaurants (name, address, phone) VALUES ($1, $2, $3) RETURNING *',
            [name, address, phone]
        );
        
        // Respondemos con un código 201 (Creado) y los datos del nuevo restaurante
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creando restaurante:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};