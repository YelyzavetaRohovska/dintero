import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, _, res, next) => {
		console.error(err);

		if (res.headersSent) {
				return next(err);
		}

		res.status(500).json({ error: { message: "server error" } });
};
