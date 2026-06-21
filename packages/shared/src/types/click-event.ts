export interface ClickEventDto {
  _id?: string;
  urlId: string;
  clickedAt: string | Date;
  ip: string;
  country: string | null;
  referrer: string | null;
  userAgent: string;
  browser: string | null;
  device: string | null;
  os: string | null;
}

export interface ClickEventListResponse {
  items: ClickEventDto[];
  total: number;
  page: number;
  limit: number;
}
