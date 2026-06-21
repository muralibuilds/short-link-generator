import { Router } from "express";
import { healthHandler } from "../controllers/health.controller";
import authRoutes from "./auth.routes";
import urlRoutes from "./url.routes";

const apiRouter = Router();

apiRouter.get("/health", healthHandler);
apiRouter.use("/auth", authRoutes);
apiRouter.use("/short", urlRoutes);

export default apiRouter;
