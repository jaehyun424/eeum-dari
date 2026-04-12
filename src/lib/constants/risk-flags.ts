export interface RiskFlag {
  id: string;
  label: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export const riskFlags: RiskFlag[] = [
  { id: 'risk_fall', label: '낙상 위험', severity: 'high', description: '낙상 위험이 높은 환자입니다' },
  { id: 'risk_dementia', label: '치매', severity: 'high', description: '치매 증상이 있는 환자입니다' },
  { id: 'risk_infection', label: '감염 주의', severity: 'high', description: '감염 관리가 필요한 환자입니다' },
  { id: 'risk_heavy', label: '중량 환자', severity: 'medium', description: '체중이 무거워 이동 시 주의가 필요합니다' },
  { id: 'risk_aggressive', label: '공격 성향', severity: 'high', description: '공격적 행동을 보일 수 있습니다' },
  { id: 'risk_wandering', label: '배회', severity: 'medium', description: '배회 성향이 있는 환자입니다' },
  { id: 'risk_bedsore', label: '욕창 위험', severity: 'medium', description: '욕창 예방 관리가 필요합니다' },
  { id: 'risk_diet', label: '특수 식이', severity: 'low', description: '특별한 식이 요법이 필요합니다' },
];
