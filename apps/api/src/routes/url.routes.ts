import { Router } from "express";
import { shortenUrlSchema, urlIdParamSchema } from "@repo/shared";
import {
  listClicksHandler,
  listShortUrlsHandler,
  redirectShortUrlHandler,
  shortenUrlHandler,
} from "../controllers/url.controller";
import { authenticate } from "../middleware/auth";
import { validateBody, validateParams } from "../middleware/validate";

const router = Router();

router.get("/", authenticate({ required: true }), listShortUrlsHandler);
router.post(
  "/",
  authenticate({ required: true }),
  validateBody(shortenUrlSchema),
  shortenUrlHandler
);
router.get(
  "/:urlId/clicks",
  authenticate({ required: true }),
  validateParams(urlIdParamSchema),
  listClicksHandler
);
router.get(
  "/:urlId",
  validateParams(urlIdParamSchema),
  redirectShortUrlHandler
);

export default router;
