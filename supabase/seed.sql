-- DB-SEED-BASE: 개발·테스트용 최소 Seed 데이터.
-- 실제 개인정보를 포함하지 않는 가상 데이터만 사용한다.
-- 3역할(Adult Member/Moderator/Admin) 계정은 로컬 Supabase(supabase start) 대상으로만
-- 사용하고, 운영 프로젝트에는 절대 적용하지 않는다.

-- ─── 3역할 테스트 계정 (auth.users) ──────────────────────────────────────
-- profiles 행은 0001_schema.sql의 on_auth_user_created 트리거가 자동 생성한다.
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data
) values
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'authenticated', 'authenticated',
    'seed-member@example.com', crypt('SeedPassword123!', gen_salt('bf')),
    now(), now(), now(), '{}', '{}'
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-2222-2222-222222222222',
    'authenticated', 'authenticated',
    'seed-moderator@example.com', crypt('SeedPassword123!', gen_salt('bf')),
    now(), now(), now(), '{}', '{}'
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-3333-3333-333333333333',
    'authenticated', 'authenticated',
    'seed-admin@example.com', crypt('SeedPassword123!', gen_salt('bf')),
    now(), now(), now(), '{}', '{}'
  );

-- 트리거가 만든 기본 profiles 행을 테스트에 필요한 값으로 갱신한다.
update profiles set
  nickname = 'Seed Member', age_range = '20s', travel_style = 'balanced',
  is_adult = true, adult_verified_at = now(), role = 'member'
where id = '11111111-1111-1111-1111-111111111111';

update profiles set
  nickname = 'Seed Moderator', age_range = '30s', travel_style = 'planner',
  is_adult = true, adult_verified_at = now(), role = 'moderator'
where id = '22222222-2222-2222-2222-222222222222';

update profiles set
  nickname = 'Seed Admin', age_range = '30s', travel_style = 'planner',
  is_adult = true, adult_verified_at = now(), role = 'admin'
where id = '33333333-3333-3333-3333-333333333333';

-- ─── 동행글·신청 샘플 ────────────────────────────────────────────────────
insert into mate_posts (
  id, author_id, title, country, region, start_date, end_date, capacity, description, status
) values (
  'aaaaaaaa-0000-0000-0000-000000000001',
  '11111111-1111-1111-1111-111111111111',
  '오사카 3박 4일 같이 다니실 분',
  '일본', '오사카', current_date + interval '30 day', current_date + interval '33 day',
  3, '오사카 성·도톤보리 위주로 여유롭게 다니실 동행을 찾습니다.', 'OPEN'
);

insert into mate_applications (
  id, post_id, applicant_id, message, status
) values (
  'bbbbbbbb-0000-0000-0000-000000000001',
  'aaaaaaaa-0000-0000-0000-000000000001',
  '22222222-2222-2222-2222-222222222222',
  '저도 같은 기간에 오사카 여행 계획 중입니다. 함께해요!',
  'PENDING'
);

-- ─── 신고 샘플 ───────────────────────────────────────────────────────────
insert into reports (
  id, reporter_id, target_post_id, reason_code, description, status
) values (
  'cccccccc-0000-0000-0000-000000000001',
  '22222222-2222-2222-2222-222222222222',
  'aaaaaaaa-0000-0000-0000-000000000001',
  'inappropriate_content',
  '테스트용 신고 샘플 데이터입니다.',
  'OPEN'
);

-- ─── 항공·숙소 외부 URL 기본값 ───────────────────────────────────────────
-- 06번 가이드(실제 Supabase 연결)에서 운영용 실제 URL로 교체한다.
insert into external_links (key, url) values
  ('flight_search_base_url', 'https://www.google.com/travel/flights'),
  ('hotel_search_base_url', 'https://www.google.com/travel/hotels');
