import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'limited' | 'success' | 'accent';
  className?: string;
}

export default function Badge({
  children,
  variant = 'default',
  className,
}: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'text-[#999999]',
    limited: 'text-[#8B7355]',
    success: 'text-[#5C8A5C]',
    accent: 'text-[#666666]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
