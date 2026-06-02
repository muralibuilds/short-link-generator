import { z } from "zod";

export const shortenUrlSchema = z.object({
  origUrl: z
    .string({ required_error: "Original URL is required" })
    .trim()
    .url("Must be a valid URL"),
});

export type ShortenUrlInput = z.infer<typeof shortenUrlSchema>;

export const urlIdParamSchema = z.object({
  urlId: z.string().min(1, "URL id is required"),
});

export type UrlIdParam = z.infer<typeof urlIdParamSchema>;
