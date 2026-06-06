'use client';

import { cn } from '@/lib/utils';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  loading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-sm font-medium tracking-wide transition-all duration-300 select-none disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none';

  const variants: Record<string, string> = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    danger:
      'bg-transparent border border-[#C4553D]/30 text-[#C4553D] hover:bg-[#C4553D]/5 hover:border-[#C4553D]/50',
    subtle:
      'bg-transparent border border-[#E5E1DA] text-[#666666] hover:text-[#1A1A1A] hover:border-[#C9C4BC]',
  };

  const sizes: Record<string, string> = {
    sm: 'text-[11px] px-3.5 py-1.5 tracking-[0.08em] uppercase',
    md: 'text-[13px] px-5 py-2.5 tracking-[0.05em]',
    lg: 'text-[13px] px-7 py-3.5 tracking-[0.08em] uppercase',
  };

  return (
    <button
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-3.5 h-3.5 border-[1.5px] border-current border-t-transparent rounded-full animate-spin" />
          <span>Processing…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
