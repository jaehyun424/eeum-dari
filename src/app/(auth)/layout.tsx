import Link from 'next/link';
import { FileCheck, ShieldCheck, UserCheck } from 'lucide-react';

const values = [
  {
    icon: FileCheck,
    title: '표준계약',
    desc: '법적 효력을 갖춘 전자계약으로 양측의 권리를 보호합니다.',
  },
  {
    icon: ShieldCheck,
    title: '안심결제',
    desc: '에스크로 결제로 간병 완료 후 정산. 선불 위험이 없습니다.',
  },
  {
    icon: UserCheck,
    title: '검증된 간병인',
    desc: '경력·자격·평판을 확인한 간병인만 매칭됩니다.',
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between bg-brand-600 px-12 py-10">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white">
          이음다리
        </Link>

        {/* Intro */}
        <div>
          <h2 className="text-3xl font-bold leading-snug text-white">
            간병의 시작과 끝을
            <br />
            안심하고 맡기세요.
          </h2>
          <p className="mt-4 text-lg text-brand-200 leading-relaxed">
            검증된 간병인, 투명한 요금, 체계적인 관리.
            <br />
            이음다리가 환자와 간병인을 안전하게 이어드립니다.
          </p>

          {/* Values */}
          <div className="mt-10 space-y-5">
            {values.map((v) => (
              <div key={v.title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <v.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">{v.title}</p>
                  <p className="mt-0.5 text-sm text-brand-200">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-sm text-brand-300">
          이음다리와 함께 3분이면 간병이 시작됩니다.
        </p>
      </div>

      {/* Right panel — form area */}
      <div className="flex w-full flex-col lg:w-1/2">
        {/* Mobile logo */}
        <div className="px-6 pt-6 lg:hidden">
          <Link href="/" className="text-xl font-bold text-brand-600">
            이음다리
          </Link>
        </div>

        {/* Form */}
        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
