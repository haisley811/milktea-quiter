export function LoadingView() {
  return (
    <div className="flex min-h-[72vh] items-center justify-center" role="status" aria-live="polite">
      <div className="glass-card w-full rounded-[32px] p-5">
        <div className="mb-5 space-y-3">
          <div className="skeleton-shimmer h-3 w-28 rounded-full" />
          <div className="skeleton-shimmer h-8 w-44 rounded-full" />
          <p className="sr-only">正在整理今天的状态，数据会保存在你的本地浏览器里。</p>
        </div>

        <div className="relative overflow-hidden rounded-[30px] border border-white/80 bg-gradient-to-br from-[#DDF8F5] via-white to-[#F3E8FF] px-5 pt-8">
          <div className="skeleton-shimmer absolute left-5 top-5 h-7 w-24 rounded-full" />
          <div className="mx-auto h-56 w-48 rounded-t-[96px] bg-white/55 p-5">
            <div className="skeleton-shimmer mx-auto h-24 w-24 rounded-full" />
            <div className="skeleton-shimmer mx-auto mt-5 h-24 w-32 rounded-[36px]" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="rounded-[24px] border border-white/80 bg-white/60 p-4">
              <div className="skeleton-shimmer h-3 w-14 rounded-full" />
              <div className="skeleton-shimmer mt-3 h-7 w-20 rounded-full" />
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-sm font-extrabold text-[#8A74AA]">
          <span className="loading-spinner purple-spinner" aria-hidden="true" />
          正在读取本地记录
        </div>
      </div>
    </div>
  );
}
