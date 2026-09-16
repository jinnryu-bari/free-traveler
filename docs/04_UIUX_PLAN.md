# Free Traveler — UI/UX Plan

**Document ID:** UIUX-TRAVEL-001
**기반 문서:** `01_PRD.md`, `02_SRS_BASELINE.md`, `PROJECT_SCOPE.md`, `03_UI_COVERAGE_ANALYSIS.md`, `design-reference/vendor/airbnb/DESIGN-airbnb.md`

이 문서는 Airbnb 참고본의 구조(사진 중심 카드, 여백 리듬, 단일 강조색 원칙, 컴포넌트 계층 구성 방식)만 방법론으로 참고하고, Free Traveler 고유의 색·타이포·컴포넌트로 재정의한다. Airbnb의 로고, 상표, 아이콘, "Rausch"/"Cereal" 등 브랜드 자산은 사용하지 않는다. Screen은 `03_UI_COVERAGE_ANALYSIS.md`가 고정한 SCR-001~SCR-005 5개만 사용하며, `PROJECT_SCOPE.md`에서 EXCLUDED로 분류된 기능(전체 CMS, 미디어 업로드 승인, 범용 감사 로그, 자동 모니터링/백업, 통합검색, 행동분석 대시보드 등)은 화면 요소로 되살리지 않는다.

---

## 1. 디자인 원칙

1. **단일 강조색 원칙(Airbnb 참고)** — 코랄은 주요 CTA, 활성 탭 밑줄, 선택 상태, 즐겨찾기 하트 등 "지금 눌러야 할 것"에만 쓰고, 화면의 90% 이상은 흰 배경 + 짙은 회색 텍스트로 유지한다.
2. **사진이 아니라 정보가 신뢰를 만든다** — Airbnb는 사진 밀도로 신뢰를 만들지만, Free Traveler는 출처·확인일·안전정보처럼 검증 가능한 텍스트 정보로 신뢰를 만든다. 사진은 보조 요소로 배치한다.
3. **경보색과 브랜드색은 분리한다** — 코랄은 절대 오류·경고·안전 상태 표시에 재사용하지 않는다. semantic color(파랑/호박/적색)를 별도로 정의하고 항상 텍스트 라벨을 함께 표기한다(REQ-FUNC-051, REQ-NF-023 근거).
4. **브랜드 차용 금지** — Airbnb 워드마크, 3-프로덕트 top nav, "NEW" 배지, pill 전체를 그대로 복제하지 않는다. Free Traveler는 4개 내비게이션 링크 + 계정 진입점만 갖는 단순 Header를 사용한다.
5. **빈 데이터도 완성된 화면처럼** — DB에 콘텐츠가 없어도 안내 문장·이용 방법·다음 행동 CTA를 항상 함께 노출한다(Lorem ipsum, "준비 중", "정보 확인 필요" 금지).
6. **접근성은 기본값** — 44px 이상 터치 영역, 키보드 포커스 링, 색상 단독 의미 전달 금지를 모든 컴포넌트 명세에 포함한다.

---

## 2. 디자인 토큰

### 2.1 색상

| 토큰 | 값 | 용도 |
|---|---|---|
| `color.brand.coral` | `#FF6B4A` | 주요 CTA 배경, 활성 탭 밑줄, 선택 상태, 즐겨찾기 활성 |
| `color.brand.coral-active` | `#E14F31` | 코랄 버튼 press 상태 |
| `color.brand.coral-soft` | `#FFE4DB` | 코랄 배지/칩의 옅은 배경(비활성 강조) |
| `color.brand.coral-disabled` | `#FFD6C7` | 비활성 CTA |
| `color.text.ink` | `#262626` | 기본 본문·제목 텍스트(순검정 미사용) |
| `color.text.body` | `#4B4B4B` | 설명문, 카드 메타 |
| `color.text.muted` | `#767676` | 캡션, 보조 라벨, 비활성 탭 |
| `color.text.muted-soft` | `#A3A3A3` | placeholder, 비활성 링크 |
| `color.text.on-brand` | `#FFFFFF` | 코랄/딥 배경 위 텍스트 |
| `color.surface.canvas` | `#FFFFFF` | 기본 배경(다크모드 없음) |
| `color.surface.soft` | `#F7F6F4` | Footer, 교차 섹션 배경 |
| `color.surface.strong` | `#F1F0EC` | 카드 내부 강조 배경, 비활성 입력창 |
| `color.border.hairline` | `#E4E4E1` | 구분선, 카드 테두리 |
| `color.border.hairline-soft` | `#EFEFEC` | 옅은 섹션 구분선 |
| `color.border.strong` | `#C6C6C2` | 포커스 이전 강조 테두리 |
| `color.semantic.info` | `#2461B8` (배경 `#E7F0FC`) | 일반 안내(비전달 고지 등) |
| `color.semantic.warning` | `#9A6400` (배경 `#FDF3DA`) | 안전정보 stale 경고, 주의 배지 |
| `color.semantic.danger` | `#B0201A` (배경 `#FBE7E4`) | 폼 오류, 중대 여행경보, 신고/차단 경고 |
| `color.focus.ring` | `#1D4ED8` | 키보드 포커스 링(코랄과 명확히 구분되는 파란색) |
| `color.scrim` | `rgba(0,0,0,0.5)` | Drawer/Modal 배경 스크림 |

