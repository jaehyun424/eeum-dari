import type { Metadata } from 'next';
import { LegalLayout } from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: '자주 묻는 질문',
  description: '이음다리 이용 중 궁금한 점을 모았습니다',
};

const FAQS: { q: string; a: string }[] = [
  {
    q: '이음다리는 간병인을 직접 고용하나요?',
    a: '아닙니다. 이음다리는 보호자와 간병인을 연결하는 매칭 플랫폼입니다. 실제 간병은 간병인이 제공하며, 계약 당사자는 이용자 양측입니다.',
  },
  {
    q: '매칭 점수는 어떻게 계산되나요?',
    a: '케어 항목 적합도, 경력, 평점, 거리, 응답 속도, 위험 요인 대응력을 가중 평균하여 0~100점으로 산출합니다. 매칭 결과 페이지에서 세부 근거를 확인할 수 있습니다.',
  },
  {
    q: '베타 기간에는 실제로 결제가 되나요?',
    a: '아닙니다. 에스크로 안심결제와 정식 계약은 출시 이후 도입 예정입니다. 베타 단계의 요금 표시와 결제 화면은 설계 검증용입니다.',
  },
  {
    q: '간병 중 의료 행위를 요청할 수 있나요?',
    a: '간병은 일상 간호에 한정되며 주사·흡인 등 의료 행위는 간호사 등 의료인이 담당합니다. 의료행위 경계 항목이 포함된 신청은 수동 심사 후 배정됩니다.',
  },
  {
    q: '민감정보 동의가 꼭 필요한가요?',
    a: '적합한 간병인을 매칭하기 위해 환자의 건강 상태 정보가 필요합니다. 거부하실 경우 간병 신청 기능이 제한됩니다.',
  },
  {
    q: '간병인으로 등록하려면 어떻게 해야 하나요?',
    a: '회원가입 시 간병인을 선택하고 경력과 자격증을 등록해주세요. 베타 기간 중에는 수동 검증 절차를 거칩니다.',
  },
];

export default function FaqPage() {
  return (
    <LegalLayout
      title="자주 묻는 질문"
      updatedAt="2026-04-17"
      description="많이 받는 질문들을 모았습니다. 찾으시는 내용이 없다면 언제든 문의해주세요."
    >
      <dl className="space-y-6">
        {FAQS.map((f) => (
          <div key={f.q}>
            <dt className="text-lg font-semibold text-foreground">Q. {f.q}</dt>
            <dd className="mt-2 text-base text-foreground/90 leading-relaxed">
              A. {f.a}
            </dd>
          </div>
        ))}
      </dl>
    </LegalLayout>
  );
}
