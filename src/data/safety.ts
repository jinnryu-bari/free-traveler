/**
 * 국가 안전정보 정적 데이터 — DATA-SAFETY.
 * DATA-DESTINATIONS에 게시되는 모든 해외 국가(15개국)에 대해 안전정보 1건 이상을
 * 제공한다. 8개 카테고리는 TypeScript 인터페이스로 필수 필드로 강제한다.
 */

export type SafetyAlertLevel = 0 | 1 | 2 | 3 | 4;
export type SafetyScopeType = "country" | "region";

export interface SafetyCategories {
  security: string; // 치안
  scam: string; // 사기
  law: string; // 법규
  transport: string; // 교통
  disasterClimate: string; // 재난·기후
  health: string; // 보건
  cultureDressCode: string; // 문화·복장
  emergencyContacts: string; // 긴급연락처
}

export interface CountrySafety {
  id: string;
  country: string;
  alertLevel: SafetyAlertLevel;
  scopeType: SafetyScopeType;
  scopeText: string;
  categories: SafetyCategories;
  sourceName: string;
  sourceUrl: string;
  lastCheckedAt: string;
  editor: string;
}

const SOURCE_NAME = "대한민국 외교부 해외안전여행";
const SOURCE_URL = "https://www.0404.go.kr";
const EDITOR = "free_traveler 안전정보팀";
const LAST_CHECKED = "2026-01-01";