> semantic 색상은 항상 아이콘 + 텍스트 라벨과 함께 사용하며 배경색만으로 상태를 구분하지 않는다(예: "⚠ 최신 정보 재확인 필요" 텍스트 병기).

### 2.2 타이포그래피

기본 폰트: `font-family: 'Inter', -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif;` — 한글 본문은 Inter가 한글 글리프를 지원하지 않으므로 시스템 한글 폰트(Apple SD Gothic Neo/Malgun Gothic/Noto Sans KR)로 자동 대체된다.

| 토큰 | Desktop | Mobile | Weight | Line-height | 용도 |
|---|---|---|---|---|---|
| `type.display-xl` | 34px | 26px | 700 | 1.3 | SCR-001/002 Hero 제목 |
| `type.display-lg` | 28px | 22px | 700 | 1.3 | Screen 대제목 |
| `type.display-md` | 22px | 20px | 700 | 1.35 | Section 제목(H2) |
| `type.title-md` | 18px | 17px | 600 | 1.4 | Card 제목, 서브섹션 제목 |
| `type.title-sm` | 16px | 16px | 600 | 1.4 | 목록 아이템 제목, 폼 라벨 강조 |
| `type.body-md` | 16px | 15px | 400 | 1.6 | 기본 본문 |
| `type.body-sm` | 14px | 14px | 400 | 1.5 | 카드 메타, 설명 보조문 |
| `type.caption` | 13px | 13px | 500 | 1.4 | 배지, 칩, 폼 헬퍼텍스트 |
| `type.button` | 16px | 16px | 600 | 1.2 | 버튼 라벨 |
| `type.link` | 14px | 14px | 500 | 1.4 | 인라인 링크 |

### 2.3 Spacing & Radius

| 토큰 | 값 |
|---|---|
| `space.xxs` / `xs` / `sm` / `base` / `lg` / `xl` / `xxl` | 4 / 8 / 12 / 16 / 24 / 32 / 48px |
| `space.section-desktop` | 64~96px(기본 80px) |
| `space.section-mobile` | 40~64px(기본 48px) |
| `radius.sm` | 8px — 버튼, 입력창 |
| `radius.md` | 12px — 카드 |
| `radius.lg` | 16px — Drawer/Modal 패널, Hero 이미지 |
| `radius.pill` | 999px — Chip, 탭, 검색바 |

### 2.4 Elevation

| 토큰 | 값 | 용도 |
|---|---|---|
| `shadow.card` | `0 1px 2px rgba(0,0,0,.04), 0 4px 10px rgba(0,0,0,.06)` | 카드 hover, 검색바, 드롭다운 |
| `shadow.overlay` | `0 8px 24px rgba(0,0,0,.16)` | Drawer, Modal, Toast |
| 기본 | flat(그림자 없음) | Header, Footer, 본문 섹션 |

### 2.5 Breakpoint 기준

| 기준 | 값 | 비고 |
|---|---|---|
| Desktop | 1440px | 콘텐츠 최대 폭 1240px, 좌우 여백 자동 분배 |
| Mobile | 390px | 좌우 여백 20px, Card 1열 |
| 중간(Tablet, 참고용) | 744~1128px | 2열 Card Grid로 축소, 상세 문서화는 생략(핵심 2개 기준만 확정) |

### 2.6 접근성 · 터치 · 포커스

- 모든 인터랙티브 요소(버튼, 링크, 아이콘 버튼, 칩, 탭)는 최소 44×44px 히트 영역을 확보한다.
- 키보드 포커스 시 `color.focus.ring` 2px 아웃라인 + 2px offset을 모든 포커스 가능 요소에 적용한다(마우스 클릭 시에는 표시하지 않는 `:focus-visible` 사용).
- 색상 대비는 본문 텍스트 기준 WCAG AA(4.5:1) 이상을 목표로 한다.
- 여행경보·상태 배지는 색상 + 아이콘 + 텍스트 라벨 3중 표기를 기본으로 한다.

---

## 3. 공통 컴포넌트

### 3.1 Header (5개 Screen 공통)

