-- DB-RLS-BASE: 6개 테이블 전부 Row Level Security 활성화 + 기본 정책.
-- 원칙(docs/ARCHITECTURE.md §11): 본인 데이터 우선, 공개 동행글은 읽기만 예외,
-- 관리자(moderator/admin)는 reports/external_links에서만 추가 권한을 가진다.

-- ─── profiles ────────────────────────────────────────────────────────────
alter table profiles enable row level security;

-- 동행글 작성자 닉네임 등을 누구나 볼 수 있어야 하므로 읽기는 공개로 둔다.
create policy profiles_select_all
  on profiles for select
  using (true);

create policy profiles_insert_self
  on profiles for insert
  with check (auth.uid() = id);

create policy profiles_update_self
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ─── mate_posts ──────────────────────────────────────────────────────────
alter table mate_posts enable row level security;

-- 공개 동행글은 누구나(비로그인 포함) 읽을 수 있다.
create policy mate_posts_select_all
  on mate_posts for select
  using (true);

-- 로그인 사용자만 자기 이름으로 작성 가능.
create policy mate_posts_insert_own
  on mate_posts for insert
  with check (auth.uid() = author_id);

-- 작성자 본인만 수정(마감 포함) 가능.
create policy mate_posts_update_own
  on mate_posts for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

-- ─── mate_applications ───────────────────────────────────────────────────
alter table mate_applications enable row level security;

-- 신청자 본인, 또는 해당 글의 작성자, 또는 moderator/admin만 조회 가능.
create policy mate_applications_select_related
  on mate_applications for select
  using (
    auth.uid() = applicant_id
    or auth.uid() in (select author_id from mate_posts where id = post_id)
    or exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role in ('moderator', 'admin')
    )
  );

-- 로그인 사용자만 자기 이름으로 신청 가능.
create policy mate_applications_insert_own
  on mate_applications for insert
  with check (auth.uid() = applicant_id);

-- 신청자 본인(취소) 또는 글 작성자(승인/거절)만 상태 변경 가능.
create policy mate_applications_update_related
  on mate_applications for update
  using (
    auth.uid() = applicant_id
    or auth.uid() in (select author_id from mate_posts where id = post_id)
  )
  with check (
    auth.uid() = applicant_id
    or auth.uid() in (select author_id from mate_posts where id = post_id)
  );

-- ─── blocks ──────────────────────────────────────────────────────────────
alter table blocks enable row level security;

-- 본인이 만든 차단만 조회/생성/해제 가능.
create policy blocks_select_own
  on blocks for select
  using (auth.uid() = blocker_id);

create policy blocks_insert_own
  on blocks for insert
  with check (auth.uid() = blocker_id);

create policy blocks_delete_own
  on blocks for delete
  using (auth.uid() = blocker_id);

-- ─── reports ─────────────────────────────────────────────────────────────
alter table reports enable row level security;

-- 신고자 본인, 또는 moderator/admin만 조회 가능(피신고자에게는 노출하지 않는다).
create policy reports_select_own_or_admin
  on reports for select
  using (
    auth.uid() = reporter_id
    or exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role in ('moderator', 'admin')
    )
  );

-- 로그인 사용자만 자기 이름으로 신고 가능.
create policy reports_insert_own
  on reports for insert
  with check (auth.uid() = reporter_id);

-- 상태 변경(OPEN/RESOLVED/DISMISSED)은 moderator/admin만 가능.
create policy reports_update_admin_only
  on reports for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role in ('moderator', 'admin')
    )
  )
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role in ('moderator', 'admin')
    )
  );

-- ─── external_links ──────────────────────────────────────────────────────
alter table external_links enable row level security;

-- 항공/숙소 외부 URL 기본값은 비로그인 사용자도 읽어야 한다(SCR-003 외부 이동).
create policy external_links_select_all
  on external_links for select
  using (true);

-- admin만 값을 변경할 수 있다.
create policy external_links_update_admin_only
  on external_links for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- ─── GRANT (테이블 단위 권한) ──────────────────────────────────────────────
-- RLS 정책은 "허용된 행"만 걸러줄 뿐, 그 이전에 anon/authenticated 역할이
-- 해당 테이블에 접근할 기본 권한(GRANT)이 있어야 한다. Supabase 프로젝트
-- 대시보드 설정(Data API "Automatically expose new tables" 등)에 이 권한이
-- 암묵적으로 딸려온다고 가정하지 않고, 위 정책과 1:1로 대응하는 최소 권한만
-- 명시적으로 부여한다 — RLS 우회나 service_role 사용 없이 anon/authenticated
-- 두 역할만으로 앱이 동작하도록 하기 위함이다.
grant usage on schema public to anon, authenticated;

-- profiles: 조회는 비로그인 포함 전체 공개(동행글 카드에 작성자 닉네임 표시),
-- 생성/수정은 로그인 사용자만(본인 행, RLS가 추가로 제한).
grant select on profiles to anon;
grant select, insert, update on profiles to authenticated;

-- mate_posts: 조회는 비로그인 포함 전체 공개, 생성/수정(마감 포함)은 로그인 사용자만.
grant select on mate_posts to anon;
grant select, insert, update on mate_posts to authenticated;

-- mate_applications: 전 정책이 auth.uid() 기반이라 비로그인 접근 경로가 없다 —
-- anon에는 권한을 주지 않는다(RLS로도 항상 0행이지만, 접근 표면 자체를 넓히지 않는다).
grant select, insert, update on mate_applications to authenticated;

-- blocks: 본인 차단만 조회/생성/해제 — update 정책이 없으므로 update는 부여하지 않는다.
grant select, insert, delete on blocks to authenticated;

-- reports: 신고자 본인 또는 moderator/admin만 조회, 상태 변경은 moderator/admin만
-- (역할 판정은 RLS가 하고, GRANT는 authenticated 전체에 동작 자체만 허용한다).
grant select, insert, update on reports to authenticated;

-- external_links: 조회는 비로그인 포함 전체 공개(SCR-003 외부 이동 URL),
-- 수정은 admin만(RLS가 제한) — insert/delete 정책이 없으므로 부여하지 않는다.
grant select on external_links to anon;
grant select, update on external_links to authenticated;
