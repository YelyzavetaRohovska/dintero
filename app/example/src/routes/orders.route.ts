import { Router } from 'express';

import { validateBody, validateParams } from '../middlewares';
import { createPaymentSchema, paramsPaymentSchema } from '../validation/orders.validation';

import { requestWrap } from '../utils/requestWrap';
import { createOrder, getOrders, paymentRedirectHandler } from '../controllers/orders.controller';

const router = Router();

router.get('/', requestWrap(getOrders));

router.get('/:id/payment-redirect', validateParams(paramsPaymentSchema), requestWrap(paymentRedirectHandler));

router.post('/', validateBody(createPaymentSchema), requestWrap(createOrder));

export default router;
