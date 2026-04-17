import type { Metadata } from 'next';
import { LegalLayout } from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: '민감정보 수집·이용 동의',
  description: '환자 건강정보 등 민감정보의 처리 안내',
};

export default function SensitiveInfoPage() {
  return (
    <LegalLayout
      title="민감정보 수집·이용 동의"
      updatedAt="2026-04-17"
      description="개인정보보호법 제23조에 따라 민감정보 처리에 대해 별도 동의를 받습니다. 동의 여부는 간병 신청 시 선택하실 수 있습니다."
    >
      <Section title="1. 수집 항목">
        환자의 건강 상태, 진단명, 거동 수준, 위험 요인(낙상·치매·감염·욕창 등)과 같은
        건강 관련 정보.
      </Section>
      <Section title="2. 수집 목적">
        환자 상태에 적합한 간병인 매칭과 안전한 간병 서비스 제공. 해당 정보는 매칭
        알고리즘과 매칭된 간병인에게 필요 최소 범위로 제공됩니다.
      </Section>
      <Section title="3. 보유 기간">
        서비스 종료 후 3년 (의료법 시행규칙 준용). 기간 경과 후 지체없이 파기됩니다.
      </Section>
      <Section title="4. 동의 거부 권리 및 거부 시 불이익">
        이용자는 동의를 거부할 수 있습니다. 단, 건강 정보 없이는 간병인 매칭 품질이
        크게 떨어져 간병 신청 서비스 이용이 제한될 수 있습니다.
      </Section>
      <Section title="5. 문의">
        <a className="text-brand-600 underline" href="mailto:privacy@eeumdari.kr">
          privacy@eeumdari.kr
        </a>
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
