-- DB-SCHEMA-BASE: Free Traveler 기본 스키마.
-- 정확히 6개 테이블만 생성한다: profiles, mate_posts, mate_applications, blocks, reports, external_links.
-- (docs/PROJECT_SCOPE.md §2 / CLAUDE.md rule 13 — 7번째 테이블 생성 금지)

create extension if not exists "pgcrypto";

-- ─── profiles ────────────────────────────────────────────────────────────
-- auth.users 1:1 확장. 생년월일 원본은 저장하지 않고 성인확인 여부/시각만 저장한다.
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nickname text not null,
  age_range text not null,
  travel_style text not null,
  gender text,
  is_adult boolean not null default false,
  adult_verified_at timestamptz,
  role text not null default 'member' check (role in ('member', 'moderator', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 신규 가입 시 profiles 행을 자동 생성한다(닉네임 기본값은 이메일 앞부분).
create function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nickname, age_range, travel_style)
  values (
    new.id,
    coalesce(split_part(new.email, '@', 1), 'traveler'),
    'unknown',
    'unknown'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ─── mate_posts ──────────────────────────────────────────────────────────
create table mate_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles (id) on delete cascade,
  title text not null,
  country text not null,
  region text not null,
  start_date date not null,
  end_date date not null,
  capacity int not null check (capacity > 0),
  description text not null,
  status text not null default 'OPEN' check (status in ('OPEN', 'CLOSED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mate_posts_date_order check (end_date >= start_date)
);

create index mate_posts_author_id_idx on mate_posts (author_id);

-- ─── mate_applications ───────────────────────────────────────────────────
create table mate_applications (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references mate_posts (id) on delete cascade,
  applicant_id uuid not null references profiles (id) on delete cascade,
  message text not null,
  status text not null default 'PENDING' check (status in ('PENDING', 'ACCEPTED', 'REJECTED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index mate_applications_post_id_idx on mate_applications (post_id);
create index mate_applications_applicant_id_idx on mate_applications (applicant_id);

-- 동일 사용자·동일 글에 대해 PENDING/ACCEPTED 상태 중복 신청을 막는다.
create unique index mate_applications_unique_active
  on mate_applications (post_id, applicant_id)
  where status in ('PENDING', 'ACCEPTED');

-- ─── blocks ──────────────────────────────────────────────────────────────
create table blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references profiles (id) on delete cascade,
  blocked_id uuid not null references profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint blocks_no_self check (blocker_id <> blocked_id),
  constraint blocks_unique unique (blocker_id, blocked_id)
);

-- ─── reports ─────────────────────────────────────────────────────────────
create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references profiles (id) on delete cascade,
  target_post_id uuid references mate_posts (id) on delete set null,
  target_user_id uuid references profiles (id) on delete set null,
  reason_code text not null,
  description text not null,
  status text not null default 'OPEN' check (status in ('OPEN', 'RESOLVED', 'DISMISSED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reports_has_target check (target_post_id is not null or target_user_id is not null)
);

create index reports_reporter_id_idx on reports (reporter_id);

-- ─── external_links ──────────────────────────────────────────────────────
-- 항공/숙소 검색 외부 URL의 관리자 설정값 (DB-SEED-BASE가 기본값을 채운다).
create table external_links (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key in ('flight_search_base_url', 'hotel_search_base_url')),
  url text not null,
  updated_by uuid references profiles (id) on delete set null,
  updated_at timestamptz not null default now()
);
