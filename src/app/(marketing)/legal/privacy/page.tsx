import type { Metadata } from 'next';
import { LegalLayout } from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '이음다리 개인정보처리방침 (베타)',
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="개인정보처리방침"
      updatedAt="2026-04-17"
      description="이음다리는 이용자의 개인정보를 안전하게 보호하기 위해 다음과 같이 처리방침을 공개합니다."
    >
      <Section title="1. 수집 항목">
        <ul className="list-disc pl-5 space-y-1">
          <li>필수: 이메일, 비밀번호(해시), 이름, 연락처, 역할(보호자/간병인)</li>
          <li>간병 신청 시: 환자 이름·나이·성별, 병원, 케어 항목, 위험 요인, 시작·종료일</li>
          <li>간병인 프로필: 경력, 자격증, 활동 지역, 소개</li>
          <li>자동 수집: 접속 로그, 쿠키, 기기·브라우저 정보</li>
        </ul>
      </Section>

      <Section title="2. 수집 목적">
        <ul className="list-disc pl-5 space-y-1">
          <li>회원가입·로그인 및 본인 확인</li>
          <li>간병 매칭 및 추천 알고리즘 실행</li>
          <li>계약 관리, 정산, 고객지원</li>
          <li>서비스 품질 개선·통계 분석 (식별정보 제외)</li>
        </ul>
      </Section>

      <Section title="3. 보유·이용 기간">
        <ul className="list-disc pl-5 space-y-1">
          <li>회원 탈퇴 시 지체없이 파기. 단, 관련 법령에 따라 보관이 필요한 정보는 해당 기간 보관.</li>
          <li>민감정보(건강 상태, 질병 정보): 서비스 종료 후 3년 (의료법 시행규칙 준용)</li>
          <li>접속 로그: 3개월 (통신비밀보호법)</li>
        </ul>
      </Section>

      <Section title="4. 제3자 제공">
        매칭 상대방(간병인↔보호자)에게는 서비스 이행에 필요한 최소 범위만 공유되며,
        그 외에는 법령에 근거한 경우 외에는 제공하지 않습니다. 결제 대행사(향후 Stripe
        등) 연동 시 이용자에게 사전 고지 후 적용합니다.
      </Section>

      <Section title="5. 이용자의 권리">
        이용자는 언제든지 본인의 개인정보에 대해 열람·정정·삭제·처리정지를 요청할 수
        있습니다. 요청은{' '}
        <a className="text-brand-600 underline" href="mailto:privacy@eeumdari.kr">
          privacy@eeumdari.kr
        </a>{' '}
        로 접수해주세요.
      </Section>

      <Section title="6. 안전성 확보 조치">
        <ul className="list-disc pl-5 space-y-1">
          <li>암호화된 접속(HTTPS) + 비밀번호 단방향 해시</li>
          <li>역할 기반 접근 제어 (Row-level security 적용 예정)</li>
          <li>서비스 배포 서버·데이터베이스의 접근 로그 관리</li>
        </ul>
      </Section>

      <Section title="7. 개인정보 보호책임자">
        담당: 이음다리 운영팀 ·{' '}
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
