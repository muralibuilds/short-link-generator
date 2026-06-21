import type { Request } from "express";
import { nanoid } from "nanoid";
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  SHORT_URL_ID_LENGTH,
  buildShortUrl,
  type ShortUrlDto,
} from "@repo/shared";
import { env } from "../config/env";
import { AppError } from "../middleware/errorHandler";
import { ShortUrlModel } from "../models/shortUrl.model";
import { recordClick } from "./click.service";

function toDto(doc: {
  _id: { toString(): string };
  userId?: { toString(): string } | null;
  urlId: string;
  origUrl: string;
  shortUrl: string;
  clicks: number;
  date: Date;
}): ShortUrlDto {
  return {
    _id: doc._id.toString(),
    userId: doc.userId?.toString(),
    urlId: doc.urlId,
    origUrl: doc.origUrl,
    shortUrl: doc.shortUrl,
    clicks: doc.clicks,
    date: doc.date,
  };
}

export async function assertLinkOwner(
  urlId: string,
  userId: string
): Promise<ShortUrlDto> {
  const url = await ShortUrlModel.findOne({ urlId });
  if (!url) {
    throw new AppError("Short URL not found", 404, "NOT_FOUND");
  }
  if (!url.userId || url.userId.toString() !== userId) {
    throw new AppError("Forbidden", 403, "UNAUTHORIZED");
  }
  return toDto(url);
}

export async function shortenUrl(
  origUrl: string,
  userId: string
): Promise<ShortUrlDto> {
  const existing = await ShortUrlModel.findOne({ origUrl, userId });
  if (existing) {
    return toDto(existing);
  }

  const urlId = nanoid(SHORT_URL_ID_LENGTH);
  const shortUrl = buildShortUrl(env.baseUrl, urlId);

  const created = await ShortUrlModel.create({
    origUrl,
    shortUrl,
    urlId,
    userId,
    date: new Date(),
  });

  return toDto(created);
}

export async function listUserShortUrls(
  userId: string,
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT
): Promise<{ items: ShortUrlDto[]; total: number; page: number; limit: number }> {
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const safePage = Math.max(page, 1);
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    ShortUrlModel.find({ userId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    ShortUrlModel.countDocuments({ userId }),
  ]);

  return {
    items: items.map((doc) =>
      toDto({
        ...doc,
        _id: doc._id,
        userId: doc.userId ?? null,
      })
    ),
    total,
    page: safePage,
    limit: safeLimit,
  };
}

export async function resolveShortUrl(
  urlId: string,
  req: Request
): Promise<string> {
  const url = await ShortUrlModel.findOne({ urlId });
  if (!url) {
    throw new AppError("Short URL not found", 404, "NOT_FOUND");
  }

  void recordClick(req, urlId);
  return url.origUrl;
}
