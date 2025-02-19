import { Router } from 'express';

import { requestWrap } from '../utils/requestWrap';
import { createOrder, getOrders, paymentRedirectHandler } from '../controllers/orders.controller';

const router = Router();

router.get('/', requestWrap(getOrders));

router.get('/:id/payment-redirect', requestWrap(paymentRedirectHandler));

router.post('/', requestWrap(createOrder));

export default router;
