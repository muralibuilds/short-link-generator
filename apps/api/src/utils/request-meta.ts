import type { Request } from "express";
import geoip from "geoip-lite";
import { UAParser, type IResult } from "ua-parser-js";

export interface RequestMeta {
  ip: string;
  country: string | null;
  referrer: string | null;
  userAgent: string;
  browser: string | null;
  device: string | null;
  os: string | null;
}

function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0]?.trim() ?? req.ip ?? "unknown";
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0].split(",")[0]?.trim() ?? req.ip ?? "unknown";
  }
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

function parseUserAgent(userAgent: string): Pick<
  RequestMeta,
  "browser" | "device" | "os"
> {
  const result: IResult = UAParser(userAgent);
  const browserResult = result.browser;
  const osResult = result.os;
  const deviceResult = result.device;

  const browser =
    browserResult.name && browserResult.version
      ? `${browserResult.name} ${browserResult.version}`
      : browserResult.name ?? null;

  const device = deviceResult.type
    ? deviceResult.type
    : deviceResult.vendor || deviceResult.model
      ? "mobile"
      : "desktop";

  const os =
    osResult.name && osResult.version
      ? `${osResult.name} ${osResult.version}`
      : osResult.name ?? null;

  return { browser, device, os };
}

export function extractRequestMeta(req: Request): RequestMeta {
  const ip = getClientIp(req);
  const geo = geoip.lookup(ip);
  const userAgent = req.headers["user-agent"] ?? "unknown";
  const parsed = parseUserAgent(userAgent);

  return {
    ip,
    country: geo?.country ?? null,
    referrer: req.headers.referer ?? req.headers.referrer?.toString() ?? null,
    userAgent,
    ...parsed,
  };
}
