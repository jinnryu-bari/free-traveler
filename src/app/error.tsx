"use client";

export default function Error({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[1240px] flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="text-display-lg text-danger">
        일시적으로 정보를 불러오지 못했어요
      </p>
      <p className="text-body-md text-body">
        현재 외부 사이트에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="text-button rounded-sm bg-brand-coral px-6 py-3 text-on-brand hover:bg-brand-coral-active"
      >
        다시 시도
      </button>
    </main>
  );
}
