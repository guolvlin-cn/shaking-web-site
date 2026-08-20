/** 数据加载/错误兜底 UI（T6/T7：页面从 API 取数后的通用状态） */

export function LoadingState({ label = '加载中…' }: { label?: string }) {
  return (
    <div className="py-16 text-center text-text-secondary" data-testid="loading-state">
      {label}
    </div>
  );
}

export function ErrorState({
  message = '数据加载失败，请稍后重试',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="py-16 text-center" data-testid="error-state">
      <p className="text-text-secondary">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-full border border-accent-gold px-5 py-2 text-sm text-accent-gold transition-colors hover:bg-accent-gold/10"
        >
          重新加载
        </button>
      )}
    </div>
  );
}
