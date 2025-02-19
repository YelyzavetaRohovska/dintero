import express from "express";
import router from "./routes";
import { attachPoolToRequest, errorHandler, simpleRequestLogger } from "./middlewares";

const api = express();

api.set("port", Number.parseInt(process.env.PORT || "3000"));
api.set("host", process.env.HOST || "0.0.0.0");

api.use(express.json());
api.use(simpleRequestLogger);
api.use(attachPoolToRequest);

api.use(router);

api.use(errorHandler);

export { api };
