import type { Request } from "express";
import type { ClickEventDto } from "@repo/shared";
import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from "@repo/shared";
import { ClickEventModel } from "../models/clickEvent.model";
import { ShortUrlModel } from "../models/shortUrl.model";
import { extractRequestMeta } from "../utils/request-meta";
import { logger } from "../config/logger";

function toClickDto(doc: {
  _id: { toString(): string };
  urlId: string;
  clickedAt: Date;
  ip: string;
  country: string | null;
  referrer: string | null;
  userAgent: string;
  browser: string | null;
  device: string | null;
  os: string | null;
}): ClickEventDto {
  return {
    _id: doc._id.toString(),
    urlId: doc.urlId,
    clickedAt: doc.clickedAt,
    ip: doc.ip,
    country: doc.country,
    referrer: doc.referrer,
    userAgent: doc.userAgent,
    browser: doc.browser,
    device: doc.device,
    os: doc.os,
  };
}

export async function recordClick(
  req: Request,
  urlId: string
): Promise<void> {
  try {
    const url = await ShortUrlModel.findOne({ urlId });
    if (!url) return;

    const meta = extractRequestMeta(req);

    await Promise.all([
      ClickEventModel.create({
        urlId,
        shortUrlRef: url._id,
        userId: url.userId,
        clickedAt: new Date(),
        ...meta,
      }),
      ShortUrlModel.updateOne({ urlId }, { $inc: { clicks: 1 } }),
    ]);
  } catch (err) {
    logger.error("Failed to record click", { urlId, error: err });
  }
}

export async function listClickEvents(
  urlId: string,
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT
): Promise<{ items: ClickEventDto[]; total: number; page: number; limit: number }> {
  const safeLimit = Math.min(Math.max(limit, 1), MAX_LIMIT);
  const safePage = Math.max(page, 1);
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    ClickEventModel.find({ urlId })
      .sort({ clickedAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    ClickEventModel.countDocuments({ urlId }),
  ]);

  return {
    items: items.map((doc) =>
      toClickDto({
        ...doc,
        _id: doc._id,
        country: doc.country ?? null,
        referrer: doc.referrer ?? null,
        browser: doc.browser ?? null,
        device: doc.device ?? null,
        os: doc.os ?? null,
      })
    ),
    total,
    page: safePage,
    limit: safeLimit,
  };
}
