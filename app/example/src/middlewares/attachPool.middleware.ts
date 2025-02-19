import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";

const prisma = new PrismaClient();

export const attachPoolToRequest: RequestHandler = (req, _, next) => {
	req.prisma = prisma;
	next();
};

process.on("SIGTERM", async () => {
	console.log("Closing database connection...");
	await prisma.$disconnect();
	process.exit(0);
});
