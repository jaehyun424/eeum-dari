export interface CareItem {
  id: string;
  label: string;
  category: string;
  description: string;
}

export const careCategories = [
  '기본 돌봄',
  '이동 보조',
  '정서적 지지',
  '의료 보조',
] as const;

export const careItems: CareItem[] = [
  // 기본 돌봄
  { id: 'basic_meal', label: '식사보조', category: '기본 돌봄', description: '식사 준비 및 섭취를 도와줍니다' },
  { id: 'basic_toilet', label: '화장실보조', category: '기본 돌봄', description: '화장실 이용을 도와줍니다' },
  { id: 'basic_diaper', label: '기저귀교체', category: '기본 돌봄', description: '기저귀를 교체합니다' },
  { id: 'basic_hygiene', label: '세면/구강관리', category: '기본 돌봄', description: '세면, 구강관리 등을 도와줍니다' },
  { id: 'basic_position', label: '체위변경', category: '기본 돌봄', description: '정기적인 체위 변경을 수행합니다' },
  { id: 'basic_medicine', label: '복약확인', category: '기본 돌봄', description: '처방된 약 복용을 확인합니다' },

  // 이동 보조
  { id: 'move_walk', label: '보행보조', category: '이동 보조', description: '보행 시 부축합니다' },
  { id: 'move_wheelchair', label: '휠체어이동', category: '이동 보조', description: '휠체어 이동을 도와줍니다' },
  { id: 'move_transfer', label: '이승보조(침대↔휠체어)', category: '이동 보조', description: '침대-휠체어 간 이동을 보조합니다' },

  // 정서적 지지
  { id: 'emotional_companion', label: '말벗/정서적지지', category: '정서적 지지', description: '대화 상대 및 정서적 지지를 제공합니다' },
  { id: 'emotional_walk', label: '산책동행', category: '정서적 지지', description: '산책에 동행합니다' },

  // 의료 보조 (의료행위 경계 주의)
  { id: 'med_suction', label: '석션보조', category: '의료 보조', description: '석션 기기 사용을 보조합니다 — 의료행위 경계' },
  { id: 'med_tube_feeding', label: '관급식보조', category: '의료 보조', description: '관급식 과정을 보조합니다 — 의료행위 경계' },
];
