import { Router } from 'express';
import { getOrders, createOrder, updateOrderStatus } from '../controllers/orderController';

const router = Router();

router.get('/', getOrders);
router.post('/', createOrder);

// NUEVA RUTA: Usamos :id para capturar el número del pedido dinámicamente
router.put('/:id', updateOrderStatus);

export default router;