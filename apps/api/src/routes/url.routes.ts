import { Router } from "express";
import { shortenUrlSchema, urlIdParamSchema } from "@repo/shared";
import {
  redirectShortUrlHandler,
  shortenUrlHandler,
} from "../controllers/url.controller";
import { validateBody, validateParams } from "../middleware/validate";

const router = Router();

router.post("/", validateBody(shortenUrlSchema), shortenUrlHandler);
router.get(
  "/:urlId",
  validateParams(urlIdParamSchema),
  redirectShortUrlHandler
);

export default router;
