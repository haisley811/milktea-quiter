import { NextResponse } from "next/server";
import { estimateWithQwen, getQwenRuntimeStatus } from "../../../lib/qwenEstimateRuntime.mjs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BODY_BYTES = 16_384;

function getApiHeaders(request?: Request) {
  const allowedOrigins = (process.env.MILKTEA_ALLOWED_ORIGINS || "*")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const requestOrigin = request?.headers.get("origin") || "";
  const allowOrigin = allowedOrigins.includes("*")
    ? "*"
    : allowedOrigins.includes(requestOrigin)
      ? requestOrigin
      : (allowedOrigins[0] ?? "");

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "no-store",
    Vary: "Origin"
  };
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: getApiHeaders(request) });
}

export async function GET(request: Request) {
  return NextResponse.json(getQwenRuntimeStatus(), { headers: getApiHeaders(request) });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: "payload-too-large", message: "请求内容过大，请减少饮品名称或自定义小料长度。" },
        { status: 413, headers: getApiHeaders(request) }
      );
    }

    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: "payload-too-large", message: "请求内容过大，请减少饮品名称或自定义小料长度。" },
        { status: 413, headers: getApiHeaders(request) }
      );
    }

    body = JSON.parse(rawBody || "{}");
  } catch {
    return NextResponse.json(
      { error: "invalid-json", message: "请求内容不是有效 JSON。" },
      { status: 400, headers: getApiHeaders(request) }
    );
  }

  const result = await estimateWithQwen(body);

  if (!result.ok) {
    return NextResponse.json(
      {
        error: result.reason,
        message: result.message,
        fallback: result.fallback
      },
      { status: result.status, headers: getApiHeaders(request) }
    );
  }

  return NextResponse.json(result.estimate, { headers: getApiHeaders(request) });
}
