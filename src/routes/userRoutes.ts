import { Router } from 'express';
import { getUsers, createUser, login } from '../controllers/userController';

const router = Router();

router.get('/', getUsers);
router.post('/', createUser);
router.post('/login', login); // <-- NUEVA RUTA HABILITADA

export default router;