| 항목 | Desktop(1440px) | Mobile(390px) |
|---|---|---|
| 높이 | 72px, sticky top, 하단 1px hairline | 56px, sticky top |
| 좌측 | "Free Traveler" 워드마크(텍스트, `type.title-md` 700 + 코랄 포인트 점) | 워드마크만(축약 없이 유지) |
| 중앙/좌 내비 | 여행지 · 여행 준비 · 동행 찾기 · 대표 소개 (`/`, `/travel-tools`, `/mates`, `/about`) | 햄버거 버튼(44×44px) → 전체화면 Sheet에 동일 4개 링크 |
| 우측 | 계정 진입점: 비로그인 "로그인"(button-secondary), 로그인 시 닉네임+아바타 텍스트 버튼 → `/account` | Sheet 하단에 동일 계정 진입점 |
| 활성 상태 | 현재 라우트 링크는 `ink` 텍스트 + 코랄 2px 밑줄 | 동일(Sheet 내 강조) |

### 3.2 Footer (5개 Screen 공통)

| 항목 | Desktop | Mobile |
|---|---|---|
| 배경 | `surface.soft`, 상하 패딩 64px | 상하 패딩 40px |
| 구성 | 3열: "여행 정보"(여행지, 국가 안전정보) · "서비스"(여행 준비, 동행 찾기) · "회사"(대표 소개, 이용약관, 개인정보 처리방침, 동행 안전수칙) | 1열 스택, 컬럼 간 24px 간격 |
| 하단 legal band | 저작권 문구, 문의 이메일 텍스트 링크 | 동일, 줄바꿈 허용 |

### 3.3 버튼

| 컴포넌트 | 배경 | 텍스트 | 형태 |
|---|---|---|---|
| `button.primary` | `coral` | `on-brand` | `radius.sm`, 높이 48px, 굵기 600 |
| `button.primary:active` | `coral-active` | `on-brand` | 동일 |
| `button.primary:disabled` | `coral-disabled` | `on-brand` | cursor not-allowed |
| `button.secondary` | `canvas` + 1px `ink` outline | `ink` | `radius.sm`, 높이 48px |
| `button.text` | 투명 | `ink`, hover 시 underline | 패딩 없음, 인라인 링크형 |

### 3.4 Card / Chip / Tabs

- **Card(공용)**: `radius.md`, `surface.canvas` 배경, 1px `hairline` 보더, hover 시 `shadow.card`. 이미지(있는 경우) 상단 16:10 비율 + `radius.md` 상단 라운드, 하단에 제목(`title-md`) + 메타(`body-sm`, muted) + 상태 배지(선택).
- **Chip**: `radius.pill`, 기본 `surface.strong` 배경 + `ink` 텍스트, 선택 시 `coral-soft` 배경 + `coral` 텍스트/보더, 높이 40px 이상.
- **Tabs**: 밑줄형(underline) 탭. 활성 탭 `ink` 텍스트 + 코랄 2px 밑줄, 비활성 `muted` 텍스트. 탭 전환 시 상태(입력값·검증·완료)는 서로 독립적으로 유지된다.

### 3.5 Drawer / Modal

- 여행지·안전정보 상세(SCR-001), 동행 상세(SCR-004 Mobile)에 사용.
- Desktop: 화면 우측에서 슬라이드 인, 폭 480~560px, `radius.lg`(좌측 모서리만), `shadow.overlay`, 배경 `scrim` 클릭 시 닫힘.
- Mobile: 하단에서 슬라이드 업하는 Bottom Sheet, 상단 80% 높이까지 확장 가능, drag handle 표시.
- 포커스 트랩 적용, `Esc`/배경 클릭/닫기 버튼(44×44px)으로 닫기 가능.

### 3.6 Form Input

- `radius.sm`, 높이 48px, 1px `hairline` 보더, 포커스 시 2px `ink` 보더 + `focus.ring` 외곽선.
- 라벨은 입력창 위 `caption` 스타일로 고정 표시(placeholder만으로 라벨을 대체하지 않음).
- 오류 상태: 보더 `danger`, 하단에 `danger` 텍스트로 원인 설명(아이콘 병기).

### 3.7 Toast(알림 대체, REQ-FUNC-043)

- 화면 우측 하단(Desktop) / 화면 상단(Mobile) 고정, `radius.md`, `shadow.overlay`, 4초 자동 소멸 + 수동 닫기.
- 성공(코랄 아님, `ink` 배경 + 흰 텍스트 또는 `surface.strong` 배경 + 체크 아이콘), 오류(`danger` 텍스트), 정보(`info` 텍스트) 타입 구분.

### 3.8 Empty / Error / Loading 공통 패턴

