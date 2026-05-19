import { Request, Response } from 'express';
import { pool } from '../db/connection';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// 1. Obtener usuarios (solo mostramos datos seguros, sin la contraseña)
export const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT id, full_name, phone, email FROM users');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo usuarios' });
    }
};

// 2. Crear usuario (Ahora encripta la contraseña)
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { full_name, phone, email, password } = req.body;

        // Si no envía contraseña, mandamos error
        if (!password) {
            res.status(400).json({ error: 'La contraseña es obligatoria' });
            return;
        }

        // "Masticar" y encriptar la contraseña (saltRounds = 10 es el estándar de seguridad)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Guardar en la base de datos
        const result = await pool.query(
            'INSERT INTO users (full_name, phone, email, password) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email',
            [full_name, phone, email, hashedPassword]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creando usuario' });
    }
};

// 3. NUEVO: Función de Login
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // A) Buscar si el correo existe en la base de datos
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        const user = result.rows[0];

        // B) Comparar la contraseña enviada con la encriptada en PostgreSQL
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            res.status(401).json({ error: 'Contraseña incorrecta' });
            return;
        }

        // C) Generar el "Pase VIP" (Token JWT)
        const token = jwt.sign(
            { id: user.id, email: user.email }, // Datos guardados dentro del token
            process.env.JWT_SECRET as string,   // Tu clave secreta del archivo .env
            { expiresIn: '24h' }                // El token caduca en 1 día
        );

        // D) Devolver el token al usuario
        res.status(200).json({ 
            message: 'Login exitoso', 
            token: token,
            user: { id: user.id, full_name: user.full_name }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};