import { Router } from 'express';
import { getOrders, createOrder, updateOrderStatus } from '../controllers/orderController';
import { verifyToken } from '../middlewares/authMiddleware'; // <-- 1. Importamos el guardia

const router = Router();

// 2. Ponemos al guardia en medio de la ruta y el controlador
router.get('/', verifyToken, getOrders);
router.post('/', verifyToken, createOrder);
router.put('/:id', verifyToken, updateOrderStatus);

export default router;