| 상태 | 구성 |
|---|---|
| Loading | 콘텐츠 영역과 동일한 크기의 skeleton block(카드 형태 유지), 텍스트 "불러오는 중입니다" 스크린리더 안내 |
| Empty | 아이콘 없이 텍스트 우선: ① 상황 설명 1문장, ② 이용 방법 또는 조건 완화 안내 1문장, ③ 다음 행동 CTA 버튼 |
| Error | `danger` 아이콘 + "일시적으로 정보를 불러오지 못했어요" 류 문장 + "다시 시도" 버튼 |
| Unauthorized | 잠금 아이콘 + "로그인이 필요한 기능이에요" + "로그인하기" CTA(→ `/account`) |

---

## 4. 레이아웃 · 섹션 배치 규칙

- Desktop 콘텐츠 컨테이너 최대 폭: **1240px**, 중앙 정렬.
- Section 상하 패딩: Desktop **80px**(범위 64~96px 내 조정), Mobile **48px**(범위 40~64px 내 조정).
- Hero는 Desktop 1440×900 기준 뷰포트 높이의 약 60~65%(≈ 560px)만 차지하도록 설계해 다음 Section 상단이 최소 80px 이상 보이게 한다. Mobile Hero는 상하 패딩 40px로 축소한다.
- 같은 Card 패턴 반복을 피하기 위해 아래 8개 패턴을 화면별로 교차 배치한다: **Hero / Card Grid / 좌우분할(Split) / Chip 목록 / 3단계 안내(Steps) / CTA Banner / Timeline / Gallery**. Tabs, Filter+List, Form은 SCR-003·004의 기능형 섹션에서 보조로 사용한다.
- 모든 Section은 제목(H2, `display-md`) + 1~3문장 설명(`body-md`, muted) + 실제 콘텐츠 또는 명확한 CTA로 구성한다.
- Mobile에서 Card Grid는 항상 1열로 세로 스택하며, 가로 스크롤 캐러셀은 사용하지 않는다(접근성 스와이프 의존 최소화).
- 사진 alt 텍스트는 실제 장소·구도를 설명하는 문장으로 작성한다(예: "야경 속 부산 해운대 해수욕장과 마천루", "에펠탑이 보이는 파리 트로카데로 광장 노을").

---

## 5. Screen 상세 명세

### SCR-001 `/` 메인

**사용자 목표**: 국내·해외 여행지를 발견하고 상세·안전정보를 확인한 뒤 `/travel-tools`, `/mates`, `/about`으로 이어간다.
**Header/Footer**: 공통 컴포넌트 그대로 사용.

| # | Section | 패턴 | Desktop 레이아웃 | Mobile 레이아웃 | 콘텐츠 규칙 | 관련 요구사항 |
|---|---|---|---|---|---|---|
| 1 | 검색 Hero | Hero | 좌: 제목 "어디로 떠나고 싶으신가요?" + 1문장 설명 + 검색 인풋(`radius.pill`, 높이 56px) + `/travel-tools` 보조 CTA("여행 조건 정리하기"), 우: 대표 여행지 사진 1장. 높이 ≈560px | 세로 스택, 검색 인풋 전체폭, CTA 버튼 하단 고정폭 100% | 검색 placeholder "여행지, 국가, 테마로 검색" | REQ-FUNC-003, 067(대체) |
| 2 | 국내 인기 여행지 | Card Grid | 3열×2행(6개), 카드 이미지 16:10 | 1열 스택(6개) | 제목 "국내에서 먼저 떠나볼 여행지", 설명 "가까운 곳에서 자유여행의 감각을 익혀보세요.", 카드 클릭 시 SCR-001 내 상세 Drawer | REQ-FUNC-001, 002, 004, 009 |
| 3 | 해외 인기 여행지 | Card Grid | 3열×2행(6개) | 1열 스택(6개) | 제목 "지금 인기 있는 해외 여행지", 국가명·도시명·추천 시기 배지 표시 | REQ-FUNC-001, 002, 004, 009 |
| 4 | 여행 동기·테마 | Chip 목록 | 6개 Chip을 1행에 배치, 선택 시 필터 결과로 스크롤 이동 | 2열 Chip 그리드 | 제목 "어떤 여행을 원하세요?", 테마 예: 휴양, 미식, 도심 산책, 자연·트레킹, 가족 여행, 배낭여행 | REQ-FUNC-002 |
| 5 | 국가별 주의사항 | Card Grid | 3열×2행(6개국 카드), 카드 하단에 경보 단계·최종 확인일 배지 | 1열 스택 | 제목 "떠나기 전 꼭 확인할 안전정보", 카드 클릭 시 SCR-001 안전정보 Drawer 오픈(REQ-FUNC-006 연결) | REQ-FUNC-046~054 |
| 6 | 최근 동행글 | Card Grid 또는 Empty State | 데이터 있음: 3개 카드(국가·기간·모집 상태), 데이터 없음: Empty State(설명+이용방법+작성 CTA) | 동일 패턴 1열 | 제목 "함께 떠날 동행을 찾아보세요", Empty 문구: "아직 등록된 동행글이 없어요. 관심 있는 여행 조건으로 첫 동행글을 남겨보세요." + "동행글 작성하기"(→ `/travel-tools` 동행 탭) | REQ-FUNC-030, 031 |
| 7 | free_traveler 요약 | 좌우분할(Split) | 좌: 소개문 2~3문장 + `50+ Trips`/`30+ Countries` 지표, 우: 대표 사진, 하단 "대표 이야기 더 보기"(→ `/about`) CTA | 세로 스택(사진→텍스트→CTA) | 제목 "이 추천을 믿어도 되는 이유", 문구는 06_대표 프로필 데이터와 일치 | REQ-FUNC-057~059 |

