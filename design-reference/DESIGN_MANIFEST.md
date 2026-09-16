# Design Manifest

**Active Design Version:** D-001
**Status:** LOCKED
**Active File:** `design-reference/D-001/DESIGN.md`
**Vendor Reference:** `design-reference/vendor/airbnb/DESIGN.md` (methodology reference only — photo-led card structure, whitespace rhythm, single-accent discipline; no Airbnb trademark, copy, or booking/payment UI is reused)

## Approved Screens

Source of truth: `docs/STITCH_VALIDATION_REPORT.md` (validation date 2026-09-15, Stitch project `12226533151143086463`).

| Screen | Route | Approved Screen ID (Desktop) | Approved Screen ID (Mobile) |
|---|---|---|---|
| SCR-001 | `/` 메인 | `screens/218b4cc3a3144ec8b86936fb7140a5ea` | `screens/72dc8eb15eb44d2fbd4c6caf273cd765` |
| SCR-002 | `/about` 대표 소개 | `screens/26266b90d23d4f05ae2d4d4d2341554c` | — (no mobile variant required) |
| SCR-003 | `/travel-tools` 통합 여행 준비 | `screens/824f29d2716c4eb184ae2d3ad0b55b2f` | `screens/990d6f5dc54b4edea1655799b7781460` |
| SCR-004 | `/mates` 동행 조회 | `screens/248a4a5680a24703b22a46784b30bce2` | — (no mobile variant required) |
| SCR-005 | `/account` 계정·관리 | `screens/ca8d8d4d60d248dba4da52207de2609a` | — (no mobile variant required) |

**Mobile Variants:** SCR-001, SCR-003 (per scope — SCR-002/004/005 desktop-only by design).

**Stitch project:** https://stitch.withgoogle.com/projects/12226533151143086463 — Project ID `12226533151143086463`.

## Known Non-Canonical Screens (excluded from D-001)

These exist in the Stitch project but are **not** part of the approved set and must not be treated as reference when implementing:

| Screen ID | Reason for exclusion |
|---|---|
| `screens/e12ecc9704c243f7b8e97459a504431d` | Duplicate SCR-001 — contains star ratings/review counts on destination cards, violates §9/§20 of D-001 (no rating widgets) |
| `screens/c03575e53501423781e6cdfc4651ede7` | Duplicate SCR-001 — mixes English section titles ("Domestic Gateway", "Global Hotspots") into a Korean-only surface |
| `screens/de486a4b0b86400d84916773394d4fe3` | Out-of-scope auto-generated screen (`/travel-tools?tab=mates`), not part of the requested SCR-001–005 set |

These three require manual deletion in the Stitch web UI (no delete API is exposed by the Stitch MCP tools as of this manifest).

## Governance

- **D-001 is LOCKED.** Any token, component, or section-order change requires a new version (`D-002`, etc.) under `design-reference/`, plus an update to this manifest's "Active Design Version" — do not edit `D-001/DESIGN.md` in place once implementation has started against it.
- Implementation (components, pages, styles) must reference tokens and rules from `design-reference/D-001/DESIGN.md` exclusively — the vendor Airbnb file is background reading only, never a direct implementation source.
- Any new screen or section proposed outside SCR-001–005 must be validated against `design-reference/D-001/DESIGN.md` §17–§19 before being added to the approved set above.

## Prohibited (system-wide)

- Airbnb trademark elements (wordmark, three-product nav, "NEW" badge, star-rating convention, Cereal font, Rausch-named tokens).
- Purchase / reservation / checkout / payment-method / price-display UI of any kind.
- Proprietary or licensed font files — Inter + system Korean fallbacks only.
- Any color value not defined as a token in `design-reference/D-001/DESIGN.md` §2.
