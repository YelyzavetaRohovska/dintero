import { Payment } from '@prisma/client';
import axios from 'axios';

const dinteroTestUrl = 'https://test.dintero.com/v1';
const dinteroCheckoutUrl = 'https://checkout.test.dintero.com/v1';

class DinteroService {
	constructor() {}

	async getToken() {
		if (!process.env.DINTERO_CLIENT_ID || !process.env.DINTERO_SECRET) {
			throw new Error('Authorization creadentials are missing');
		}

		const tokenResponse = await axios.post(
			`${dinteroTestUrl}/accounts/${process.env.DINTERO_ACCOUNT}/auth/token`, {
				grant_type: 'client_credentials',
				audience: `${dinteroTestUrl}/accounts/${process.env.DINTERO_ACCOUNT}`
			}, {
			auth: {
				username: process.env.DINTERO_CLIENT_ID,
				password: process.env.DINTERO_SECRET,
			}
		});

		if (!tokenResponse) {
			throw new Error('Failed to fetch Dintero token');
		}

		return tokenResponse.data.access_token;
	}

	async getSessionLink(token: string, order: Pick<Payment, 'id' | 'amount' | 'currency'>) {
		const sessionResponse = await axios.post(`${dinteroCheckoutUrl}/sessions-profile`, {
			url: {
				return_url: `${process.env.APP_BASE_URL	}/orders/${order.id}/payment-redirect`
			},
			order: {
				amount: order.amount,
				currency: order.currency,
				merchant_reference: order.id,
			},
			profile_id: 'default'
		}, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});

		if (!sessionResponse) {
			throw new Error('Failed to create Dintero session');
		}

		return sessionResponse.data.url;
	}
}

const dinteroService = new DinteroService();

export default dinteroService;