**이동 CTA 배치**: Hero 보조 CTA(→ `/travel-tools`), Section 6 CTA(→ `/travel-tools` 동행 탭), Section 7 CTA(→ `/about`), Header 상시 링크(→ `/mates`).

**상태**:

| 상태 | 적용 범위 | 설명 |
|---|---|---|
| Loading | Section 2·3·5·6 | 카드 skeleton |
| Success | 전체 | 정상 데이터 렌더링 |
| Empty | Section 6(최근 동행글) | 위 Empty 문구 적용, 다른 Section은 정적 데이터로 항상 채워지므로 Empty 미적용 |
| Error | Section 2·3·5·6 | "여행지 정보를 불러오지 못했어요, 다시 시도" |
| Unauthorized | 해당 없음(전체 공개) | — |

---

### SCR-002 `/about` 대표 소개

**사용자 목표**: `free_traveler`의 경험과 철학을 확인해 콘텐츠 신뢰 근거를 파악한다.
**Header/Footer**: 공통 컴포넌트.

| # | Section | 패턴 | Desktop 레이아웃 | Mobile 레이아웃 | 콘텐츠 규칙 | 관련 요구사항 |
|---|---|---|---|---|---|---|
| 1 | Hero | Hero | 좌: 대표 사진(정방형), 우: 이름 "free_traveler" + 한 문장 소개(PRD 6-2 소개문 축약) | 세로 스택(사진→텍스트) | 높이 ≈480px, 다음 Section 노출 확보 | REQ-FUNC-057, 058 |
| 2 | 여행 지표 | Card Grid(2개 소형 카드) | `50+ Trips`, `30+ Countries` 카드 2개 나란히 배치 | 2열 유지(카드 폭만 축소) | 숫자는 `display-lg`로 강조, 하단 설명 "직접 계획하고 다녀온 자유여행 기준" | REQ-FUNC-057 |
| 3 | 소개 | 좌우분할(Split) | 좌: 목차형 소제목(자기소개/여행을 시작한 이유/여행 철학), 우: 2~4문단 본문 | 세로 스택, 소제목→본문 순서 | 문단은 PRD 6-1·6-2 내용을 자연스러운 완성 문장으로 확장 | REQ-FUNC-058 |
| 4 | 여행 Timeline | Timeline | 세로 타임라인, 좌측 연도 마커 + 우측 장소·요약 카드, 최소 6개 시점 | 세로 타임라인 그대로(가로 폭만 축소) | 각 항목: 연도, 장소명, 1문장 요약 | REQ-FUNC-060 |
| 5 | 방문 국가 | Chip 목록 | 권역별(아시아/유럽/북미/오세아니아) 그룹 헤딩 + Chip 목록 | 그룹별 세로 스택 | 국가명 Chip 클릭 시 관련 여행지 있으면 SCR-001 상세로 이동, 없으면 비활성 스타일 | REQ-FUNC-059 |
| 6 | 여행 Gallery | Gallery | 8장 이상, 3열 masonry 유사 그리드 | 2열 그리드 | 각 이미지 alt는 실제 장소 설명 문장, 출처/작가 캡션 하단 표기 | REQ-FUNC-061 |
| 7 | 기억에 남는 여행지 | Card Grid + CTA Banner | 4개 카드 + 하단 CTA Banner(“나도 이 여행지로 떠나볼까요?” + `/travel-tools`, `/mates` 버튼 2개) | 1열 카드 스택 + CTA Banner | 카드 클릭 시 SCR-001 상세로 이동(비공개 여행지는 자동 제외) | REQ-FUNC-063 |

**상태**: 전 Section이 정적 콘텐츠이므로 Empty/Unauthorized는 해당 없음. Loading(초기 렌더 skeleton) / Success / Error("대표 소개 정보를 불러오지 못했어요, 다시 시도")만 정의한다.

---

### SCR-003 `/travel-tools` 통합 여행 준비

**사용자 목표**: 항공·숙소 조건을 정리해 외부 사이트로 이동하거나 동행 모집글을 작성한다.
**Header/Footer**: 공통 컴포넌트.

