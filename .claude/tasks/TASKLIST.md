# Free Traveler — Task List

**Schema:** `traveler-screen-route-v1` &nbsp;|&nbsp; **Generated from:** `design-reference/SCREEN_ROUTE_CONTRACT.json`, `design-reference/UI_CONTRACT.md`, `design-reference/D-001/DESIGN.md`, `docs/UIUX_TRACEABILITY.md`, `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`

**Total tasks: 65** (informational — see skill's 'Task count expectation', not a pass/fail gate)

| Type | Count |
|---|---:|
| PAGE_OWNER | 5 |
| COMPONENT | 37 |
| DATA | 4 |
| INFRA | 14 |
| TEST | 5 |

---

## SCR-001 `/` 메인

| ID | Type | Title | Route | Depends on | Requirements |
|---|---|---|---|---|---|
| `PO-SCR-001` | PAGE_OWNER | SCR-001 `/` Page Owner — assemble Home (remove create-next-app starter markup) | `/` | C-GLOBAL-HEADER, C-GLOBAL-FOOTER, C-GLOBAL-DEST-CARD, C-GLOBAL-EMPTY-STATE, C-GLOBAL-CTA-BANNER, C-GLOBAL-TOAST, C-SCR-001-SEARCH-FILTER, C-SCR-001-SAFETY-PANEL, C-SCR-001-THEME-CHIP, C-SCR-001-MATE-PREVIEW, C-SCR-001-DEST-DRAWER, C-SCR-001-FAVORITE-SHARE, D-DESTINATIONS, D-SAFETY | REQ-FUNC-070, REQ-NF-030 |
| `C-SCR-001-DEST-DRAWER` | COMPONENT | SCR-001 destination detail Drawer/Modal — intro/itinerary/budget/transport/food/etiquette/source + safety panel link | `/` | D-DESTINATIONS, C-SCR-001-SAFETY-PANEL | REQ-FUNC-004, REQ-FUNC-006, REQ-FUNC-079 |
| `C-SCR-001-FAVORITE-SHARE` | COMPONENT | Favorite toggle (localStorage) + URL share button (Web Share API + copy fallback) | `/` | — | REQ-FUNC-068, REQ-FUNC-069 |
| `C-SCR-001-MATE-PREVIEW` | COMPONENT | SCR-001 recent mate-post preview (max 3 cards) or full Empty State | `/` | I-API-MATES, C-GLOBAL-EMPTY-STATE | — |
| `C-SCR-001-SAFETY-PANEL` | COMPONENT | SCR-001 country safety info card grid + detail panel (alert badge, source, last-checked, stale, MOFA link, emergency contacts) | `/` | D-SAFETY | REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-049, REQ-FUNC-050, REQ-FUNC-051, REQ-FUNC-053, REQ-FUNC-054, REQ-NF-028 |
| `C-SCR-001-SEARCH-FILTER` | COMPONENT | SCR-001 search input + domestic/overseas + filter bar (country/city/season/theme/period) + URL query sync | `/` | D-DESTINATIONS, C-GLOBAL-EMPTY-STATE | REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-005, REQ-FUNC-010 |
| `C-SCR-001-THEME-CHIP` | COMPONENT | SCR-001 travel theme chip list (6 chips) scrolling to filtered results | `/` | — | — |
| `T-SMOKE-SCR-001` | TEST | Chromium smoke — destination search/filter/detail, safety panel, favorite/share (REQ-FUNC-001~010, 046~054, 068~069) | `/` | PO-SCR-001, I-PLAYWRIGHT-SETUP | REQ-NF-031 |

## SCR-002 `/about` 대표 소개

| ID | Type | Title | Route | Depends on | Requirements |
|---|---|---|---|---|---|
| `PO-SCR-002` | PAGE_OWNER | SCR-002 `/about` Page Owner — assemble founder About page | `/about` | C-GLOBAL-HEADER, C-GLOBAL-FOOTER, C-GLOBAL-DEST-CARD, C-GLOBAL-CTA-BANNER, C-SCR-002-METRIC-CARD, C-SCR-002-TIMELINE, C-SCR-002-COUNTRY-CHIP, C-SCR-002-GALLERY, C-SCR-002-CONTACT-LINKS, D-ABOUT | REQ-FUNC-070, REQ-NF-030 |
| `C-SCR-002-CONTACT-LINKS` | COMPONENT | SCR-002 inquiry/SNS links (empty values not rendered) | `/about` | D-ABOUT | REQ-FUNC-062 |
| `C-SCR-002-COUNTRY-CHIP` | COMPONENT | SCR-002 visited-country chip list (>=30 chips, grouped by region) | `/about` | D-ABOUT | REQ-FUNC-059 |
| `C-SCR-002-GALLERY` | COMPONENT | SCR-002 travel gallery grid (>=8 images, captioned, descriptive alt text) | `/about` | D-ABOUT | REQ-FUNC-061 |
| `C-SCR-002-METRIC-CARD` | COMPONENT | SCR-002 travel metric cards (50+ Trips / 30+ Countries, single source) | `/about` | D-ABOUT | REQ-FUNC-057 |
| `C-SCR-002-TIMELINE` | COMPONENT | SCR-002 travel timeline (>=6 entries: year + place + summary) | `/about` | D-ABOUT | REQ-FUNC-060 |
| `T-SMOKE-SCR-002` | TEST | Chromium smoke — about page metric/timeline/gallery/country-chip render and recommended-destination links | `/about` | PO-SCR-002, I-PLAYWRIGHT-SETUP | REQ-NF-031 |

## SCR-003 `/travel-tools` 통합 여행 준비

| ID | Type | Title | Route | Depends on | Requirements |
|---|---|---|---|---|---|
| `PO-SCR-003` | PAGE_OWNER | SCR-003 `/travel-tools` Page Owner — assemble all 3 tabs (항공편/숙소/동행 구하기) in one page | `/travel-tools` | C-GLOBAL-HEADER, C-GLOBAL-FOOTER, C-GLOBAL-TOAST, C-GLOBAL-AUTH-GATE, C-GLOBAL-CTA-BANNER, C-SCR-003-TABS-SHELL, C-SCR-003-FLIGHT-FORM, C-SCR-003-FLIGHT-SUMMARY-ACTION, C-SCR-003-HOTEL-FORM, C-SCR-003-HOTEL-SUMMARY-ACTION, C-SCR-003-DISCLOSURE-TIPS, C-SCR-003-MATE-COMPOSE-FORM | REQ-FUNC-070, REQ-NF-030 |
| `C-SCR-003-DISCLOSURE-TIPS` | COMPONENT | SCR-003 non-transmission disclosure info banner + >=3 tip cards | `/travel-tools` | — | — |
| `C-SCR-003-FLIGHT-FORM` | COMPONENT | SCR-003 flight condition input form (country/region cascading select, date validation) | `/travel-tools` | — | REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-017, REQ-NF-017 |
| `C-SCR-003-FLIGHT-SUMMARY-ACTION` | COMPONENT | SCR-003 flight summary + external link-out Action Card (non-transmission disclosure, noopener/noreferrer, no query params) | `/travel-tools` | C-SCR-003-FLIGHT-FORM, I-API-ADMIN-EXTERNAL-LINKS | REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016, REQ-FUNC-018 |
| `C-SCR-003-HOTEL-FORM` | COMPONENT | SCR-003 hotel condition input form (country/region cascading select, check-in/out validation) | `/travel-tools` | — | REQ-FUNC-019, REQ-FUNC-020, REQ-FUNC-021, REQ-FUNC-025, REQ-NF-017 |
| `C-SCR-003-HOTEL-SUMMARY-ACTION` | COMPONENT | SCR-003 hotel summary + external link-out Action Card | `/travel-tools` | C-SCR-003-HOTEL-FORM, I-API-ADMIN-EXTERNAL-LINKS | REQ-FUNC-022, REQ-FUNC-023, REQ-FUNC-024, REQ-FUNC-026 |
| `C-SCR-003-MATE-COMPOSE-FORM` | COMPONENT | SCR-003 mate-post composition form (title/country/period/headcount/style/description, contact-pattern block, safety-rule consent) | `/travel-tools` | C-GLOBAL-AUTH-GATE, I-API-MATES, D-LEGAL | REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-080 |
| `C-SCR-003-TABS-SHELL` | COMPONENT | SCR-003 underline Tabs shell — 항공편/숙소/동행 구하기, each with an independent session-scoped state machine | `/travel-tools` | — | — |
| `T-SMOKE-SCR-003` | TEST | Chromium smoke — flight/hotel input->summary->external link-out (no query params), mate compose + contact block (REQ-FUNC-011~026, 031~032, 080) | `/travel-tools` | PO-SCR-003, I-PLAYWRIGHT-SETUP | REQ-NF-031 |

## SCR-004 `/mates` 동행 조회

| ID | Type | Title | Route | Depends on | Requirements |
|---|---|---|---|---|---|
| `PO-SCR-004` | PAGE_OWNER | SCR-004 `/mates` Page Owner — assemble mate listing + detail Split/Drawer | `/mates` | C-GLOBAL-HEADER, C-GLOBAL-FOOTER, C-GLOBAL-TOAST, C-GLOBAL-AUTH-GATE, C-GLOBAL-CTA-BANNER, C-GLOBAL-EMPTY-STATE, C-SCR-004-FILTER-BAR, C-SCR-004-MATE-CARD, C-SCR-004-MATE-DETAIL-PANEL, C-SCR-004-REPORT-BLOCK, C-SCR-004-GUIDE-STEPS | REQ-FUNC-070, REQ-NF-030 |
| `C-SCR-004-FILTER-BAR` | COMPONENT | SCR-004 filter row (country/region/period/age/gender/style/status) + blocked-user exclusion | `/mates` | I-API-MATES | REQ-FUNC-030 |
| `C-SCR-004-GUIDE-STEPS` | COMPONENT | SCR-004 3-step 'how to request a mate' guide cards | `/mates` | — | — |
| `C-SCR-004-MATE-CARD` | COMPONENT | SCR-004 mate post card (country/period/headcount/status badge, no contact info rendered, CLOSED computed at read time) | `/mates` | I-API-MATES | REQ-FUNC-033, REQ-FUNC-037 |
| `C-SCR-004-MATE-DETAIL-PANEL` | COMPONENT | SCR-004 list+detail Split (desktop 40/60) / Drawer (mobile) — participation form, host approve/reject, close/edit/delete, share | `/mates` | I-API-MATE-REQUESTS, C-GLOBAL-AUTH-GATE | REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-038, REQ-FUNC-069 |
| `C-SCR-004-REPORT-BLOCK` | COMPONENT | SCR-004 report modal + block action | `/mates` | I-API-MATE-REPORT, I-API-BLOCKLIST | REQ-FUNC-039, REQ-FUNC-040, REQ-NF-019 |
| `T-SMOKE-SCR-004` | TEST | Chromium smoke — mate filter/list/detail, participation request/approve/reject, report/block (REQ-FUNC-030~040) | `/mates` | PO-SCR-004, I-PLAYWRIGHT-SETUP | REQ-NF-031 |

## SCR-005 `/account` 계정·관리

| ID | Type | Title | Route | Depends on | Requirements |
|---|---|---|---|---|---|
| `PO-SCR-005` | PAGE_OWNER | SCR-005 `/account` Page Owner — assemble Guest/Member/Admin role-scoped tabs | `/account` | C-GLOBAL-HEADER, C-GLOBAL-FOOTER, C-GLOBAL-CTA-BANNER, C-GLOBAL-EMPTY-STATE, C-SCR-005-AUTH-FORMS, C-SCR-005-PROFILE-FORM, C-SCR-005-MY-ACTIVITY, C-SCR-005-ADMIN-REPORTS, C-SCR-005-ADMIN-EXTERNAL-LINKS, C-SCR-005-LEGAL-VIEWER, D-LEGAL | REQ-FUNC-070, REQ-NF-030 |
| `C-SCR-005-ADMIN-EXTERNAL-LINKS` | COMPONENT | SCR-005 Admin — flight/hotel external URL form (HTTPS + allow-list validation) | `/account` | I-API-ADMIN-EXTERNAL-LINKS | REQ-FUNC-077 |
| `C-SCR-005-ADMIN-REPORTS` | COMPONENT | SCR-005 Admin — report status filter + list + change (OPEN/RESOLVED/DISMISSED) | `/account` | I-API-ADMIN-REPORTS | REQ-FUNC-041 |
| `C-SCR-005-AUTH-FORMS` | COMPONENT | SCR-005 Guest state — login/signup/password-reset cards (submits via /auth/callback) | `/account` | I-AUTH-WIRING | REQ-FUNC-066 |
| `C-SCR-005-LEGAL-VIEWER` | COMPONENT | SCR-005 terms / privacy / mate safety rules / content disclaimer viewer | `/account` | D-LEGAL | REQ-FUNC-080 |
| `C-SCR-005-MY-ACTIVITY` | COMPONENT | SCR-005 Member activity lists — my posts / my requests / blocklist (Card Grid or Empty State each) | `/account` | I-API-MATES, I-API-MATE-REQUESTS, I-API-BLOCKLIST, C-GLOBAL-EMPTY-STATE | REQ-FUNC-040 |
| `C-SCR-005-PROFILE-FORM` | COMPONENT | SCR-005 Member profile form (nickname/age-range/style required, gender optional) + adult-verification badge | `/account` | I-SUPABASE-SCHEMA | REQ-FUNC-028, REQ-FUNC-029 |
| `T-SMOKE-SCR-005` | TEST | Chromium smoke — auth, profile/adult-verification, my-activity, admin report status + external URL config (REQ-FUNC-066, 028~029, 041, 077) | `/account` | PO-SCR-005, I-PLAYWRIGHT-SETUP | REQ-NF-031 |

## GLOBAL — 공용 컴포넌트

| ID | Type | Title | Route | Depends on | Requirements |
|---|---|---|---|---|---|
| `C-GLOBAL-AUTH-GATE` | COMPONENT | Auth/adult-verification gate — redirects unauthenticated users to /account | `N/A` | I-AUTH-WIRING | REQ-FUNC-027 |
| `C-GLOBAL-CTA-BANNER` | COMPONENT | CTA Banner primitive — reused on SCR-002/003/004/005 | `N/A` | — | — |
| `C-GLOBAL-DEST-CARD` | COMPONENT | Destination Card — reused on SCR-001 grids and SCR-002 recommended destinations | `N/A` | D-DESTINATIONS | REQ-FUNC-009, REQ-FUNC-063 |
| `C-GLOBAL-EMPTY-STATE` | COMPONENT | Empty State primitive — situation + how-to + CTA (D-001 §14/§19) | `N/A` | — | — |
| `C-GLOBAL-ERROR-BOUNDARIES` | COMPONENT | 404 not-found and 500 error boundary screens | `N/A` | — | REQ-FUNC-078 |
| `C-GLOBAL-FOOTER` | COMPONENT | Global Footer — 3-column link groups + legal band | `N/A` | — | REQ-FUNC-064 |
| `C-GLOBAL-HEADER` | COMPONENT | Global Header — 4-link nav + account entry point | `N/A` | — | REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-079 |
| `C-GLOBAL-TOAST` | COMPONENT | Toast notification primitive (REQ-FUNC-043 alert replacement) | `N/A` | — | REQ-FUNC-043, REQ-FUNC-079 |

## Foundation / Infra / Data (화면 비종속)

| ID | Type | Title | Route | Depends on | Requirements |
|---|---|---|---|---|---|
| `D-ABOUT` | DATA | Static founder/about content dataset (profile, philosophy, timeline, visited countries, gallery, recommended destinations) | `N/A` | — | REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-061, REQ-FUNC-062, REQ-FUNC-063, REQ-NF-029 |
| `D-DESTINATIONS` | DATA | Static destination content dataset (domestic >=10, overseas >=15 countries/30 cities) | `N/A` | — | REQ-FUNC-007, REQ-FUNC-008, REQ-NF-026, REQ-NF-029 |
| `D-LEGAL` | DATA | Static legal copy dataset — terms, privacy policy, mate safety rules, content disclaimer (versioned) | `N/A` | — | REQ-FUNC-080 |
| `D-SAFETY` | DATA | Static country safety dataset (8 required categories per country, scope_type/scope_text) | `N/A` | — | REQ-FUNC-046, REQ-FUNC-052, REQ-NF-027, REQ-NF-029 |
| `I-A11Y-PASS` | INFRA | Manual accessibility pass — keyboard navigation + screen reader check on core flows across all 5 screens | `N/A` | PO-SCR-001, PO-SCR-002, PO-SCR-003, PO-SCR-004, PO-SCR-005 | REQ-NF-023, REQ-NF-025 |
| `I-API-ADMIN-EXTERNAL-LINKS` | INFRA | API Route — PATCH /api/admin/external-links (HTTPS + allow-list validated flight/hotel URL config) | `/api/admin/external-links` | I-SUPABASE-SCHEMA, I-SUPABASE-RLS | REQ-FUNC-077 |
| `I-API-ADMIN-REPORTS` | INFRA | API Route — PATCH /api/admin/reports (moderator report status change) | `/api/admin/reports` | I-SUPABASE-SCHEMA, I-SUPABASE-RLS | REQ-FUNC-041 |
| `I-API-BLOCKLIST` | INFRA | API Route — POST/DELETE /api/account/blocklist (block/unblock a user) | `/api/account/blocklist` | I-SUPABASE-SCHEMA, I-SUPABASE-RLS | REQ-FUNC-040 |
| `I-API-MATE-REPORT` | INFRA | API Route — POST /api/mates/[id]/report (submit a report) | `/api/mates/[id]/report` | I-SUPABASE-SCHEMA, I-SUPABASE-RLS | REQ-FUNC-039, REQ-NF-019 |
| `I-API-MATE-REQUESTS` | INFRA | API Route — POST/PATCH /api/mates/[id]/requests (create/approve/reject participation requests) | `/api/mates/[id]/requests` | I-SUPABASE-SCHEMA, I-SUPABASE-RLS | REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-036 |
| `I-API-MATES` | INFRA | API Route — GET/POST /api/mates (list + create mate posts) | `/api/mates` | I-SUPABASE-SCHEMA, I-SUPABASE-RLS | REQ-FUNC-030, REQ-FUNC-031 |
| `I-AUTH-WIRING` | INFRA | Supabase Auth wiring — email signup/login/logout/reset + auth callback route + session middleware | `/auth/callback` | I-SUPABASE-SCHEMA | REQ-FUNC-066, REQ-NF-014 |
| `I-DEPLOY-VERCEL` | INFRA | Vercel deployment config — env vars for secrets, TLS default, cost-tier reference | `N/A` | PO-SCR-001, PO-SCR-002, PO-SCR-003, PO-SCR-004, PO-SCR-005, I-SUPABASE-SCHEMA | REQ-NF-012, REQ-NF-016, REQ-NF-034 |
| `I-INPUT-VALIDATION` | INFRA | Shared input validation/escaping baseline (zod schemas) for all forms and API routes | `N/A` | — | REQ-NF-015 |
| `I-PERFORMANCE-BASELINE` | INFRA | Performance baseline — next/image usage, static generation, layout-shift prevention | `N/A` | — | REQ-NF-001, REQ-NF-002, REQ-NF-003, REQ-NF-006 |
| `I-PLAYWRIGHT-SETUP` | INFRA | Install and configure Playwright — Chromium project only, no Firefox/WebKit/visual/load-test projects | `N/A` | — | REQ-NF-031 |
| `I-SUPABASE-RLS` | INFRA | Supabase Row Level Security policies for all 6 tables | `N/A` | I-SUPABASE-SCHEMA | REQ-FUNC-044, REQ-NF-013 |
| `I-SUPABASE-SCHEMA` | INFRA | Supabase schema — the 6 canonical tables (profiles, mate_posts, mate_applications, blocks, reports, external_links) | `N/A` | — | REQ-FUNC-035, REQ-FUNC-077 |

---

## Requirement Coverage Summary

- REQ-FUNC-001~080 + REQ-NF-001~034 = **114** total (per `docs/UIUX_TRACEABILITY.md`)
- **IMPLEMENT: 89** — every one mapped to at least one task above
- **EXCLUDED: 25** — no task generated, listed below with `task_id: null`

| Requirement | Status | task_id |
|---|---|---|
| REQ-FUNC-042 | EXCLUDED | null |
| REQ-FUNC-045 | EXCLUDED | null |
| REQ-FUNC-055 | EXCLUDED | null |
| REQ-FUNC-056 | EXCLUDED | null |
| REQ-FUNC-067 | EXCLUDED | null |
| REQ-FUNC-071 | EXCLUDED | null |
| REQ-FUNC-072 | EXCLUDED | null |
| REQ-FUNC-073 | EXCLUDED | null |
| REQ-FUNC-074 | EXCLUDED | null |
| REQ-FUNC-075 | EXCLUDED | null |
| REQ-FUNC-076 | EXCLUDED | null |
| REQ-NF-004 | EXCLUDED | null |
| REQ-NF-005 | EXCLUDED | null |
| REQ-NF-007 | EXCLUDED | null |
| REQ-NF-008 | EXCLUDED | null |
| REQ-NF-009 | EXCLUDED | null |
| REQ-NF-010 | EXCLUDED | null |
| REQ-NF-011 | EXCLUDED | null |
| REQ-NF-018 | EXCLUDED | null |
| REQ-NF-020 | EXCLUDED | null |
| REQ-NF-021 | EXCLUDED | null |
| REQ-NF-022 | EXCLUDED | null |
| REQ-NF-024 | EXCLUDED | null |
| REQ-NF-032 | EXCLUDED | null |
| REQ-NF-033 | EXCLUDED | null |

_(The 89 IMPLEMENT requirement ids are covered inline in each task's Requirements column above — see also each task's `requirements` array in `tasklist.json`.)_

---

## Next step

Run `/gen-task-details` to write one detail Markdown file per task under `.claude/tasks/details/`, then `/audit-tasks` to verify.
