import type { PaginatedResponse } from "./pagination";

export interface ShortUrlDto {
  _id?: string;
  userId?: string;
  urlId: string;
  origUrl: string;
  shortUrl: string;
  clicks: number;
  date: string | Date;
}

export interface ShortenUrlRequest {
  origUrl: string;
}

export type ShortUrlListResponse = PaginatedResponse<ShortUrlDto>;