| # | Section | 패턴 | Desktop 레이아웃 | Mobile 레이아웃 | 콘텐츠 규칙 | 관련 요구사항 |
|---|---|---|---|---|---|---|
| 1 | Intro | Intro Banner | 제목 "떠나기 전, 조건부터 정리해요" + "국가·기간을 먼저 정리하면 외부 예약 사이트에서 헤매지 않아요." + 이용 순서 요약(입력→요약 확인→이동) | 동일, 텍스트만 줄바꿈 | 페이지 목적과 순서를 1~2문장으로 명확히 | PRD 2-3 |
| 2 | 탭 | Tabs | "항공편" / "숙소" / "동행 구하기" 3개 탭, 밑줄형 | 가로 스크롤 없는 3분할 탭(각 33%) | 탭 전환 시 입력·검증·완료 상태 독립 유지 | REQ-FUNC-011, 019, 031 |
| 3 | 조건 입력 Form | Form | 국가·지역·출발일(또는 체크인)·귀국일(또는 체크아웃) 2열 배치 | 1열 스택 | 필수 표시, 국가 변경 시 지역 리셋, 날짜 역전 시 인라인 오류 | REQ-FUNC-011~013, 019~021 |
| 4 | 요약 + 외부 이동 Action Card | 좌우분할(Split) | 좌: 입력 요약 텍스트 카드, 우: Action Card(“항공편 보러 가기”/“숙소 보러 가기” 코랄 버튼 + 새 탭 안내 아이콘) | 세로 스택(요약→Action Card) | 요약 값은 입력값과 정확히 일치, 버튼은 44px 이상 | REQ-FUNC-014, 015, 016, 022~024 |
| 5 | 비전달 고지 + Tip 3개 | 3단계 안내(Steps) | "입력값은 외부 사이트로 전달되지 않습니다" 고지 배너 + 하단 3단계 팁 카드(예: "① 왕복 날짜는 여유 있게 ② 지역명은 도시 단위로 ③ 도착 시간대를 고려하세요") | 세로 스택 3장 | 팁은 실제 여행 준비에 도움 되는 문장으로 작성, 빈 카드 금지 | REQ-FUNC-015, 023, 054 |
| 6 | 동행 탭 콘텐츠 | Form 또는 CTA Banner | 비로그인/미성년: 로그인·성인확인 안내 CTA Banner("동행 모집글은 로그인 및 성인 인증 후 작성할 수 있어요" + "로그인하기"), 인증 완료: 모집글 작성 Form(제목·국가·기간·모집 인원·여행 스타일·설명·안전수칙 동의) | 동일 패턴 유지, Form 1열 | 연락처 패턴 입력 시 인라인 차단 안내, 안전 수칙 동의 체크박스 필수 | REQ-FUNC-027~029, 031, 032, 080 |

**세 탭 상태 분리**: 항공/숙소/동행 각 탭은 자체 `입력값 → 검증 → 완료(요약 또는 제출)` 상태 머신을 가지며, 다른 탭으로 이동해도 현재 탭의 세션 내 상태는 유지된다.

**상태**:

| 상태 | 적용 | 설명 |
|---|---|---|
| Loading | 없음(클라이언트 즉시 렌더) | 폼은 정적 렌더이므로 별도 Loading 불필요 |
| Success | Section 4 | 요약 표시, 외부 이동 성공 |
| Empty | 해당 없음 | 폼 화면이므로 Empty 상태 없음 |
| Error | Section 3·4 | 날짜 검증 오류, 외부 URL 이동 실패("현재 외부 사이트에 연결할 수 없어요, 다시 시도") |
| Unauthorized | Section 6(동행 탭) | 미인증 시 CTA Banner로 대체, 폼 자체를 렌더하지 않음 |

---

### SCR-004 `/mates` 동행 조회

**사용자 목표**: 조건에 맞는 동행 모집글을 찾아 참가를 요청하거나, 작성자로서 요청을 관리한다.
**Header/Footer**: 공통 컴포넌트.

