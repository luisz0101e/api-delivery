import { Request, Response } from 'express';
import { pool } from '../db/connection';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo usuarios' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { full_name, phone, email } = req.body;
        const result = await pool.query(
            'INSERT INTO users (full_name, phone, email) VALUES ($1, $2, $3) RETURNING *',
            [full_name, phone, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error creando usuario' });
    }
};