import type { DrinkEstimate } from "./types.ts";

export type QwenConfig = {
  enabled: boolean;
  baseUrl: string;
  model: string;
  apiKey: string;
  timeoutMs: number;
  missing: string[];
};

export type QwenRuntimeStatus = {
  enabled: boolean;
  ready: boolean;
  baseUrl: string;
  model: string;
  missing: string[];
};

export type QwenEstimateResult =
  | { ok: true; estimate: DrinkEstimate }
  | {
      ok: false;
      status: number;
      reason: "disabled" | "missing-config" | "provider-error" | "request-failed";
      message: string;
      fallback: DrinkEstimate | Pick<DrinkEstimate, "price" | "calories" | "sugarGram">;
      providerBody?: string;
    };

export function resolveQwenConfig(env?: NodeJS.ProcessEnv): QwenConfig;
export function getQwenRuntimeStatus(env?: NodeJS.ProcessEnv): QwenRuntimeStatus;
export function estimateWithQwen(request: unknown, options?: { env?: NodeJS.ProcessEnv; fetch?: typeof fetch }): Promise<QwenEstimateResult>;