| # | Section | 패턴 | Desktop 레이아웃 | Mobile 레이아웃 | 콘텐츠 규칙 | 관련 요구사항 |
|---|---|---|---|---|---|---|
| 1 | Intro | CTA Banner | 제목 "믿을 수 있는 동행을 찾아보세요" + 설명 1문장 + "동행글 작성하기" CTA(우측 상단 고정) | 세로 스택, CTA 버튼 전체폭 | 미인증 사용자도 열람은 가능, CTA는 로그인 유도로 전환 | REQ-FUNC-027, 031 |
| 2 | Filter + 결과 요약 | Filter | 국가·지역·기간·모집 상태 Chip/Select 1행 배치 + "조건에 맞는 동행글 N개" 요약 텍스트 | Filter를 접이식 패널로 축약(버튼 클릭 시 펼침) | 결과 0건이어도 조건 완화 안내 문구 표시 | REQ-FUNC-030 |
| 3 | 동행글 목록 | Card Grid | 데이터 있으면 최대 8개 카드 우선 노출(국가·기간·모집 인원·상태 배지), 8개 초과 시 "더 보기" | 1열 스택, 동일 우선순위 | 데이터 없으면 Empty State(검색 조건 초기화 버튼 + 작성 CTA + 이용 방법 1문장) | REQ-FUNC-030, 033, 037 |
| 4 | 목록 + 상세 | 좌우분할(Split) / Drawer | Desktop: 좌 40% 목록 + 우 60% 상세 패널(고정), 카드 클릭 시 우측 패널 갱신 | Mobile: 목록 카드 클릭 시 하단 Drawer로 상세 오픈(참가 요청 폼, 작성자용 승인/거절, 마감/수정/삭제, 신고, 차단 포함) | REQ-FUNC-034~040 |
| 5 | 동행 신청 방법 | 3단계 안내(Steps) | "① 조건에 맞는 글 찾기 → ② 참가 메시지 보내기 → ③ 작성자 승인 기다리기" 3카드 가로 배치 | 세로 스택 3장 | 연락처 없이도 안전하게 요청하는 흐름을 강조 | REQ-FUNC-034, 036 |
| 6 | 안전 안내 | CTA Banner | "안전한 동행을 위한 약속" 안내(공개 연락처 금지, 신고·차단 안내) + "여행 조건 다시 정리하기"(→ `/travel-tools`) CTA | 동일, 세로 스택 | 신고·차단 사용 방법을 1~2문장으로 안내 | REQ-FUNC-032, 033, 039, 040 |

**Empty State 공통 규칙(Section 3)**: "조건에 맞는 동행글이 아직 없어요." + "필터를 조정하거나 새로운 조건으로 첫 동행글을 남겨보세요." + 버튼 2개("필터 초기화", "동행글 작성하기").

**상태**:

| 상태 | 적용 범위 | 설명 |
|---|---|---|
| Loading | Section 3·4 | 카드/상세 패널 skeleton |
| Success | 전체 | 정상 목록·상세 |
| Empty | Section 3(목록 없음), Section 4(선택된 글 없음 — Desktop 상세 패널에 "왼쪽 목록에서 동행글을 선택해주세요" 안내) | 위 문구 |
| Error | Section 3·4 | "동행글 정보를 불러오지 못했어요, 다시 시도" |
| Unauthorized | Section 4(참가 요청/작성자 액션) | "로그인 후 참가를 요청할 수 있어요" + 로그인 CTA, 열람 자체는 비로그인도 허용 |

---

### SCR-005 `/account` 계정·관리

**사용자 목표**: 인증 상태에 맞게 로그인/가입, 프로필·성인확인, 내 활동, (권한자) 신고·외부 URL 관리를 한 화면에서 수행한다.
**Header/Footer**: 공통 컴포넌트. 역할에 없는 탭은 렌더링하지 않는다.

Section 수를 고정하지 않고 역할(Guest/Member/Admin)별 탭 구성으로 설계한다. 탭 자체가 Header 아래 첫 요소이며, 각 탭 콘텐츠는 여전히 "제목 + 설명 + 실제 콘텐츠/CTA" 원칙을 따른다.

#### Guest 상태(비로그인)

| 영역 | 패턴 | 내용 | 관련 요구사항 |
|---|---|---|---|
| 계정 기능 Intro | Intro Banner | "로그인하고 나만의 동행과 활동을 관리해보세요" + 로그인 후 가능한 기능 3가지 텍스트 나열(동행 모집·참가 요청, 즐겨찾기 동기화 안내, 내 활동 확인) | REQ-FUNC-066 |
| 로그인/가입/재설정 Card | Card Grid(3개 카드 또는 Tabs) | "로그인", "회원가입", "비밀번호 재설정" 각각 Form 진입 카드 | REQ-FUNC-066 |
| 보안 안내 | CTA Banner | "이메일과 비밀번호는 안전하게 암호화되어 저장돼요" + 개인정보 처리방침 링크 | REQ-NF-012~016 |

#### Member 상태(로그인 완료)

