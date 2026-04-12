export interface Hospital {
  id: string;
  name: string;
  address: string;
  region: string;
}

// 병원 데이터 (추후 DB에서 로드)
export const hospitals: Hospital[] = [
  { id: 'h1', name: '서울대학교병원', address: '서울 종로구 대학로 101', region: '서울' },
  { id: 'h2', name: '삼성서울병원', address: '서울 강남구 일원로 81', region: '서울' },
  { id: 'h3', name: '서울아산병원', address: '서울 송파구 올림픽로43길 88', region: '서울' },
  { id: 'h4', name: '세브란스병원', address: '서울 서대문구 연세로 50-1', region: '서울' },
  { id: 'h5', name: '고려대학교안암병원', address: '서울 성북구 인촌로 73', region: '서울' },
  { id: 'h6', name: '분당서울대학교병원', address: '경기 성남시 분당구 구미로173번길 82', region: '경기' },
  { id: 'h7', name: '단국대학교병원', address: '충남 천안시 동남구 망향로 201', region: '충남' },
  { id: 'h8', name: '보라매병원', address: '서울 동작구 보라매로5길 20', region: '서울' },
  { id: 'h9', name: '중앙대학교병원', address: '서울 동작구 흑석로 102', region: '서울' },
  { id: 'h10', name: '건국대학교병원', address: '서울 광진구 능동로 120-1', region: '서울' },
  { id: 'h11', name: '한양대학교병원', address: '서울 성동구 왕십리로 222-1', region: '서울' },
  { id: 'h12', name: '국립암센터', address: '경기 고양시 일산동구 일산로 323', region: '경기' },
  { id: 'h13', name: '인하대학교병원', address: '인천 중구 인항로 27', region: '인천' },
];
