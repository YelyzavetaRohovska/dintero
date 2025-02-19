import { Request, Response } from 'express';
import { Payment, PaymentInput, PaymentStatus, PaymentWithLinks } from '../types/orders';
import dinteroService from '../services/dintero.service';

export const getOrders = async (req: Request, res: Response<{ orders: Payment[] }>) => {
	const { prisma } = req;

	if (!prisma) {
		throw new Error('No database connection pool available');
	}

	const orders = await prisma.payment.findMany();
	return res.status(200).json({ orders });
}

export const paymentRedirectHandler = async (req: Request, res: Response) => {
	const { prisma, params } = req;

	if (!prisma) {
		throw new Error('No database connection pool available');
	}

	const order = await prisma.payment.findFirstOrThrow({
		select: { id: true },
		where: { id: params.id },
	});

	await prisma.payment.update({
			where: { id: order.id },
			data: { status: PaymentStatus.Authorized }
	});

	return res.status(200).json({ success: true });
}

export const createOrder = async (req: Request<any, any, PaymentInput>, res: Response<PaymentWithLinks>) => {
	const { prisma, body } = req;

	if (!prisma) {
		throw new Error('No database connection pool available');
	}

	const order = await prisma.payment.create({
		data: {
			amount: body.amount,
			currency: body.currency,
			receipt: body.receipt,
			status: PaymentStatus.Pending,
		}
	});

	const access_token = await dinteroService.getToken();
	const sessionLink = await dinteroService.getSessionLink(access_token, {
		id: order.id,
		amount: order.amount,
		currency: order.currency,
	});

	const updatedOrder = await prisma.payment.update({
    where: { id: order.id },
    data: {
			links: {
				create: { rel: 'session_link', href: sessionLink },
			},
    },
    include: { 
			links: {
				select: { rel: true, href: true },
			}
		},
	});

	return res.status(200).json(updatedOrder);
}
