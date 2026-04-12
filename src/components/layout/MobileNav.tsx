'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  ClipboardList,
  Wallet,
} from 'lucide-react';

interface MobileNavProps {
  role: 'guardian' | 'caregiver';
}

const guardianLinks = [
  { href: '/guardian/dashboard', label: '대시보드', icon: LayoutDashboard },
  { href: '/guardian/request', label: '신청', icon: FileText },
  { href: '/guardian/contracts', label: '계약', icon: Users },
];

const caregiverLinks = [
  { href: '/caregiver/dashboard', label: '대시보드', icon: LayoutDashboard },
  { href: '/caregiver/jobs', label: '일감', icon: Briefcase },
  { href: '/caregiver/worklog', label: '일지', icon: ClipboardList },
  { href: '/caregiver/earnings', label: '정산', icon: Wallet },
];

export function MobileNav({ role }: MobileNavProps) {
  const pathname = usePathname();
  const links = role === 'guardian' ? guardianLinks : caregiverLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background lg:hidden">
      <div className="flex items-center justify-around py-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-brand-600'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
