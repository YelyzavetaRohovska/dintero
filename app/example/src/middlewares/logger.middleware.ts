import { RequestHandler, Response } from "express";

type EndParameters = Parameters<Response["end"]>;

export const simpleRequestLogger: RequestHandler = (req, res, next) => {
		const defaultEnd = res.end;
		const endOverride = (...params: EndParameters) => {
				defaultEnd.apply(res, params);
				console.log(
						new Date().toISOString(),
						req.method,
						req.url,
						res.statusCode,
				);
		};
		res.end = endOverride as Response["end"];
		next();
};
