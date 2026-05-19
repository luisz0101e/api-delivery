import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    // 1. Buscamos el token en la cabecera de la petición
    const authHeader = req.header('Authorization');

    // Si no trae nada, le negamos el paso
    if (!authHeader) {
        res.status(401).json({ error: 'Acceso denegado. Se requiere un Token.' });
        return;
    }

    try {
        // Los tokens suelen enviarse con la palabra "Bearer" antes, ej: "Bearer eyJhb..."
        // Así que separamos esa palabra para quedarnos solo con el código
        const token = authHeader.split(' ')[1];

        // 2. Verificamos que sea un token real firmado por nosotros
        const verified = jwt.verify(token, process.env.JWT_SECRET as string);
        
        // 3. Si es real, guardamos los datos del usuario y le damos permiso de pasar (next)
        (req as any).user = verified;
        next(); 
        
    } catch (error) {
        res.status(400).json({ error: 'El Token no es válido o ya expiró' });
    }
};