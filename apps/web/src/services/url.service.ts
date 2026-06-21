import {
  API_ROUTES,
  type ClickEventListResponse,
  type ShortUrlListResponse,
  type ShortUrlDto,
} from "@repo/shared";
import { apiRequest } from "@/lib/api-client";

export async function createShortUrl(origUrl: string): Promise<ShortUrlDto> {
  return apiRequest<ShortUrlDto>(API_ROUTES.SHORT, {
    method: "POST",
    body: { origUrl },
  });
}

export async function listShortUrls(
  page = 1,
  limit = 20
): Promise<ShortUrlListResponse> {
  return apiRequest<ShortUrlListResponse>(
    `${API_ROUTES.SHORT}?page=${page}&limit=${limit}`
  );
}

export async function listClickEvents(
  urlId: string,
  page = 1,
  limit = 20
): Promise<ClickEventListResponse> {
  return apiRequest<ClickEventListResponse>(
    `${API_ROUTES.SHORT_CLICKS(urlId)}?page=${page}&limit=${limit}`
  );
}
