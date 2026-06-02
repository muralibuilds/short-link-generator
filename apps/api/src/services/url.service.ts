import { nanoid } from "nanoid";
import {
  SHORT_URL_ID_LENGTH,
  buildShortUrl,
  type ShortUrlDto,
} from "@repo/shared";
import { env } from "../config/env";
import { AppError } from "../middleware/errorHandler";
import { ShortUrlModel } from "../models/shortUrl.model";

function toDto(doc: {
  _id: { toString(): string };
  urlId: string;
  origUrl: string;
  shortUrl: string;
  clicks: number;
  date: Date;
}): ShortUrlDto {
  return {
    _id: doc._id.toString(),
    urlId: doc.urlId,
    origUrl: doc.origUrl,
    shortUrl: doc.shortUrl,
    clicks: doc.clicks,
    date: doc.date,
  };
}

export async function shortenUrl(origUrl: string): Promise<ShortUrlDto> {
  const existing = await ShortUrlModel.findOne({ origUrl });
  if (existing) {
    return toDto(existing);
  }

  const urlId = nanoid(SHORT_URL_ID_LENGTH);
  const shortUrl = buildShortUrl(env.baseUrl, urlId);

  const created = await ShortUrlModel.create({
    origUrl,
    shortUrl,
    urlId,
    date: new Date(),
  });

  return toDto(created);
}

export async function resolveShortUrl(urlId: string): Promise<string> {
  const url = await ShortUrlModel.findOne({ urlId });
  if (!url) {
    throw new AppError("Short URL not found", 404, "NOT_FOUND");
  }

  await ShortUrlModel.updateOne({ urlId }, { $inc: { clicks: 1 } });
  return url.origUrl;
}
