type ResetConfirmModalProps = {
  onCancel: () => void;
  onConfirm: () => void;
};

export function ResetConfirmModal({ onCancel, onConfirm }: ResetConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#4C3575]/25 px-4 pb-5 backdrop-blur-sm">
      <section className="modal-enter w-full max-w-[402px] rounded-[34px] border border-white/80 bg-white/95 p-6 shadow-[0_24px_70px_rgba(76,53,117,0.22)]">
        <div className="rounded-[28px] bg-gradient-to-br from-[#FFF0F7] to-[#F3E8FF] p-5">
          <p className="text-sm font-bold text-[#8670A7]">数据重置</p>
          <h2 className="mt-1 text-2xl font-black text-[#4C3575]">确认清空所有记录吗？</h2>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-[#6D5A8C]">
            清空后会恢复到初始 Body Score 50，历史记录和统计数据都会从本地浏览器移除。
          </p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="soft-focus rounded-[22px] border border-[#E7D8FF] bg-white px-4 py-3 text-sm font-black text-[#4C3575] transition hover:-translate-y-0.5 active:scale-95"
          >
            先保留
          </button>
          <button
            type="button"
            onClick={onConfirm}
            data-haptic="warning"
            className="soft-focus rounded-[22px] bg-gradient-to-r from-[#F8BBD9] to-[#FFBF8A] px-4 py-3 text-sm font-black text-white shadow-[0_14px_28px_rgba(248,187,217,0.25)] transition hover:-translate-y-0.5 active:scale-95"
          >
            确认清空
          </button>
        </div>
      </section>
    </div>
  );
}
