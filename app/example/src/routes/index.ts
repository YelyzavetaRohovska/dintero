import { Router } from 'express';

import pingRouter from './ping.router';
import ordersRouter from './orders.route';

const router = Router();

router.use('/ping', pingRouter);
router.use('/orders', ordersRouter);

export default router;
