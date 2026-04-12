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
];
