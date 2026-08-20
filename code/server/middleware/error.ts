import type { NextFunction, Request, Response } from 'express';

/** 业务异常：携带 HTTP 状态码，由 errorHandler 统一转 JSON */
export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }

  static badRequest(message: string, code = 'BAD_REQUEST'): ApiError {
    return new ApiError(400, message, code);
  }

  static unauthorized(message = '未登录或登录已过期', code = 'UNAUTHORIZED'): ApiError {
    return new ApiError(401, message, code);
  }

  static forbidden(message = '没有权限执行该操作', code = 'FORBIDDEN'): ApiError {
    return new ApiError(403, message, code);
  }

  static notFound(message = '资源不存在', code = 'NOT_FOUND'): ApiError {
    return new ApiError(404, message, code);
  }
}

/** 404 兜底 */
export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: { message: '接口不存在', code: 'NOT_FOUND' } });
}

/** 统一错误处理（必须保持 4 参数签名） */
export function errorHandler(err: unknown, _req: Request, res: Response, next: NextFunction): void {
  void next; // Express 错误处理中间件固定 4 参签名（不调用则委托默认）
  if (err instanceof ApiError) {
    res.status(err.status).json({ error: { message: err.message, code: err.code } });
    return;
  }
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: { message: '请求体格式错误', code: 'INVALID_JSON' } });
    return;
  }
  // 兜底：不向客户端泄露内部细节
  const message = err instanceof Error ? '服务器内部错误' : '服务器内部错误';
  console.error('[unhandled-error]', err);
  res.status(500).json({ error: { message, code: 'INTERNAL_ERROR' } });
}
