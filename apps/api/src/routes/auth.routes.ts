import { Router } from "express";
import { loginSchema, registerSchema } from "@repo/shared";
import {
  loginHandler,
  logoutHandler,
  meHandler,
  registerHandler,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";
import { validateBody } from "../middleware/validate";

const router = Router();

router.post("/register", validateBody(registerSchema), registerHandler);
router.post("/login", validateBody(loginSchema), loginHandler);
router.post("/logout", logoutHandler);
router.get("/me", authenticate({ required: true }), meHandler);

export default router;
