import { API_ROUTES, type ShortUrlDto } from "@repo/shared";
import { apiRequest } from "@/lib/api-client";

export async function createShortUrl(origUrl: string): Promise<ShortUrlDto> {
  return apiRequest<ShortUrlDto>(API_ROUTES.SHORT, {
    method: "POST",
    body: { origUrl },
  });
}
