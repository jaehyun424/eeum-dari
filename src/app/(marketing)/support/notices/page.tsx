import type { Metadata } from 'next';
import { LegalLayout } from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: '공지사항',
  description: '이음다리 공지사항',
};

const NOTICES: { date: string; title: string; body: string }[] = [
  {
    date: '2026-04-17',
    title: '이음다리 비공개 베타 오픈',
    body: '핵심 매칭·신청·계약 관리 화면이 공개되었습니다. 결제와 보험 연동은 순차적으로 도입됩니다.',
  },
  {
    date: '2026-04-10',
    title: '간병인 프로필 검증 프로세스 안내',
    body: '베타 기간 중에는 운영팀이 자격·경력 정보를 수동 검증합니다. 검증 완료까지 1~3영업일 소요될 수 있습니다.',
  },
];

export default function NoticesPage() {
  return (
    <LegalLayout
      title="공지사항"
      updatedAt="2026-04-17"
      description="서비스의 주요 업데이트와 운영 변경 사항을 안내드립니다."
    >
      <ul className="divide-y divide-border">
        {NOTICES.map((n) => (
          <li key={n.title} className="py-5 first:pt-0 last:pb-0">
            <p className="text-xs text-muted">{n.date}</p>
            <h3 className="mt-1 text-lg font-semibold text-foreground">{n.title}</h3>
            <p className="mt-2 text-base text-foreground/90 leading-relaxed">{n.body}</p>
          </li>
        ))}
      </ul>
    </LegalLayout>
  );
}
