---
version: D-001
status: LOCKED
name: Free-Traveler-design-system
description: A white-canvas, photo-first travel discovery and companion-matching service. Single coral accent (#FF6B4A) carries every primary CTA, active tab underline, selected chip state, and favorite state. 90%+ of every screen stays white background with dark-ink text; semantic colors (info/warning/danger) are kept strictly separate from the brand coral and always paired with an icon + text label. Method (photo-led cards, whitespace rhythm, single-accent discipline, component layering) is adapted from the Airbnb reference analysis at `design-reference/vendor/airbnb/DESIGN-airbnb.md`; no Airbnb trademark, wordmark, three-product nav, "NEW" badge, star-rating convention, or booking/payment UI is reused.
source_docs:
  - docs/04_UIUX_PLAN.md
  - docs/STITCH_VALIDATION_REPORT.md
  - design-reference/vendor/airbnb/DESIGN-airbnb.md
approved_screens: [SCR-001, SCR-002, SCR-003, SCR-004, SCR-005]
mobile_variants: [SCR-001, SCR-003]

colors:
  brand-coral: "#FF6B4A"
  brand-coral-active: "#E14F31"
  brand-coral-soft: "#FFE4DB"
  brand-coral-disabled: "#FFD6C7"
  text-ink: "#262626"
  text-body: "#4B4B4B"
  text-muted: "#767676"
  text-muted-soft: "#A3A3A3"
  text-on-brand: "#FFFFFF"
  surface-canvas: "#FFFFFF"
  surface-soft: "#F7F6F4"
  surface-strong: "#F1F0EC"
  border-hairline: "#E4E4E1"
  border-hairline-soft: "#EFEFEC"
  border-strong: "#C6C6C2"
  semantic-info: "#2461B8"
  semantic-info-bg: "#E7F0FC"
  semantic-warning: "#9A6400"
  semantic-warning-bg: "#FDF3DA"
  semantic-danger: "#B0201A"
  semantic-danger-bg: "#FBE7E4"
  focus-ring: "#1D4ED8"
  scrim: "rgba(0,0,0,0.5)"

typography:
  fontFamily: "'Inter', -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif"
  display-xl: { desktop: 34px, mobile: 26px, weight: 700, lineHeight: 1.3 }
  display-lg: { desktop: 28px, mobile: 22px, weight: 700, lineHeight: 1.3 }
  display-md: { desktop: 22px, mobile: 20px, weight: 700, lineHeight: 1.35 }
  title-md: { desktop: 18px, mobile: 17px, weight: 600, lineHeight: 1.4 }
  title-sm: { desktop: 16px, mobile: 16px, weight: 600, lineHeight: 1.4 }
  body-md: { desktop: 16px, mobile: 15px, weight: 400, lineHeight: 1.6 }
  body-sm: { desktop: 14px, mobile: 14px, weight: 400, lineHeight: 1.5 }
  caption: { desktop: 13px, mobile: 13px, weight: 500, lineHeight: 1.4 }
  button: { desktop: 16px, mobile: 16px, weight: 600, lineHeight: 1.2 }
  link: { desktop: 14px, mobile: 14px, weight: 500, lineHeight: 1.4 }

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  base: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section-desktop: 80px
  section-mobile: 48px

radius:
  sm: 8px
  md: 12px
  lg: 16px
  pill: 999px

shadow:
  card: "0 1px 2px rgba(0,0,0,.04), 0 4px 10px rgba(0,0,0,.06)"
  overlay: "0 8px 24px rgba(0,0,0,.16)"
  flat: "none — default for Header, Footer, body sections"

breakpoints:
  desktop: { width: 1440px, contentMaxWidth: 1240px }
  mobile: { width: 390px, sideGutter: 20px }
  tablet-reference: 744-1128px
---

## 1. Visual Theme

Free Traveler is a **white-canvas, photo-first** travel discovery and companion-matching service. Every screen is built from the same discipline the Airbnb reference analysis documents methodologically — single-accent restraint, generous photography, soft rounded geometry, flat elevation by default — but every token, word, and component below is Free Traveler's own.

- **Single accent:** `color.brand.coral` (#FF6B4A) is the only brand color. It appears on primary CTAs, the active tab underline, the selected chip/filter state, and the favorite/save state — nowhere else. 90%+ of any screen stays white (`surface.canvas`) + ink text.
- **Trust is textual, not photographic.** Unlike Airbnb, where photo density itself signals trust, Free Traveler builds trust through verifiable text: source, confirmation date, safety-alert level. Photography stays supportive, not the primary trust signal.
- **Semantic colors are never coral.** Info/warning/danger are separate tokens, always shown with an icon **and** a text label — color is never the sole carrier of meaning (WCAG + REQ-NF-023).
- **No Airbnb brand elements.** No wordmark, no three-product top nav, no "NEW" pill badges, no star-rating convention (Free Traveler uses text-based badges — e.g. safety alert level, recruitment status — never a 1–5 star widget).
- **This is not a booking marketplace.** No price display, no date-picker-to-payment flow, no reservation card, no checkout UI of any kind exists anywhere in this system.

## 2. Color Token

| Token | Value | Usage |
|---|---|---|
| `color.brand.coral` | `#FF6B4A` | Primary CTA background, active tab underline, selected chip/filter, favorite state |
| `color.brand.coral-active` | `#E14F31` | Coral button press state |
| `color.brand.coral-soft` | `#FFE4DB` | Coral badge/chip pale background (inactive emphasis) |
| `color.brand.coral-disabled` | `#FFD6C7` | Disabled CTA |
| `color.text.ink` | `#262626` | Default heading/body text (never pure black) |
| `color.text.body` | `#4B4B4B` | Descriptive copy, card meta |
| `color.text.muted` | `#767676` | Captions, secondary labels, inactive tabs |
| `color.text.muted-soft` | `#A3A3A3` | Placeholder text, disabled links |
| `color.text.on-brand` | `#FFFFFF` | Text on coral/dark surfaces |
| `color.surface.canvas` | `#FFFFFF` | Default page background (no dark mode) |
| `color.surface.soft` | `#F7F6F4` | Footer, alternating section background |
| `color.surface.strong` | `#F1F0EC` | Card inner accent, disabled input fill |
| `color.border.hairline` | `#E4E4E1` | Dividers, card borders |
| `color.border.hairline-soft` | `#EFEFEC` | Light section separators |
| `color.border.strong` | `#C6C6C2` | Pre-focus emphasis border |
| `color.semantic.info` | `#2461B8` on `#E7F0FC` | General notices (e.g. non-transmission disclaimer) |
| `color.semantic.warning` | `#9A6400` on `#FDF3DA` | Stale safety-info warning, caution badge |
| `color.semantic.danger` | `#B0201A` on `#FBE7E4` | Form errors, high travel-alert level, report/block warnings |
| `color.focus.ring` | `#1D4ED8` | Keyboard focus ring (blue — always distinct from coral) |
| `color.scrim` | `rgba(0,0,0,0.5)` | Drawer/Modal backdrop |

**Rule:** any new UI state must map to an existing token above. No ad-hoc hex values may be introduced outside this table (see §17 Do Not).

## 3. Typography

Font: `'Inter', -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif`. Inter carries Latin glyphs; Korean body copy automatically falls back to the system Korean stack (Apple SD Gothic Neo / Malgun Gothic / Noto Sans KR). No proprietary or licensed font file is bundled — Inter and the listed fallbacks are open/system fonts only.

| Token | Desktop | Mobile | Weight | Line-height | Use |
|---|---|---|---|---|---|
| `type.display-xl` | 34px | 26px | 700 | 1.3 | SCR-001 / SCR-002 Hero title |
| `type.display-lg` | 28px | 22px | 700 | 1.3 | Screen-level H1 |
| `type.display-md` | 22px | 20px | 700 | 1.35 | Section title (H2) |
| `type.title-md` | 18px | 17px | 600 | 1.4 | Card title, subsection title |
| `type.title-sm` | 16px | 16px | 600 | 1.4 | List item title, emphasized form label |
| `type.body-md` | 16px | 15px | 400 | 1.6 | Default body copy |
| `type.body-sm` | 14px | 14px | 400 | 1.5 | Card meta, supporting description |
| `type.caption` | 13px | 13px | 500 | 1.4 | Badge, chip, form helper text |
| `type.button` | 16px | 16px | 600 | 1.2 | Button label |
| `type.link` | 14px | 14px | 500 | 1.4 | Inline link |

Display weights stay bold but modest in size — never enlarged beyond `display-xl` — because photography and card density carry visual weight, matching the restrained-scale principle in the Airbnb methodology reference without adopting its type family.

## 4. Spacing

| Token | Value |
|---|---|
| `space.xxs` | 4px |
| `space.xs` | 8px |
| `space.sm` | 12px |
| `space.base` | 16px |
| `space.lg` | 24px |
| `space.xl` | 32px |
| `space.xxl` | 48px |
| `space.section-desktop` | 80px (acceptable range 64–96px) |
| `space.section-mobile` | 48px (acceptable range 40–64px) |

## 5. Radius

| Token | Value | Use |
|---|---|---|
| `radius.sm` | 8px | Buttons, form inputs |
| `radius.md` | 12px | Cards |
| `radius.lg` | 16px | Drawer/Modal panel, Hero image |
| `radius.pill` | 999px | Chips, tabs, search bar |

## 6. Shadow

| Token | Value | Use |
|---|---|---|
| `shadow.card` | `0 1px 2px rgba(0,0,0,.04), 0 4px 10px rgba(0,0,0,.06)` | Card hover, search bar, dropdown |
| `shadow.overlay` | `0 8px 24px rgba(0,0,0,.16)` | Drawer, Modal, Toast |
| flat (no shadow) | — | Default for Header, Footer, body sections (~95% of surfaces) |

Elevation is capped at one shadow tier, same discipline as the Airbnb reference — depth comes from photography and rounded-corner clipping, not layered shadows.

## 7. Header · Footer

**Header** (all 5 screens, shared component):

| | Desktop (1440px) | Mobile (390px) |
|---|---|---|
| Height | 72px, sticky top, 1px hairline bottom border | 56px, sticky top |
| Left | "Free Traveler" wordmark (text, `title-md` 700 + coral dot accent) | Wordmark only |
| Nav | 4 links: 여행지 · 여행 준비 · 동행 찾기 · 대표 소개 (`/`, `/travel-tools`, `/mates`, `/about`) | Hamburger (44×44px) → full-screen sheet with the same 4 links |
| Right | Account entry: "로그인" (secondary button) when signed out; nickname + avatar when signed in → `/account` | Same entry point inside the sheet, bottom-anchored |
| Active state | Current route: ink text + 2px coral underline | Same, inside sheet |

**Footer** (all 5 screens, shared component):

| | Desktop | Mobile |
|---|---|---|
| Background | `surface.soft`, 64px vertical padding | 40px vertical padding |
| Columns | 3 columns: "여행 정보"(여행지, 국가 안전정보) · "서비스"(여행 준비, 동행 찾기) · "회사"(대표 소개, 이용약관, 개인정보 처리방침, 동행 안전수칙) | 1 column stack, 24px column gap |
| Legal band | Copyright line + contact email link | Same, text wraps |

Never a 3-product nav with illustrated icons or "NEW" badges — Free Traveler's header stays a plain 4-link nav plus one account entry point.

## 8. Search · Filter

- **Global search bar** (SCR-001 Hero): pill-shaped (`radius.pill`), 56px height, white fill, hairline border, placeholder "여행지, 국가, 테마로 검색". No segmented Where/When/Who structure — Free Traveler search is a single free-text field, since there is no reservation flow to segment.
- **Theme chips** (SCR-001 §4): `radius.pill`, 40px+ height, default `surface.strong` background + ink text; selected state `coral-soft` background + coral text/border.
- **SCR-004 Filter row:** country · region · period · recruitment-status chips/selects in one row (desktop), collapsible panel (mobile). Result count always stated as text ("조건에 맞는 동행글 N개"), 0 results still shows a relaxed-condition hint, never a bare blank state.

## 9. Destination Card

Applies to SCR-001 domestic/international/safety-info grids and SCR-002 gallery/memorable-destination cards.

- `radius.md`, `surface.canvas` background, 1px `hairline` border, `shadow.card` on hover only.
- Image (when present): 16:10 ratio, top corners rounded to match card radius.
- Below image: title (`title-md`) + meta line (`body-sm`, muted) + optional status badge (e.g. safety alert level, recommended season).
- **No star rating, no numeric review score, no price.** Trust badges are textual: alert level + "최종 확인일" date for safety cards; recommended season for destination cards.
- Alt text describes the actual place and composition (e.g. "야경 속 부산 해운대 해수욕장과 마천루"), never generic ("이미지1").

## 10. Form · Tabs

**Form input:** `radius.sm`, 48px height, 1px `hairline` border; focus = 2px ink border + `focus.ring` outline. Label sits above the input in `caption` style — placeholder never substitutes for a label. Error state: `danger` border + `danger` text explaining the cause, paired with an icon.

**Tabs (underline style):** active tab = ink text + 2px coral underline; inactive = muted text. Used in SCR-003 (항공편/숙소/동행 구하기) and SCR-005 (프로필/내 글/참가 요청/차단 목록). Switching tabs must not discard another tab's input/validation/completion state — each tab keeps its own session-scoped state machine.

## 11. Mate Post Card

Applies to SCR-001 §6 (recent posts preview) and SCR-004 §3 (full list).

- `radius.md` card, country + period + recruitment headcount as the primary meta line, status badge (모집중/마감) top-right in `coral-soft`/`surface-strong` — never a star rating or price.
- No public contact info ever rendered on the card face (REQ-FUNC-032/080 — pattern-matched contact strings are blocked at input, not just hidden at display).
- Detail view (SCR-004 split panel / mobile Drawer): title, host, travel-style tags, participate CTA. Safety notice ("공개 연락처 금지, 신고·차단 가능") stays reachable from every mate-related surface.

## 12. Drawer · Modal

Used for destination/safety detail (SCR-001) and mate detail on mobile (SCR-004).

- Desktop: slides in from the right, 480–560px wide, `radius.lg` on the leading (left) corners only, `shadow.overlay`, `scrim` backdrop closes on click.
- Mobile: bottom sheet, expandable to 80% height, drag handle visible.
- Focus-trapped; closes via `Esc`, backdrop click, or a 44×44px close button.

## 13. Alert · Toast

- Position: bottom-right (desktop) / top (mobile), `radius.md`, `shadow.overlay`, auto-dismiss after 4s + manual close.
- Success: `ink` background + white text (or `surface.strong` + check icon) — **never coral**, to keep the brand accent scarce.
- Error: `danger` text + icon. Info: `info` text + icon.
- Inline alert banners (e.g. SCR-003 "입력값은 외부 사이트로 전달되지 않습니다") use `semantic.info` background/text, always with an icon and a full sentence, never color alone.

## 14. Loading · Empty · Error 상태

| State | Rule |
|---|---|
| Loading | Skeleton blocks matching the final card/panel shape; screen-reader text "불러오는 중입니다" |
| Empty | **Always 3 parts, in order:** ① one sentence describing the situation → ② one sentence on how to use / relax conditions → ③ a clear next-action CTA button. No icon-only or text-only empty state. |
| Error | `danger` icon + "일시적으로 정보를 불러오지 못했어요" pattern + "다시 시도" button |
| Unauthorized | Lock icon + "로그인이 필요한 기능이에요" + "로그인하기" CTA → `/account` |

Canonical empty copy (do not invent new phrasing patterns — reuse this tone):
- SCR-001 최근 동행글: "아직 등록된 동행글이 없어요. 관심 있는 여행 조건으로 첫 동행글을 남겨보세요." + "동행글 작성하기"
- SCR-004 목록 없음: "조건에 맞는 동행글이 아직 없어요. 필터를 조정하거나 새로운 조건으로 첫 동행글을 남겨보세요." + "필터 초기화" / "동행글 작성하기"
- SCR-005 내 글 없음: "아직 작성한 동행글이 없어요. 함께 떠날 동행을 지금 모집해보세요." + "새 동행글 작성하기"
- SCR-005 참가 요청 없음: "보낸 참가 요청이 없어요. 마음에 드는 동행글에 참가를 요청해보세요." + "동행글 둘러보기"
- SCR-005 관리자 신고 없음: "현재 처리할 신고가 없어요."

## 15. Desktop · Mobile 규칙

- **Desktop** reference width: 1440px. **Mobile** reference width: 390px. Tablet (744–1128px) is a documented fallback only (2-column card grid), not separately specced per screen.
- Card grids: desktop 3-column (destinations, safety info) or split 40/60 (SCR-004 list+detail); mobile always collapses to **1 column, vertical stack** — horizontal-scroll carousels are prohibited (accessibility: no swipe-only navigation).
- Touch targets ≥ 44×44px on every interactive element on both breakpoints.
- Keyboard focus-visible ring (`focus.ring`, 2px + 2px offset) on every focusable element, shown only for `:focus-visible` (not on mouse click).
- Text color contrast ≥ WCAG AA (4.5:1) for body text on both breakpoints.

## 16. Page Section 최대 폭과 Desktop·Mobile 상하 여백

- Desktop content container max-width: **1240px**, centered inside the 1440px viewport.
- Section vertical padding: Desktop **80px** (acceptable range 64–96px), Mobile **48px** (acceptable range 40–64px).
- Mobile side gutter: **20px**.

### Hero 높이와 다음 Section 노출 규칙

- Desktop Hero height caps at **~560px** (≈60–65% of a 900px first viewport) so the next section's title is visible without scrolling — verified on the approved SCR-001 screen (`screens/218b4cc3a3144ec8b86936fb7140a5ea`).
- Mobile Hero compresses to the standard 48px section padding — no fixed height override.
- No Hero may fill the entire first viewport with no visible trailing content; the next Section's H2 must be at least partially visible at first paint.

## 17. Section별 제목·설명·본문·CTA 계층과 시각적 리듬

Every Section, no exceptions, follows this stack:

1. **Title (H2, `display-md`)** — concrete, specific to the section's content (never generic like "섹션 2").
2. **Description (1–3 sentences, `body-md`, muted)** — states what the user gets or why it matters.
3. **Body** — real content (card grid / split / chip list / timeline / gallery / steps) **or** a CTA when body content is legitimately absent (see §18 Empty State rule).

**Visual rhythm rule:** consecutive sections must not repeat the same layout pattern back-to-back. The approved rotation is: **Hero / Card Grid / Split / Chip List / 3-Step Guide / CTA Banner / Timeline / Gallery**, cross-applied per screen (Tabs, Filter+List, and Form are secondary patterns reserved for SCR-003/SCR-004's functional sections). This rotation is what the Stitch-approved screens (§19) implement — do not collapse two adjacent sections into the same card-grid rhythm.

## 18. 화면별 Section 순서와 Card·Timeline·Gallery 최소 콘텐츠 수

Locked against the Stitch-approved screens (see `docs/STITCH_VALIDATION_REPORT.md`).

**SCR-001 `/` (Approved: `screens/218b4cc3a3144ec8b86936fb7140a5ea`, Mobile: `screens/72dc8eb15eb44d2fbd4c6caf273cd765`)**
1. Hero (search + primary CTA)
2. 국내 인기 여행지 — Card Grid, **6 cards minimum**
3. 해외 인기 여행지 — Card Grid, **6 cards minimum**
4. 여행 동기·테마 — Chip list, **6 chips**
5. 국가별 주의사항 — Card Grid, **6 country cards**, each with alert-level badge + last-checked date
6. 최근 동행글 — Card Grid **3 cards** when data exists, else full Empty State (§14)
7. free_traveler 소개 — Split layout + CTA to `/about`

**SCR-002 `/about` (Approved: `screens/26266b90d23d4f05ae2d4d4d2341554c`)**
1. Hero (founder photo + one-line intro)
2. 여행 지표 — 2 metric cards minimum (50+ Trips / 30+ Countries); additional metrics may be added but not fewer
3. 소개 — Split (목차 + 본문)
4. 여행 Timeline — **6 entries minimum**, year + place + one-line summary each
5. 방문 국가 — Chip list, **~30 chips minimum**, grouped by region
6. 여행 Gallery — **8 images minimum**, each with a descriptive-place alt text + caption
7. 기억에 남는 여행지 — **4 cards** + CTA Banner (two buttons: `/travel-tools`, `/mates`)

**SCR-003 `/travel-tools` (Approved: `screens/824f29d2716c4eb184ae2d3ad0b55b2f`, Mobile: `screens/990d6f5dc54b4edea1655799b7781460`)**
1. Intro Banner (purpose + 3-step usage order)
2. Tabs — **항공편 / 숙소 / 동행 구하기, all 3 always present** regardless of which is active
3. 조건 입력 Form (country/region/dates)
4. 요약 + 외부 이동 Action Card — Split layout
5. 비전달 고지 + Tip — info banner + **3 tip cards minimum**
6. 동행 탭 콘텐츠 — Form (인증 완료) or CTA Banner (미인증: 로그인·성인확인 안내)

**SCR-004 `/mates` (Approved: `screens/248a4a5680a24703b22a46784b30bce2`)**
1. Intro — CTA Banner
2. Filter + 결과 요약 (result count always stated as text)
3. 동행글 목록 — Card Grid, **up to 8 cards** desktop-priority, "더 보기" beyond that; full Empty State if zero (§14)
4. 목록 + 상세 — **Split (desktop, 40/60)**, Drawer (mobile) — both the list area and the detail panel must be present simultaneously on desktop
5. 동행 신청 방법 — **3-step guide**
6. 안전 안내 — CTA Banner (신고·차단 안내 + `/travel-tools` CTA)

**SCR-005 `/account` (Approved: `screens/ca8d8d4d60d248dba4da52207de2609a`)** — role-scoped tabs, no fixed section count; a role's tabs not applicable to the current user are not rendered.
- Guest: Intro Banner → 로그인/가입/재설정 카드 3개 → 보안 안내 CTA Banner
- Member: 프로필 Form(성인인증 배지) → 새 동행글 작성 CTA Banner → 내 글(Card Grid/Empty) → 참가 요청(Card Grid/Empty) → 차단 목록(Card Grid/Empty)
- Admin (role-gated only): 관리 Intro → 신고 상태 변경(Filter+List/Empty) → 외부 URL 설정 Form

## 19. 완성형 Empty State와 Placeholder 문구 금지 규칙

- **Prohibited strings, anywhere in shipped content:** "Lorem ipsum" (or any Latin filler), "준비 중", "정보 확인 필요", any section with a visually empty card that carries no real text.
- Every Empty State must contain the 3-part structure defined in §14 (situation sentence + how-to-use/relax-condition sentence + CTA button) — a bare icon or a single line of text is not a valid Empty State.
- If real data is not yet available for a section that is *not* legitimately data-driven (e.g. destination grids, safety-info grids, timeline, gallery), that section must still ship with real, specific, written content — those sections have no Empty State variant; they are always populated.
- Photo `alt` text must describe the actual place/composition, never a generic filename-style label.

## 20. Do / Do Not

**Do**
- Reuse `color`, `typography`, `spacing`, `radius`, `shadow` tokens from §2–§6 exactly; extend by adding a new named token to this file first, never inline.
- Keep coral scarce — one CTA/active-state moment per section, not a repeated wash.
- Pair every semantic-color state with an icon + text label.
- Write real, specific Korean copy for every title/description/CTA — city names, country names, concrete numbers.
- Collapse card grids to 1-column stacks on mobile; never horizontal-scroll carousels.
- Keep each screen's Section order matching §18 exactly (no invented extra sections that break the Hero→content rhythm without a documented reason).

**Do Not**
- Do not use any Airbnb trademark element: wordmark, three-product nav, "NEW" pill badge, star-rating widget, Rausch-labeled tokens, or the Airbnb Cereal font.
- Do not add any purchase, reservation, checkout, payment-method, or price-display UI anywhere in the system — Free Traveler links out to external sites for booking; it never processes a transaction itself.
- Do not bundle or reference a proprietary/licensed font file. Inter + system Korean fallbacks only.
- Do not introduce a color not defined in §2 — no arbitrary hex values in component work.
- Do not use coral for warning/error/danger states.
- Do not ship "준비 중" / "정보 확인 필요" / Lorem ipsum / empty cards under any circumstance.
- Do not let a Hero section consume the entire first viewport with nothing of the next section visible.
