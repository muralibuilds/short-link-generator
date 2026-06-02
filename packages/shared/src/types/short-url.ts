export interface ShortUrlDto {
  _id?: string;
  urlId: string;
  origUrl: string;
  shortUrl: string;
  clicks: number;
  date: string | Date;
}

export interface ShortenUrlRequest {
  origUrl: string;
}
