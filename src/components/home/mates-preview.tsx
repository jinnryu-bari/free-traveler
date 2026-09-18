import Link from "next/link";
import { listMatePosts } from "@/lib/supabase/queries";

export const MATES_PREVIEW_SECTION_ID = "mates-preview";

const STATUS_LABEL: Record<"OPEN" | "CLOSED", string> = {
  OPEN: "모집중",
  CLOSED: "마감",
};

function formatPeriod(startDate: string, endDate: string): string {
  return `${startDate} ~ ${endDate}`;
}

/**
 * SCR-001 Section 6 — 최근 동행글 미리보기.
 * `API-MATES`(GET /api/mates와 동일한 DB-ACCESS 함수)를 Server Component에서
 * 직접 호출해 최신 3건만 보여준다. 연락처 등 자유 텍스트(description)는
 * 렌더링하지 않는다 — Security/Privacy AC("카드에 연락처 미노출")를 렌더링
 * 범위 자체를 좁혀서 지킨다.
 */
export async function MatesPreview() {
  const posts = await listMatePosts();
  const preview = posts.slice(0, 3);

  return (
    <section id={MATES_PREVIEW_SECTION_ID} className="mx-auto flex max-w-[1240px] flex-col gap-6 px-5 py-16 scroll-mt-20 lg:px-10 lg:py-20">
      <div>
        <h2 className="text-display-md text-ink">최근 동행글</h2>
        <p className="text-body-md text-body mt-1">함께 떠날 동행을 지금 찾아보세요.</p>
      </div>

      {preview.length === 0 ? (
        <div className="border-hairline flex flex-col items-start gap-3 rounded-md border p-8">
          <p className="text-body-md text-body">
            아직 등록된 동행글이 없어요. 첫 동행글을 올려 함께 떠날 사람을 찾아보세요.
          </p>
          <Link
            href="/travel-tools"
            className="text-button inline-flex h-11 items-center rounded-sm bg-brand-coral px-5 text-on-brand hover:bg-brand-coral-active"
          >
            동행글 작성하기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {preview.map((post) => (
            <div key={post.id} className="shadow-card flex flex-col gap-2 rounded-md p-5">
              <p className="text-title-md text-ink">{post.country}</p>
              <p className="text-body-sm text-body">{formatPeriod(post.start_date, post.end_date)}</p>
              <p className="text-body-sm text-muted">{STATUS_LABEL[post.status]}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
