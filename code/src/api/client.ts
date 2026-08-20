import type { ApiErrorBody } from '@shared/types';

/**
 * 前端 API 客户端（T6/T7：页面数据统一走后端 API）
 * - 请求前缀统一为 /api（开发环境由 vite proxy 转发到 :3000）
 * - 非 2xx 响应解析 ApiErrorBody，抛出带中文提示的 ApiError
 */
const API_BASE = '/api';

function toQuery(params?: Record<string, string | undefined>): string {
  if (!params) return '';
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`)
    .join('&');
  return qs ? `?${qs}` : '';
}

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
      ...init,
    });
  } catch {
    // fetch 网络层失败（断网 / 服务未启动 / CORS）
    throw new ApiError(0, '网络异常，请稍后重试', 'NETWORK_ERROR');
  }

  if (!res.ok) {
    let message = `请求失败（${res.status}）`;
    let code: string | undefined;
    try {
      const body = (await res.json()) as ApiErrorBody;
      if (body.error?.message) message = body.error.message;
      code = body.error?.code;
    } catch {
      // 非 JSON 错误体，保留默认 message
    }
    throw new ApiError(res.status, message, code);
  }

  return (await res.json()) as T;
}

/** GET，返回完整响应体（如 ListResponse / SiteDisplayConfig） */
export async function apiGet<T>(path: string, params?: Record<string, string | undefined>): Promise<T> {
  return request<T>(`${path}${toQuery(params)}`);
}

/** GET 列表，直接取出 items */
export async function apiGetList<T>(path: string, params?: Record<string, string | undefined>): Promise<T[]> {
  const data = await apiGet<{ items: T[] }>(path, params);
  return data.items;
}

/** POST JSON */
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body: JSON.stringify(body) });
}
