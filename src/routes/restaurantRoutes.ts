import { Router } from 'express';
import { getRestaurants, createRestaurant } from '../controllers/restaurantController';

const router = Router();

// GET: Para pedir datos (ver en el navegador)
router.get('/', getRestaurants);

// POST: Para enviar datos (crear nuevo registro)
router.post('/', createRestaurant);

export default router;