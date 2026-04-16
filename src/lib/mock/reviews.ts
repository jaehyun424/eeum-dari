import type { CaregiverReview } from '@/lib/types/database';

export const mockReviews: CaregiverReview[] = [
  // cg-001 (김영미) - 6 reviews
  {
    id: 'rv-001',
    caregiver_id: 'cg-001',
    guardian_name: '김**',
    rating: 5,
    comment:
      '어머니 뇌졸중으로 석 달 입원하셨는데 김영미 선생님이 계셔서 정말 든든했습니다. 욕창 한 번 없이 퇴원하셨어요. 기록도 매일 꼼꼼히 보내주셔서 멀리 사는 저희도 안심됐습니다.',
    date: '2026-02-14',
  },
  {
    id: 'rv-002',
    caregiver_id: 'cg-001',
    guardian_name: '이**',
    rating: 5,
    comment:
      '아버지 2주 간병 맡아주셨습니다. 체위변경을 2시간마다 정확히 해주시고, 저녁에 상태 변화 있을 때 바로 간호사실 호출해주셔서 큰일 없이 지나갔어요.',
    date: '2026-01-28',
  },
  {
    id: 'rv-003',
    caregiver_id: 'cg-001',
    guardian_name: '박**',
    rating: 5,
    comment: '정말 성실하신 분입니다. 말수는 많지 않지만 환자에게 항상 따뜻하게 대해주세요.',
    date: '2025-12-19',
  },
  {
    id: 'rv-004',
    caregiver_id: 'cg-001',
    guardian_name: '최**',
    rating: 4,
    comment:
      '간병은 아주 잘해주시는데, 초반에 저희 어머님 성격을 파악하시는 데 며칠 걸렸어요. 그 이후로는 문제 없었습니다.',
    date: '2025-11-05',
  },
  {
    id: 'rv-005',
    caregiver_id: 'cg-001',
    guardian_name: '정**',
    rating: 5,
    comment: '아버지 장기 간병 부탁드렸는데 퇴원 날까지 한결같이 잘 봐주셨습니다. 감사드립니다.',
    date: '2025-10-12',
  },
  {
    id: 'rv-006',
    caregiver_id: 'cg-001',
    guardian_name: '한**',
    rating: 5,
    comment: '병원 간호사분들도 김선생님이 오시면 환자 케어 걱정을 덜 하신다고 하셨어요. 전문가답습니다.',
    date: '2025-08-22',
  },

  // cg-002 (이정숙) - 5 reviews
  {
    id: 'rv-007',
    caregiver_id: 'cg-002',
    guardian_name: '김**',
    rating: 5,
    comment:
      '아버지 호스피스 병동에서 마지막 한 달을 함께 해주셨습니다. 환자분께도 가족에게도 어떻게 말을 건네야 하는지 아시는 분이에요. 평생 잊지 못할 분입니다.',
    date: '2026-03-02',
  },
  {
    id: 'rv-008',
    caregiver_id: 'cg-002',
    guardian_name: '이**',
    rating: 5,
    comment:
      '삼성서울병원 입원 내내 곁에 계셔주셨어요. 경력이 많으셔서 그런지 돌발 상황에서도 침착하게 대응해주십니다.',
    date: '2026-02-11',
  },
  {
    id: 'rv-009',
    caregiver_id: 'cg-002',
    guardian_name: '조**',
    rating: 5,
    comment: '어머님 의식 없으신데도 매번 상냥하게 말 걸어주시는 모습이 인상적이었습니다.',
    date: '2026-01-17',
  },
  {
    id: 'rv-010',
    caregiver_id: 'cg-002',
    guardian_name: '윤**',
    rating: 5,
    comment: '정말 오래 이 일을 하신 게 느껴졌습니다. 병원 이동할 때도 믿고 맡길 수 있었어요.',
    date: '2025-12-04',
  },
  {
    id: 'rv-011',
    caregiver_id: 'cg-002',
    guardian_name: '장**',
    rating: 5,
    comment: '가격이 조금 있지만 그만한 값을 하십니다. 다른 간병인 분께는 다시 못 맡기겠어요.',
    date: '2025-10-29',
  },

  // cg-003 (박순자) - 4 reviews
  {
    id: 'rv-012',
    caregiver_id: 'cg-003',
    guardian_name: '박**',
    rating: 5,
    comment:
      '어머니 치매 증상이 있으신데도 차분하게 잘 대응해주셔서 정말 감사했습니다. 저희 가족한테도 정이 많으신 분이세요.',
    date: '2026-03-18',
  },
  {
    id: 'rv-013',
    caregiver_id: 'cg-003',
    guardian_name: '최**',
    rating: 5,
    comment: '배회 증상 있으신데 밤에도 잘 돌봐주셔서 잠을 편히 잘 수 있었습니다.',
    date: '2026-02-25',
  },
  {
    id: 'rv-014',
    caregiver_id: 'cg-003',
    guardian_name: '신**',
    rating: 4,
    comment: '연세가 조금 있으셔서 이동 보조는 힘드실 때가 있지만, 말벗과 기본 돌봄은 최고세요.',
    date: '2026-01-09',
  },
  {
    id: 'rv-015',
    caregiver_id: 'cg-003',
    guardian_name: '오**',
    rating: 5,
    comment: '치매 어르신 대응을 이렇게 잘하시는 분은 처음 봤습니다. 환자분도 편안해 하셨어요.',
    date: '2025-11-30',
  },

  // cg-004 (최경희) - 3 reviews
  {
    id: 'rv-016',
    caregiver_id: 'cg-004',
    guardian_name: '이**',
    rating: 5,
    comment: '분당서울대병원에서 어머님 간병 맡겨드렸는데 낙상 예방을 정말 꼼꼼히 해주셨습니다.',
    date: '2026-03-22',
  },
  {
    id: 'rv-017',
    caregiver_id: 'cg-004',
    guardian_name: '강**',
    rating: 5,
    comment: '밝고 쾌활하셔서 환자분 기분도 좋아지시는 것 같아요. 재활 운동도 잘 유도해주셨습니다.',
    date: '2026-02-06',
  },
  {
    id: 'rv-018',
    caregiver_id: 'cg-004',
    guardian_name: '류**',
    rating: 5,
    comment: '치매 초기이신 아버지 맡겼는데 일상 루틴을 잘 지켜주셔서 혼란이 크게 줄었습니다.',
    date: '2026-01-14',
  },

  // cg-005 (정선미) - 3 reviews
  {
    id: 'rv-019',
    caregiver_id: 'cg-005',
    guardian_name: '조**',
    rating: 5,
    comment: '수술 후 보행 재활 정말 잘 도와주셨어요. 젊은 분이라 힘쓰는 일도 수월하게 하십니다.',
    date: '2026-03-10',
  },
  {
    id: 'rv-020',
    caregiver_id: 'cg-005',
    guardian_name: '김**',
    rating: 4,
    comment: '경험이 더 쌓이면 완벽하실 것 같아요. 지금도 충분히 성실하시고 밝은 분입니다.',
    date: '2026-02-02',
  },
  {
    id: 'rv-021',
    caregiver_id: 'cg-005',
    guardian_name: '배**',
    rating: 5,
    comment: '체력이 좋으셔서 재활 보조가 필요한 저희 아버지한테 딱이었습니다.',
    date: '2025-12-20',
  },

  // cg-006 (한미영) - 3 reviews
  {
    id: 'rv-022',
    caregiver_id: 'cg-006',
    guardian_name: '박**',
    rating: 5,
    comment: '세브란스 근처에서 어머님 석 달 장기 간병 부탁드렸습니다. 꾸준하고 성실한 분이세요.',
    date: '2026-03-05',
  },
  {
    id: 'rv-023',
    caregiver_id: 'cg-006',
    guardian_name: '송**',
    rating: 5,
    comment: '욕창 예방과 기저귀 케어 전문가세요. 어머니 피부 한 번 붉어진 적 없었습니다.',
    date: '2026-01-24',
  },
  {
    id: 'rv-024',
    caregiver_id: 'cg-006',
    guardian_name: '전**',
    rating: 4,
    comment: '말씀은 많지 않은데 꼼꼼하시고 믿음직합니다. 재신청했습니다.',
    date: '2025-11-15',
  },

  // cg-007 (윤금자) - 3 reviews
  {
    id: 'rv-025',
    caregiver_id: 'cg-007',
    guardian_name: '안**',
    rating: 5,
    comment: '어머니와 말벗도 잘해주시고 식사 보조도 차분하게 해주셨어요. 어르신이 편안해 하셨습니다.',
    date: '2026-02-28',
  },
  {
    id: 'rv-026',
    caregiver_id: 'cg-007',
    guardian_name: '홍**',
    rating: 4,
    comment: '응답이 조금 늦을 때가 있지만 일 시작하시면 꼼꼼하게 잘해주십니다.',
    date: '2025-12-30',
  },
  {
    id: 'rv-027',
    caregiver_id: 'cg-007',
    guardian_name: '곽**',
    rating: 5,
    comment: '어르신들 성격을 잘 맞춰주세요. 따뜻한 분입니다.',
    date: '2025-10-08',
  },

  // cg-008 (강민지) - 3 reviews
  {
    id: 'rv-028',
    caregiver_id: 'cg-008',
    guardian_name: '한**',
    rating: 5,
    comment: '수술 직후 아버지 바이탈 변화 바로 눈치채고 간호사실에 알려주셔서 큰일 안 났습니다.',
    date: '2026-04-02',
  },
  {
    id: 'rv-029',
    caregiver_id: 'cg-008',
    guardian_name: '이**',
    rating: 5,
    comment: '응답 속도 정말 빠르시고 젊은 분이라 에너지가 넘치세요. 재활에 큰 도움 되었습니다.',
    date: '2026-02-19',
  },
  {
    id: 'rv-030',
    caregiver_id: 'cg-008',
    guardian_name: '유**',
    rating: 4,
    comment: '간호 지식이 있으셔서 안심됐고, 환자분과도 금방 친해지셨어요.',
    date: '2026-01-05',
  },

  // cg-009 (임혜숙) - 2 reviews
  {
    id: 'rv-031',
    caregiver_id: 'cg-009',
    guardian_name: '노**',
    rating: 5,
    comment:
      '감염 격리 병동에 계셔야 하는 어머님이셨는데 임선생님이 정말 큰 도움 되셨습니다. 전문성이 느껴졌어요.',
    date: '2026-03-15',
  },
  {
    id: 'rv-032',
    caregiver_id: 'cg-009',
    guardian_name: '서**',
    rating: 5,
    comment: '치매 증상 있는 어머님 4주간 차분하게 잘 돌봐주셨습니다. 매일 상태 기록 공유 감사드립니다.',
    date: '2026-01-31',
  },

  // cg-010 (조현우) - 3 reviews
  {
    id: 'rv-033',
    caregiver_id: 'cg-010',
    guardian_name: '문**',
    rating: 5,
    comment:
      '남자 간병인이 꼭 필요해서 찾았는데 정말 잘 만났습니다. 아버지 이동 보조와 체위변경이 한결 수월해졌습니다.',
    date: '2026-03-28',
  },
  {
    id: 'rv-034',
    caregiver_id: 'cg-010',
    guardian_name: '구**',
    rating: 5,
    comment: '체력적으로 힘든 간병이었는데 14년 경력이 빛을 발하는 분이세요. 환자분도 든든해 하셨습니다.',
    date: '2026-02-08',
  },
  {
    id: 'rv-035',
    caregiver_id: 'cg-010',
    guardian_name: '임**',
    rating: 5,
    comment:
      '치매 증상 있으신 아버님이 다른 간병인분께는 거부 반응 보이셨는데 조선생님께는 금방 마음을 여셨어요.',
    date: '2025-12-11',
  },
];

export function getReviewsForCaregiver(
  caregiverId: string,
  limit = 3,
): CaregiverReview[] {
  return mockReviews
    .filter((r) => r.caregiver_id === caregiverId)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}
