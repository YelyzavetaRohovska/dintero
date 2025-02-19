import { RequestHandler } from "express";

export const requestWrap = (fn: RequestHandler): RequestHandler => {
		return (req, res, next) => {
				Promise.resolve(fn(req, res, next)).catch(next);
		};
};
