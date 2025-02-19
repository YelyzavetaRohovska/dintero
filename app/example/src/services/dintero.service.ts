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

		let accessToken: string;

		try {
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

			if (!tokenResponse || !tokenResponse.data.access_token) {
				throw new Error('Failed to fetch Dintero token');
			}

			accessToken = tokenResponse.data.access_token;
		} catch (e) {
			throw new Error('Failed to fetch Dintero token');
		}

		return accessToken;
	}

	async getSessionLink(token: string, order: Pick<Payment, 'id' | 'amount' | 'currency'>) {
		let sessionLink: string;

		try {
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

			if (!sessionResponse || !sessionResponse.data.url) {
				throw new Error('Failed to create Dintero session');
			}

			sessionLink = sessionResponse.data.url;
		} catch (e) {
			throw new Error('Failed to create Dintero session');
		}

		return sessionLink;
	}
}

const dinteroService = new DinteroService();

export default dinteroService;
