-- 0003_profiles_role_lockdown: profiles.role 자가 승격 차단.
--
-- 발견된 문제(docs/preview-checks/SCR-005.md 참고): 0002_rls.sql이 만든
-- `profiles_update_own`/`profiles_insert_own` 정책은 행 단위(auth.uid() = id)로만
-- 제한할 뿐 컬럼 단위 제한이 없고, GRANT도 `grant select, insert, update on profiles
-- to authenticated`로 모든 컬럼을 열어놨다. 그 결과 로그인한 일반 사용자가 UI 없이
-- REST API를 직접 호출해 자기 행의 `role` 컬럼을 'admin'/'moderator'로 바꿀 수 있었다
-- (INSERT는 `handle_new_user()` 트리거가 SECURITY DEFINER로 먼저 행을 만들어 실무상
-- 도달하기 어렵지만, 정책/권한 자체는 막고 있지 않았다).
--
-- 이미 적용된 0001/0002 마이그레이션은 고치지 않고, 이 파일만 추가로 적용한다.
--
-- 고치는 범위: authenticated 역할의 INSERT/UPDATE 권한을 테이블 전체 컬럼에서
-- `role`을 제외한 컬럼으로 좁힌다. 이 프로젝트에는 애초에 앱에서 role을 바꾸는
-- 기능이 없으므로(관리자 role 부여는 Supabase 운영자가 SQL Editor에서 직접 처리),
-- authenticated 역할 전체에서 role 쓰기를 막아도 정상 기능에는 영향이 없다.
-- select는 그대로 둔다(동행글 카드 등에서 작성자 표시에 role이 필요하진 않지만,
-- 역할 표시(`C-SCR005-ROLE-GATE`)가 role을 읽어야 하므로 read는 계속 공개로 둔다).

revoke insert, update on profiles from authenticated;

grant insert (id, nickname, age_range, travel_style, gender)
  on profiles to authenticated;

grant update (nickname, age_range, travel_style, gender, is_adult, adult_verified_at, updated_at)
  on profiles to authenticated;
