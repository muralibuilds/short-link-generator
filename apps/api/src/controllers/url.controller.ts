import type { RequestHandler } from "express";
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  successResponse,
} from "@repo/shared";
import { listClickEvents } from "../services/click.service";
import {
  assertLinkOwner,
  listUserShortUrls,
  resolveShortUrl,
  shortenUrl,
} from "../services/url.service";
import { AppError } from "../middleware/errorHandler";

function parsePagination(query: {
  page?: string;
  limit?: string;
}): { page: number; limit: number } {
  const page = query.page ? Number(query.page) : DEFAULT_PAGE;
  const limit = query.limit ? Number(query.limit) : DEFAULT_LIMIT;
  return {
    page: Number.isFinite(page) ? page : DEFAULT_PAGE,
    limit: Number.isFinite(limit) ? limit : DEFAULT_LIMIT,
  };
}

export const shortenUrlHandler: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user?.userId) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    const { origUrl } = req.body as { origUrl: string };
    const data = await shortenUrl(origUrl, req.user.userId);
    res.status(200).json(successResponse(data));
  } catch (err) {
    next(err);
  }
};

export const listShortUrlsHandler: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user?.userId) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    const { page, limit } = parsePagination(req.query);
    const data = await listUserShortUrls(req.user.userId, page, limit);
    res.json(successResponse(data));
  } catch (err) {
    next(err);
  }
};

export const listClicksHandler: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user?.userId) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    const { urlId } = req.params as { urlId: string };
    await assertLinkOwner(urlId, req.user.userId);
    const { page, limit } = parsePagination(req.query);
    const data = await listClickEvents(urlId, page, limit);
    res.json(successResponse(data));
  } catch (err) {
    next(err);
  }
};

export const redirectShortUrlHandler: RequestHandler = async (req, res, next) => {
  try {
    const { urlId } = req.params as { urlId: string };
    const destination = await resolveShortUrl(urlId, req);
    res.redirect(destination);
  } catch (err) {
    next(err);
  }
};
