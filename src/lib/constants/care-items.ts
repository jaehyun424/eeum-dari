export interface CareItem {
  id: string;
  label: string;
  category: string;
  description: string;
}

export const careCategories = [
  '기본 돌봄',
  '의료 보조',
  '이동 보조',
  '일상생활 지원',
] as const;

export const careItems: CareItem[] = [
  // 기본 돌봄
  { id: 'basic_watch', label: '상태 관찰', category: '기본 돌봄', description: '환자 상태를 주기적으로 관찰합니다' },
  { id: 'basic_meal', label: '식사 보조', category: '기본 돌봄', description: '식사 준비 및 섭취를 도와줍니다' },
  { id: 'basic_hygiene', label: '위생 관리', category: '기본 돌봄', description: '세면, 구강관리 등을 도와줍니다' },
  { id: 'basic_position', label: '체위 변경', category: '기본 돌봄', description: '정기적인 체위 변경을 수행합니다' },

  // 의료 보조
  { id: 'med_suction', label: '석션 보조', category: '의료 보조', description: '석션 기기 사용을 보조합니다' },
  { id: 'med_tube', label: '관급식 보조', category: '의료 보조', description: '관급식 과정을 보조합니다' },
  { id: 'med_wound', label: '상처 관리', category: '의료 보조', description: '기본적인 상처 관리를 수행합니다' },

  // 이동 보조
  { id: 'move_walk', label: '보행 보조', category: '이동 보조', description: '보행 시 부축합니다' },
  { id: 'move_wheelchair', label: '휠체어 이동', category: '이동 보조', description: '휠체어 이동을 도와줍니다' },
  { id: 'move_transfer', label: '이승 보조', category: '이동 보조', description: '침대-휠체어 간 이동을 보조합니다' },

  // 일상생활 지원
  { id: 'daily_laundry', label: '세탁', category: '일상생활 지원', description: '세탁물을 관리합니다' },
  { id: 'daily_errand', label: '병원 내 심부름', category: '일상생활 지원', description: '병원 내 필요한 심부름을 수행합니다' },
];
