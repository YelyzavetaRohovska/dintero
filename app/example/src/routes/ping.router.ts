import { Router } from 'express';
import { requestWrap } from '../utils/requestWrap';

const router = Router();

router.get(
		"/",
		requestWrap(async (req, res) => {
			if (!req.prisma) {
				throw new Error('No database connection pool available');
			}

			await req.prisma.payment.count();
			return res.status(200).json({ ping: "pong" });
		}),
);

export default router;
