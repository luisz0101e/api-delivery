import { Request, Response } from 'express';
import { pool } from '../db/connection';

export const getDrivers = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM drivers');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo repartidores' });
    }
};

export const createDriver = async (req: Request, res: Response) => {
    try {
        const { full_name, phone, vehicle_info } = req.body;
        const result = await pool.query(
            'INSERT INTO drivers (full_name, phone, vehicle_info) VALUES ($1, $2, $3) RETURNING *',
            [full_name, phone, vehicle_info]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error creando repartidor' });
    }
};