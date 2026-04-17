import type { Metadata } from 'next';
import { LegalLayout } from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: '운영정책',
  description: '이음다리 운영정책 — 이용자 행동 기준, 분쟁 처리 원칙',
};

export default function OperationsPage() {
  return (
    <LegalLayout
      title="운영정책"
      updatedAt="2026-04-17"
      description="신뢰할 수 있는 매칭을 위해 이용자와 간병인이 함께 지켜야 할 기준을 안내합니다."
    >
      <Section title="1. 간병 행위의 범위">
        간병인은 식사·위생·체위변경 등 <strong>일상 간호 행위</strong>를 제공합니다.
        주사·흡인·도뇨와 같은 <strong>의료 행위</strong>는 간호사 등 의료인의 영역이며,
        본 서비스에서 요청·제공을 매개하지 않습니다. 의료행위 경계에 걸치는 항목은
        매칭 시 수동 심사를 통해 재검토됩니다.
      </Section>
      <Section title="2. 병원 규칙의 준수">
        각 병원의 간병 규정(보호자 동반, 출입증, 감염관리 등)은 병원 측 규칙이
        우선합니다. 매칭 전에 해당 병원의 규칙을 안내드리며, 준수 여부는 간병인과
        보호자 모두의 책임입니다.
      </Section>
      <Section title="3. 결제·정산 원칙 (준비 중)">
        정식 출시 이후 에스크로 기반 안심결제를 적용할 예정입니다. 베타 기간 동안에는
        실제 금전 거래가 발생하지 않으며, 요금 표시는 예시입니다.
      </Section>
      <Section title="4. 분쟁 처리">
        이용 중 분쟁이 발생한 경우{' '}
        <a className="text-brand-600 underline" href="mailto:support@eeumdari.kr">
          support@eeumdari.kr
        </a>
        로 상세 내용과 근무일지, 관련 기록을 첨부해 신고해주세요. 운영팀이 양측의
        의견을 청취 후 조정안을 제시합니다.
      </Section>
      <Section title="5. 제재 기준">
        허위 정보 등록, 비용 외 별도 요구, 병원 규칙 위반, 환자 학대·방임 의심 행위 등은
        소명 후 이용 제한 또는 계정 정지 대상이 될 수 있습니다.
      </Section>
    </LegalLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="mt-2 text-base text-foreground/90 leading-relaxed">{children}</div>
    </section>
  );
}
