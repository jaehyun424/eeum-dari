import type { Metadata } from 'next';
import { LegalLayout } from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: '이용약관',
  description: '이음다리 이용약관 (베타)',
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="이용약관"
      updatedAt="2026-04-17"
      description="본 약관은 이음다리(이하 '서비스')의 베타 버전 이용에 적용됩니다."
    >
      <Section title="제1조 (목적)">
        이 약관은 이용자가 서비스를 이용함에 있어 필요한 권리·의무·책임 사항과 기타
        필요한 사항을 규정함을 목적으로 합니다.
      </Section>

      <Section title="제2조 (서비스의 성격)">
        서비스는 병원 입원 환자와 간병인을 연결하는 <strong>매칭 중개 플랫폼</strong>
        입니다. 간병 서비스 자체는 간병인이 직접 제공하며, 이음다리는 매칭·결제·계약
        관리 기능을 지원합니다. 현재 베타 단계로 일부 기능은 제한되어 있거나 준비 중
        일 수 있습니다.
      </Section>

      <Section title="제3조 (이용자의 의무)">
        <ul className="list-disc pl-5 space-y-1">
          <li>타인의 정보를 도용하거나 허위 정보를 입력하지 않을 것</li>
          <li>환자/보호자의 의료·개인정보를 목적 외 용도로 사용하지 않을 것</li>
          <li>간병 서비스 제공 과정에서 관계 법령과 병원 규칙을 준수할 것</li>
          <li>서비스의 정상적 운영을 방해하는 행위를 하지 않을 것</li>
        </ul>
      </Section>

      <Section title="제4조 (베타 단계 제한)">
        베타 기간 중에는 결제, 계약 체결, 배상책임보험 연동 등 일부 상용 기능이
        비활성 또는 시뮬레이션 상태로 제공될 수 있습니다. 실제 금전 거래가 발생하지
        않으며, 표시되는 일부 프로필 및 후기는 예시 데이터입니다.
      </Section>

      <Section title="제5조 (서비스 변경·중단)">
        운영상 필요에 따라 서비스의 전부 또는 일부를 변경하거나 일시 중단할 수 있으며,
        사전 공지합니다. 베타 단계에서는 무중단 서비스(SLA)를 보장하지 않습니다.
      </Section>

      <Section title="제6조 (책임의 제한)">
        이음다리는 정식 출시 전까지는 간병 계약 당사자 사이의 분쟁에 대해 법적 책임을
        부담하지 않습니다. 안전을 위해 간병 시작 전 병원 측 규정과 환자 상태를 반드시
        재확인해주세요.
      </Section>

      <Section title="제7조 (문의)">
        본 약관에 대한 문의는{' '}
        <a className="text-brand-600 underline" href="mailto:support@eeumdari.kr">
          support@eeumdari.kr
        </a>
        로 연락주세요.
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