export const countrySafetyInfo: CountrySafety[] = [
  {
    id: "safety-japan",
    country: "일본",
    alertLevel: 0,
    scopeType: "country",
    scopeText: "전역",
    categories: {
      security:
        "전반적으로 치안이 우수하나 관광지·번화가에서는 소매치기에 유의하세요.",
      scam: "길거리 호객 바(캐치바)를 통한 바가지 요금 피해 사례가 있으니 주의하세요.",
      law: "공공장소 흡연이 엄격히 제한되며 지정 흡연구역만 이용해야 합니다.",
      transport:
        "대중교통이 정확하고 안전하나 러시아워 혼잡도가 매우 높습니다.",
      disasterClimate:
        "지진·태풍이 빈번하니 숙소의 대피 안내를 사전에 확인하세요.",
      health:
        "의료 수준이 높으나 여행자보험 가입과 해외진료 가능 병원 확인을 권장합니다.",
      cultureDressCode:
        "사원·신사 방문 시 정숙을 유지하고 노출이 심한 복장은 자제하세요.",
      emergencyContacts:
        "경찰 110 · 구급/화재 119 · 주일본 대한민국대사관 +81-3-3452-7611",
    },
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-thailand",
    country: "태국",
    alertLevel: 0,
    scopeType: "region",
    scopeText: "남부 국경 3개주(얄라·빠따니·나라티왓)는 여행 자제 지역",
    categories: {
      security:
        "방콕·치앙마이 등 주요 관광지는 안전하나 남부 국경지역은 여행을 자제해야 합니다.",
      scam: "보석·투어 사기, 미터기 조작 택시 요금 사기 사례가 흔하니 주의하세요.",
      law: "왕실을 모독하는 언행은 중대 범죄로 처벌되며, 대마초는 여전히 규제 대상입니다.",
      transport:
        "툭툭·택시 이용 시 사전에 요금을 협의하거나 그랩(Grab) 앱 이용을 권장합니다.",
      disasterClimate: "우기(6~10월)에는 홍수·집중호우에 대비해야 합니다.",
      health: "뎅기열 등 모기 매개 감염병 예방을 위해 방충 대책이 필요합니다.",
      cultureDressCode:
        "사원 방문 시 어깨·무릎을 가리는 복장을 갖추고 신발을 벗어야 합니다.",
      emergencyContacts:
        "관광경찰 1155 · 응급 1669 · 주태국 대한민국대사관 +66-2-481-6000",
    },
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-vietnam",
    country: "베트남",
    alertLevel: 0,
    scopeType: "country",
    scopeText: "전역",
    categories: {
      security:
        "전반적으로 안전하나 야간 오토바이 날치기·소매치기 사례가 있습니다.",
      scam: "환전·택시 요금 바가지, 가짜 여행사 사기에 주의하세요.",
      law: "마약류에 대한 처벌이 매우 엄격하며 사형까지 가능합니다.",
      transport:
        "오토바이 교통량이 많아 도로 횡단·이동 시 각별한 주의가 필요합니다.",
      disasterClimate: "우기(5~10월) 태풍·홍수에 대비해야 합니다.",
      health: "길거리 음식 위생에 유의하고 식수는 생수를 이용하세요.",
      cultureDressCode: "사원·성지 방문 시 노출이 적은 복장을 갖추세요.",
      emergencyContacts:
        "경찰 113 · 응급 115 · 주베트남 대한민국대사관 +84-24-3831-5110",
    },
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-france",
    country: "프랑스",
    alertLevel: 0,
    scopeType: "region",
    scopeText: "파리 및 근교(일드프랑스) 지역은 소매치기 위험도가 높음",
    categories: {
      security: "관광 명소·대중교통에서 소매치기·집단 절도 사례가 빈번합니다.",
      scam: "탄원서 서명·팔찌 강매 등 관광객 대상 소액 사기에 주의하세요.",
      law: "공공장소 음주·소란 행위에 대한 단속이 엄격합니다.",
      transport: "지하철 소매치기가 잦으니 소지품을 앞으로 메고 이동하세요.",
      disasterClimate: "일반적으로 안정적인 기후이나 여름철 폭염에 대비하세요.",
      health: "의료 수준이 높으며 여행자보험 가입을 권장합니다.",
      cultureDressCode:
        "종교시설 방문 시 어깨·무릎을 가리는 복장이 필요합니다.",
      emergencyContacts:
        "경찰 17 · 응급 112 · 주프랑스 대한민국대사관 +33-1-4753-6996",
    },
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-italy",
    country: "이탈리아",
    alertLevel: 0,
    scopeType: "region",
    scopeText: "로마·밀라노 등 대도시 관광지는 소매치기 위험도가 높음",
    categories: {
      security: "관광 명소·기차역 주변 소매치기·집단 소매치기단에 유의하세요.",
      scam: "택시 바가지 요금, 위조 명품 판매 사기에 주의하세요.",
      law: "문화재 훼손(낙서·물건 반출)에 대한 벌금이 매우 높습니다.",
      transport: "기차 파업이 종종 발생하니 사전에 운행 정보를 확인하세요.",
      disasterClimate: "지진 발생 가능 지역이 있으니 현지 안내를 확인하세요.",
      health: "의료 수준이 높으며 여행자보험 가입을 권장합니다.",
      cultureDressCode: "성당 방문 시 어깨·무릎을 가리는 복장이 필요합니다.",
      emergencyContacts:
        "경찰 113 · 응급 112 · 주이탈리아 대한민국대사관 +39-06-802-461",
    },
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-spain",
    country: "스페인",
    alertLevel: 0,
    scopeType: "region",
    scopeText: "바르셀로나·마드리드 등 대도시는 소매치기 위험도가 높음",
    categories: {
      security: "람블라거리 등 인파가 몰리는 관광지에서 소매치기가 빈번합니다.",
      scam: "가짜 경찰 사칭 사기, 팔찌 강매 사기에 주의하세요.",
      law: "투우·플라멩고 등 공연 관람 시 촬영 제한 규정을 확인하세요.",
      transport: "지하철·버스는 안전하나 혼잡 시간대 소지품 관리가 필요합니다.",
      disasterClimate: "여름철 폭염이 심하니 야외활동 시간을 조절하세요.",
      health: "의료 수준이 높으며 여행자보험 가입을 권장합니다.",
      cultureDressCode: "성당 방문 시 어깨·무릎을 가리는 복장이 필요합니다.",
      emergencyContacts:
        "경찰 091 · 응급 112 · 주스페인 대한민국대사관 +34-91-353-2000",
    },
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-uk",
    country: "영국",
    alertLevel: 0,
    scopeType: "country",
    scopeText: "전역",
    categories: {
      security: "전반적으로 안전하나 대도시 번화가 야간 소매치기에 유의하세요.",
      scam: "가짜 자선단체 모금, 노점 사기에 주의하세요.",
      law: "공공장소 음주 제한 구역이 있으니 표지판을 확인하세요.",
      transport: "차량이 좌측 통행이므로 도로 횡단 시 방향에 주의하세요.",
      disasterClimate: "기후가 변덕스러워 우산·방한 대비가 필요합니다.",
      health: "의료 수준이 높으며 여행자보험 가입을 권장합니다.",
      cultureDressCode:
        "특별한 복장 제한은 없으나 왕실 관련 시설은 격식을 갖추세요.",
      emergencyContacts:
        "경찰/응급 999 또는 112 · 주영국 대한민국대사관 +44-20-7227-5500",
    },
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-usa",
    country: "미국",
    alertLevel: 0,
    scopeType: "region",
    scopeText: "대도시 일부 우범 지역은 야간 이동 자제 권장",
    categories: {
      security:
        "대도시 일부 지역은 야간 치안이 취약하니 이동 경로를 사전에 확인하세요.",
      scam: "렌터카·주차장 소지품 절도, 전화 금융사기에 주의하세요.",
      law: "주(state)별로 법규가 상이하며 총기 관련 규정도 다릅니다.",
      transport: "대중교통보다 렌터카 의존도가 높은 도시가 많습니다.",
      disasterClimate:
        "지역에 따라 허리케인·산불·폭설 위험이 있으니 기상특보를 확인하세요.",
      health: "의료비가 매우 높으니 여행자보험 가입이 필수적입니다.",
      cultureDressCode:
        "특별한 복장 제한은 없으나 종교시설 방문 시 예의를 갖추세요.",
      emergencyContacts:
        "경찰/응급 911 · 주미국 대한민국대사관 +1-202-939-5600",
    },
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-australia",
    country: "호주",
    alertLevel: 0,
    scopeType: "country",
    scopeText: "전역",
    categories: {
      security:
        "전반적으로 치안이 우수하나 번화가 야간 음주 소란에 유의하세요.",
      scam: "렌터카 보험 미가입 관련 바가지 청구 사기에 주의하세요.",
      law: "야생동물 포획·반출이 엄격히 금지되어 있습니다.",
      transport: "장거리 이동이 많으니 운전 시 충분한 휴식을 취하세요.",
      disasterClimate: "여름철 산불·폭염, 북부 우기철 사이클론에 대비하세요.",
      health: "해파리·상어 등 해양 위험 요소가 있으니 안내 깃발을 확인하세요.",
      cultureDressCode: "특별한 복장 제한은 없습니다.",
      emergencyContacts:
        "경찰/응급 000 · 주호주 대한민국대사관 +61-2-6270-4100",
    },
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-newzealand",
    country: "뉴질랜드",
    alertLevel: 0,
    scopeType: "country",
    scopeText: "전역",
    categories: {
      security: "치안이 매우 우수하나 차량 내 귀중품 도난 사례가 있습니다.",
      scam: "렌터카 반납 시 손상 관련 과다 청구 사례에 주의하세요.",
      law: "생물 보안 규정이 엄격해 입국 시 음식물 반입에 주의해야 합니다.",
      transport: "산악 도로가 많아 야간 운전은 특히 주의가 필요합니다.",
      disasterClimate: "지진·화산 활동 지역이 있으니 대피 안내를 확인하세요.",
      health: "액티비티(번지점프 등) 참여 시 보험 보장 범위를 확인하세요.",
      cultureDressCode: "특별한 복장 제한은 없습니다.",
      emergencyContacts:
        "경찰/응급 111 · 주뉴질랜드 대한민국대사관 +64-4-473-9073",
    },
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-switzerland",
    country: "스위스",
    alertLevel: 0,
    scopeType: "country",
    scopeText: "전역",
    categories: {
      security: "치안이 매우 우수한 국가 중 하나입니다.",
      scam: "관광지 물가가 높은 것을 이용한 바가지보다는 일반 사기 사례가 드뭅니다.",
      law: "대중교통 무임승차 적발 시 높은 벌금이 부과됩니다.",
      transport:
        "산악열차·케이블카 이용 시 기상 상황에 따른 운행 중단에 대비하세요.",
      disasterClimate:
        "산악지역 눈사태·낙석 위험이 있으니 등산로 통제 안내를 확인하세요.",
      health: "의료 수준이 매우 높으나 비용이 높으니 여행자보험이 필요합니다.",
      cultureDressCode: "특별한 복장 제한은 없습니다.",
      emergencyContacts:
        "경찰 117 · 응급 144 · 주스위스 대한민국대사관 +41-31-356-2444",
    },
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-germany",
    country: "독일",
    alertLevel: 0,
    scopeType: "country",
    scopeText: "전역",
    categories: {
      security:
        "전반적으로 치안이 우수하나 대도시 축제 기간 소매치기에 유의하세요.",
      scam: "가짜 티켓 판매, 노점 기부금 사기에 주의하세요.",
      law: "나치 관련 상징물 전시·경례는 형사 처벌 대상입니다.",
      transport:
        "아우토반은 구간에 따라 속도 제한이 없으니 운전 시 주의가 필요합니다.",
      disasterClimate: "겨울철 폭설·결빙 도로에 대비하세요.",
      health: "의료 수준이 높으며 여행자보험 가입을 권장합니다.",
      cultureDressCode: "특별한 복장 제한은 없습니다.",
      emergencyContacts:
        "경찰 110 · 응급 112 · 주독일 대한민국대사관 +49-30-260-650",
    },
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-greece",
    country: "그리스",
    alertLevel: 0,
    scopeType: "country",
    scopeText: "전역",
    categories: {
      security: "전반적으로 안전하나 아테네 일부 지역 소매치기에 유의하세요.",
      scam: "택시 미터기 미사용 바가지 요금에 주의하세요.",
      law: "고대 유적지 훼손·무단 반출은 중대 범죄로 처벌됩니다.",
      transport: "여름철 페리 결항이 잦으니 일정에 여유를 두세요.",
      disasterClimate: "여름철 산불·폭염, 지진 발생 가능 지역이 있습니다.",
      health: "의료 수준이 양호하며 여행자보험 가입을 권장합니다.",
      cultureDressCode:
        "수도원·성당 방문 시 어깨·무릎을 가리는 복장이 필요합니다.",
      emergencyContacts:
        "경찰 100 · 응급 166 · 주그리스 대한민국대사관 +30-210-698-4080",
    },
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-portugal",
    country: "포르투갈",
    alertLevel: 0,
    scopeType: "country",
    scopeText: "전역",
    categories: {
      security: "치안이 우수한 편이나 관광지 소매치기에 유의하세요.",
      scam: "관광 명소 인근 택시 바가지 요금에 주의하세요.",
      law: "대중교통 무임승차 적발 시 벌금이 부과됩니다.",
      transport: "트램·언덕길 도로가 많아 야간 도보 이동 시 주의가 필요합니다.",
      disasterClimate: "여름철 산불 위험이 있는 지역이 있습니다.",
      health: "의료 수준이 양호하며 여행자보험 가입을 권장합니다.",
      cultureDressCode: "성당 방문 시 어깨·무릎을 가리는 복장이 필요합니다.",
      emergencyContacts:
        "경찰/응급 112 · 주포르투갈 대한민국대사관 +351-21-793-7515",
    },
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
  {
    id: "safety-czechrepublic",
    country: "체코",
    alertLevel: 0,
    scopeType: "country",
    scopeText: "전역",
    categories: {
      security:
        "전반적으로 안전하나 프라하 구시가지 소매치기·바가지 식당에 유의하세요.",
      scam: "환전소 불리한 환율, 레스토랑 계산서 조작 사기에 주의하세요.",
      law: "대중교통·박물관 무임입장 적발 시 벌금이 부과됩니다.",
      transport:
        "트램·지하철이 안전하고 편리하나 표를 반드시 검표기에 태그해야 합니다.",
      disasterClimate: "겨울철 결빙 도로·적설에 대비하세요.",
      health: "의료 수준이 양호하며 여행자보험 가입을 권장합니다.",
      cultureDressCode: "특별한 복장 제한은 없습니다.",
      emergencyContacts:
        "경찰 158 · 응급 112 · 주체코 대한민국대사관 +420-234-090-411",
    },
    sourceName: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    lastCheckedAt: LAST_CHECKED,
    editor: EDITOR,
  },
];
