/**
 * 대표 소개 정적 데이터 — DATA-REPRESENTATIVE.
 * `totalTrips`/`totalCountries`는 홈(C-SCR001-FOUNDER-SPLIT)과 대표 소개
 * (C-SCR002-PROFILE-HERO) 양쪽이 공통으로 참조하는 단일 소스다.
 * 최소 콘텐츠 수(방문 국가 30+/Timeline 6+/Gallery 8+)는 TypeScript 최소 길이
 * 튜플로 강제한다 — 스키마 미충족 시 컴파일 오류가 발생한다.
 */

type BuildTuple<L extends number, T, Acc extends T[] = []> = Acc["length"] extends L
  ? Acc
  : BuildTuple<L, T, [...Acc, T]>;

type AtLeast<T, L extends number> = [...BuildTuple<L, T>, ...T[]];

export interface AboutPhilosophySection {
  heading: string;
  paragraphs: AtLeast<string, 2>;
}

export interface AboutCountryChip {
  country: string;
  region: "아시아" | "유럽" | "북미" | "남미" | "오세아니아" | "아프리카";
}

export interface AboutTimelineItem {
  year: string;
  place: string;
  summary: string;
}

export interface AboutGalleryImage {
  url: string;
  alt: string;
  source: string;
  photographer: string;
  license: string;
}

export interface AboutContactLink {
  label: string;
  url: string; // mailto: 또는 https: 프로토콜만 허용
}

export interface AboutData {
  name: string;
  tagline: string;
  totalTrips: number;
  totalCountries: number;
  philosophySections: AtLeast<AboutPhilosophySection, 2>;
  visitedCountries: AtLeast<AboutCountryChip, 30>;
  timeline: AtLeast<AboutTimelineItem, 6>;
  gallery: AtLeast<AboutGalleryImage, 8>;
  contactLinks: AboutContactLink[];
}

function galleryImage(seed: string, alt: string): AboutGalleryImage {
  return {
    url: `https://picsum.photos/seed/${seed}/1200/900`,
    alt,
    source: "Lorem Picsum",
    photographer: "Lorem Picsum contributors",
    license: "Picsum License(무료 사용) — 게시 전 담당자가 실제 여행 사진으로 교체 확인 필요",
  };
}

export const aboutData: AboutData = {
  name: "김도윤",
  tagline: "50번의 여행, 30개국에서 배운 것들을 나누는 자유여행 큐레이터.",
  totalTrips: 50,
  totalCountries: 30,
  philosophySections: [
    {
      heading: "자기소개",
      paragraphs: [
        "안녕하세요, free_traveler를 만든 김도윤입니다. 지난 10년간 50번의 여행을 통해 30개국을 다니며 각 나라의 문화와 사람들을 만나왔습니다.",
        "혼자 떠난 배낭여행에서 시작해 지금은 여행 정보를 정리하고 동행을 찾는 여행자들을 돕는 일을 하고 있습니다.",
      ],
    },
    {
      heading: "여행을 시작한 이유",
      paragraphs: [
        "대학 시절 우연히 떠난 도쿄 여행에서 낯선 곳에서 스스로 길을 찾아가는 경험에 매료되었습니다.",
        "정해진 패키지여행이 아니라 직접 계획하고 부딪히며 배우는 여행의 재미를 알게 된 뒤로, 매년 새로운 나라를 찾아 떠나게 되었습니다.",
        "여행 중 만난 동행들과의 인연이 여행을 더 풍요롭게 만든다는 것을 깨달으며, 이 서비스를 구상하게 되었습니다.",
      ],
    },
    {
      heading: "여행 철학",
      paragraphs: [
        "여행은 목적지가 아니라 그 과정에서 만나는 사람과 순간에 있다고 믿습니다.",
        "안전하게, 그러나 낯섦을 두려워하지 않는 자유로운 여행을 지향합니다.",
        "혼자 떠나도 외롭지 않도록, 함께할 동행을 편하게 찾을 수 있는 문화를 만들고 싶습니다.",
      ],
    },
  ],
  visitedCountries: [
    { country: "일본", region: "아시아" },
    { country: "태국", region: "아시아" },
    { country: "베트남", region: "아시아" },
    { country: "대만", region: "아시아" },
    { country: "싱가포르", region: "아시아" },
    { country: "인도네시아", region: "아시아" },
    { country: "캄보디아", region: "아시아" },
    { country: "라오스", region: "아시아" },
    { country: "필리핀", region: "아시아" },
    { country: "프랑스", region: "유럽" },
    { country: "이탈리아", region: "유럽" },
    { country: "스페인", region: "유럽" },
    { country: "영국", region: "유럽" },
    { country: "스위스", region: "유럽" },
    { country: "독일", region: "유럽" },
    { country: "그리스", region: "유럽" },
    { country: "포르투갈", region: "유럽" },
    { country: "체코", region: "유럽" },
    { country: "네덜란드", region: "유럽" },
    { country: "오스트리아", region: "유럽" },
    { country: "아이슬란드", region: "유럽" },
    { country: "미국", region: "북미" },
    { country: "캐나다", region: "북미" },
    { country: "멕시코", region: "북미" },
    { country: "호주", region: "오세아니아" },
    { country: "뉴질랜드", region: "오세아니아" },
    { country: "페루", region: "남미" },
    { country: "아르헨티나", region: "남미" },
    { country: "모로코", region: "아프리카" },
    { country: "남아프리카공화국", region: "아프리카" },
  ],
  timeline: [
    { year: "2016", place: "도쿄, 일본", summary: "첫 해외 배낭여행 — 혼자 여행하는 즐거움을 처음 알게 됨." },
    { year: "2017", place: "방콕·치앙마이, 태국", summary: "동남아 3개월 장기 배낭여행." },
    { year: "2018", place: "파리·로마, 유럽", summary: "첫 유럽 여행 — 미술관과 건축 순례." },
    { year: "2019", place: "시드니·퀸스타운, 호주·뉴질랜드", summary: "워킹홀리데이로 1년간 오세아니아 체류." },
    { year: "2022", place: "페루", summary: "마추픽추 트레킹으로 첫 남미 여행." },
    { year: "2024", place: "모로코", summary: "사하라 사막 투어와 아프리카 첫 여행." },
    { year: "2025", place: "아이슬란드", summary: "오로라를 보기 위한 겨울 여행." },
  ],
  gallery: [
    galleryImage("about-01", "도쿄 시부야 스크램블 교차로를 걷는 모습"),
    galleryImage("about-02", "치앙마이 사원 앞에서 촬영한 전신 사진"),
    galleryImage("about-03", "파리 에펠탑을 배경으로 한 야경 사진"),
    galleryImage("about-04", "퀸스타운 호수 앞에서 찍은 풍경 사진"),
    galleryImage("about-05", "마추픽추 유적지 전경을 담은 사진"),
    galleryImage("about-06", "모로코 사하라 사막 캠프에서의 일몰 사진"),
    galleryImage("about-07", "아이슬란드 오로라를 배경으로 한 야간 사진"),
    galleryImage("about-08", "산토리니 이아마을 골목에서 촬영한 사진"),
  ],
  contactLinks: [
    { label: "이메일", url: "mailto:hello@freetraveler.app" },
    { label: "인스타그램", url: "https://instagram.com/free_traveler" },
    { label: "유튜브", url: "https://youtube.com/@free_traveler" },
  ],
};
