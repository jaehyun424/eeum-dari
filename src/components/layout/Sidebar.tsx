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
  UserCircle,
} from 'lucide-react';

interface SidebarProps {
  role: 'guardian' | 'caregiver';
}

const guardianLinks = [
  { href: '/guardian/dashboard', label: '대시보드', icon: LayoutDashboard },
  { href: '/guardian/request', label: '간병 신청', icon: FileText },
  { href: '/guardian/contracts', label: '계약 관리', icon: Users },
];

const caregiverLinks = [
  { href: '/caregiver/dashboard', label: '대시보드', icon: LayoutDashboard },
  { href: '/caregiver/jobs', label: '일감 목록', icon: Briefcase },
  { href: '/caregiver/profile', label: '프로필', icon: UserCircle },
  { href: '/caregiver/worklog', label: '근무일지', icon: ClipboardList },
  { href: '/caregiver/earnings', label: '정산', icon: Wallet },
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const links = role === 'guardian' ? guardianLinks : caregiverLinks;

  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-surface lg:block">
      <nav className="flex flex-col gap-1 p-4">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400'
                  : 'text-muted hover:bg-surface-hover hover:text-foreground'
              }`}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
