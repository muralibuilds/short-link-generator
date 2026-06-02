import type { RequestHandler } from "express";
import { successResponse } from "@repo/shared";
import { resolveShortUrl, shortenUrl } from "../services/url.service";

export const shortenUrlHandler: RequestHandler = async (req, res, next) => {
  try {
    const { origUrl } = req.body as { origUrl: string };
    const data = await shortenUrl(origUrl);
    res.status(200).json(successResponse(data));
  } catch (err) {
    next(err);
  }
};

export const redirectShortUrlHandler: RequestHandler = async (req, res, next) => {
  try {
    const { urlId } = req.params as { urlId: string };
    const destination = await resolveShortUrl(urlId);
    res.redirect(destination);
  } catch (err) {
    next(err);
  }
};
