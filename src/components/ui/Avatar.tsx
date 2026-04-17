import Image from 'next/image';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
  priority?: boolean;
}

// 간병인/보호자 프로필 이미지 공통 렌더러.
// src가 비어있거나 외부 호스트가 막혀 있으면 ui-avatars.com의 이니셜 이미지로
// fallback 한다. next/image + remotePatterns(i.pravatar.cc / ui-avatars.com)가
// next.config.ts에 등록되어 있어야 한다.
export function Avatar({
  src,
  name,
  size = 96,
  className = '',
  priority = false,
}: AvatarProps) {
  const trimmed = (src ?? '').trim();
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1E56A0&color=fff&size=${size}&bold=true`;
  const finalSrc = trimmed.length > 0 ? trimmed : fallback;

  return (
    <Image
      src={finalSrc}
      alt={`${name} 프로필 사진`}
      width={size}
      height={size}
      priority={priority}
      unoptimized
      className={`rounded-xl object-cover bg-warm-gray-100 ${className}`}
    />
  );
}
