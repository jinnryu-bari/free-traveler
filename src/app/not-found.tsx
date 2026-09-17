import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[1240px] flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="text-display-lg text-ink">페이지를 찾을 수 없어요</p>
      <p className="text-body-md text-body">
        요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있어요.
      </p>
      <Link
        href="/"
        className="text-button rounded-sm bg-brand-coral px-6 py-3 text-on-brand hover:bg-brand-coral-active"
      >
        홈으로 돌아가기
      </Link>
    </main>
  );
}
