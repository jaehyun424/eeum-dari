import type { Metadata } from 'next';
import { LegalLayout } from '@/components/legal/LegalLayout';
import { Mail, MessageCircle, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: '문의하기',
  description: '이음다리 운영팀 문의 채널',
};

export default function ContactPage() {
  return (
    <LegalLayout
      title="문의하기"
      updatedAt="2026-04-17"
      description="서비스 이용 중 궁금한 점이나 신고하실 내용이 있다면 아래 경로로 연락주세요."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <ContactCard
          icon={<Mail className="h-5 w-5" />}
          title="이메일"
          lines={[
            <a key="mail" href="mailto:support@eeumdari.kr" className="text-brand-600 hover:underline">
              support@eeumdari.kr
            </a>,
            '답변까지 1영업일 이내',
          ]}
        />
        <ContactCard
          icon={<MessageCircle className="h-5 w-5" />}
          title="긴급 문의"
          lines={[
            '간병 중 안전 관련 긴급 상황은 우선 해당 병원 간호사실로 연락하시고,',
            '이후 위 이메일로 사실 관계를 공유해주세요.',
          ]}
        />
        <ContactCard
          icon={<Clock className="h-5 w-5" />}
          title="운영 시간"
          lines={['평일 10:00 ~ 19:00 · 주말/공휴일 휴무', '휴무일 문의는 다음 영업일에 순차 답변드립니다']}
        />
      </div>
      <p className="mt-8 text-sm text-muted">
        베타 단계에서는 채팅·전화 상담은 제공되지 않습니다. 정식 출시 이후 확대 예정입니다.
      </p>
    </LegalLayout>
  );
}

function ContactCard({
  icon,
  title,
  lines,
}: {
  icon: React.ReactNode;
  title: string;
  lines: React.ReactNode[];
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <div className="flex items-center gap-2 text-brand-600">
        {icon}
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </div>
      <div className="mt-3 space-y-1 text-sm text-foreground/90 leading-relaxed">
        {lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}
