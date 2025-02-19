import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

declare global {
    namespace Express {
        interface Request {
            prisma?: PrismaClient;
        }
    }
}
