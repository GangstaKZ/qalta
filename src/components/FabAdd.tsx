"use client";

export function FabAdd({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Добавить расход"
      className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom)+12px)] left-1/2 z-40 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-white shadow-[0_6px_20px_rgba(47,191,113,0.4)] transition-transform active:scale-95"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  );
}
