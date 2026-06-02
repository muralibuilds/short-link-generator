import type { RequestHandler } from "express";
import { successResponse } from "@repo/shared";

export const healthHandler: RequestHandler = (_req, res) => {
  res.json(
    successResponse({
      status: "ok",
      timestamp: new Date().toISOString(),
    })
  );
};