| 탭 | 패턴 | 내용 | 관련 요구사항 |
|---|---|---|---|
| 프로필 | Form | 닉네임·연령대·성별(선택)·여행 스타일·자기소개 편집, 성인확인 상태 요약 배지("성인 인증 완료 · 2026-08-01") | REQ-FUNC-028, 029 |
| 내 활동 — 내 글 | Card Grid 또는 Empty | 내가 작성한 동행 모집글 목록(상태 배지: 모집중/마감), 없으면 "아직 작성한 동행글이 없어요" + 작성 CTA(→ `/travel-tools` 동행 탭) | REQ-FUNC-038 |
| 내 활동 — 참가 요청 | Card Grid 또는 Empty | 내가 보낸/받은 참가 요청 상태 목록(PENDING/ACCEPTED/REJECTED), 없으면 "보낸 참가 요청이 없어요" + `/mates` 이동 CTA | REQ-FUNC-034, 036 |
| 차단 목록 | Card Grid 또는 Empty | 차단한 사용자 목록 + 해제 버튼, 없으면 "차단한 사용자가 없어요" | REQ-FUNC-040 |
| 새 동행글 작성 CTA | CTA Banner | 탭 상단 고정 보조 CTA("새 동행글 작성하기" → `/travel-tools`) | REQ-FUNC-031 |

#### Admin 상태(Moderator/Admin, 해당 role에게만 탭 노출)

| 탭 | 패턴 | 내용 | 관련 요구사항 |
|---|---|---|---|
| 관리 Intro | Intro Banner | "신고 처리와 외부 이동 링크만 관리하는 최소 관리자 도구입니다" | PROJECT_SCOPE §2 |
| 신고 상태 변경 | Filter + List | 신고 목록(OPEN/RESOLVED/DISMISSED 필터) + 상태 변경 버튼, 없으면 "처리할 신고가 없어요" | REQ-FUNC-041 |
| 외부 URL 설정 | Form | 항공·숙소 외부 URL 입력(HTTPS·허용목록 검증), 저장 시 인라인 확인 메시지 | REQ-FUNC-077 |

**상태**:

| 상태 | 적용 범위 | 설명 |
|---|---|---|
| Loading | Member/Admin 탭 목록 영역 | skeleton |
| Success | 전체 | 정상 데이터 |
| Empty | 내 글/참가 요청/차단/신고 목록 | 위 각 문구 적용 |
| Error | 모든 탭 | "정보를 불러오지 못했어요, 다시 시도" |
| Unauthorized | Member/Admin 탭 직접 접근 시 | 비로그인 → Guest 화면으로 대체, 권한 없는 사용자가 Admin 탭 URL 접근 시 "이 기능에 접근할 권한이 없어요" + 홈 이동 CTA |

---

## 6. Empty / No-Data 카피 가이드(요약)

| 위치 | 문장 예시 |
|---|---|
| SCR-001 최근 동행글 | "아직 등록된 동행글이 없어요. 관심 있는 여행 조건으로 첫 동행글을 남겨보세요." + "동행글 작성하기" |
| SCR-004 목록 없음 | "조건에 맞는 동행글이 아직 없어요. 필터를 조정하거나 새로운 조건으로 첫 동행글을 남겨보세요." + "필터 초기화" / "동행글 작성하기" |
| SCR-005 내 글 없음 | "아직 작성한 동행글이 없어요. 함께 떠날 동행을 지금 모집해보세요." + "새 동행글 작성하기" |
| SCR-005 참가 요청 없음 | "보낸 참가 요청이 없어요. 마음에 드는 동행글에 참가를 요청해보세요." + "동행글 둘러보기" |
| SCR-005 관리자 신고 없음 | "현재 처리할 신고가 없어요." |

모든 Empty 문구는 "준비 중", "정보 확인 필요" 같은 무의미한 placeholder 없이 상황 설명·이용 방법·다음 행동을 완성된 한국어 문장으로 제공한다.

---

## 7. 검증 체크

- 5개 디자인 Screen(SCR-001~005)만 사용했으며 6번째 Screen을 만들지 않았다.
- 여행지·안전정보 상세는 SCR-001 Drawer/Modal, 항공·숙소·동행 작성은 SCR-003 3개 탭, 동행 상세는 SCR-004 상세 패널, 로그인·프로필·내 활동·간단 관리자는 SCR-005 탭으로 배치했다.
- SCR-001·002는 각 7개 Section, SCR-003·004는 각 6개 Section으로 구성했다.
- Hero, Card Grid, 좌우분할, Chip 목록, 3단계 안내, CTA Banner, Timeline, Gallery를 교차 배치해 동일 Card 반복을 피했다.
- 모든 Section에 제목·설명·실제 콘텐츠 또는 CTA를 포함했고, Lorem ipsum·"준비 중"·의미 없는 빈 카드를 사용하지 않았다.
- Empty 상태에는 안내 문장·이용 방법·다음 행동 CTA를 함께 표기했다.
- `PROJECT_SCOPE.md`의 EXCLUDED 항목(전체 CMS 편집기, 미디어 업로드 승인 UI, 감사 로그 화면, 통합검색 UI, 행동분석 대시보드, 부하/장애 모니터링 화면)은 어떤 Screen에도 복원하지 않았다.
