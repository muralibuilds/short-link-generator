import { Router } from "express";
import { healthHandler } from "../controllers/health.controller";
import urlRoutes from "./url.routes";

const apiRouter = Router();

apiRouter.get("/health", healthHandler);
apiRouter.use("/short", urlRoutes);

export default apiRouter;
