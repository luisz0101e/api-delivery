import { Router } from 'express';
import { getDrivers, createDriver } from '../controllers/driverController';
const router = Router();
router.get('/', getDrivers);
router.post('/', createDriver);
export default router;