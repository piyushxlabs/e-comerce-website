'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';

interface OrderSuccessProps {
  onClose: () => void;
}

// Lightweight CSS confetti particle
function ConfettiParticle({ index }: { index: number }) {
  const colors = ['#1A1A1A', '#E5E1DA', '#C9C4B8', '#8B7A5E', '#A39274'];
  const color = colors[index % colors.length];
  const left = `${(index * 7.3) % 100}%`;
  const delay = `${(index * 0.12) % 1.5}s`;
  const duration = `${1.5 + (index * 0.1) % 1}s`;
  const size = 6 + (index % 5) * 2;

  return (
    <div
      className="absolute top-0 pointer-events-none"
      style={{
        left,
        width: size,
        height: size,
        background: color,
        borderRadius: index % 3 === 0 ? '50%' : '0px',
        animation: `confetti-fall ${duration} ${delay} ease-in forwards`,
      }}
    />
  );
}

export default function OrderSuccess({ onClose }: OrderSuccessProps) {
  const [showContent, setShowContent] = useState(false);
  const [orderNumber] = useState(
    () => `NST-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  );

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const confettiCount = 30;

  return (
    <div className="relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center py-8 px-4 text-center bg-[#FBF9F6]">
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: confettiCount }, (_, i) => (
          <ConfettiParticle key={i} index={i} />
        ))}
      </div>

      {/* Animated checkmark */}
      <div
        className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center mb-8 bg-[#1A1A1A] transition-all duration-500 ${
          showContent
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-50'
        }`}
        style={{
          boxShadow: '0 8px 24px rgba(26,26,26,0.15)',
        }}
      >
        <svg
          className="w-10 h-10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M20 6L9 17l-5-5"
            className={showContent ? 'animate-draw-check' : ''}
          />
        </svg>
      </div>

      {/* Success text */}
      <div
        className={`relative z-10 space-y-4 transition-all duration-500 delay-300 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-2xl font-light text-[#1A1A1A] tracking-tight">Order Confirmed</h2>
        </div>

        <p className="text-[#666666] text-xs font-light max-w-sm leading-relaxed">
          Your selection is being prepared with standard precision. A confirmation receipt has been dispatched to your email.
        </p>

        <div className="border border-[#E5E1DA] bg-white rounded-none px-6 py-4 inline-block mt-2">
          <p className="text-[9px] text-[#999999] uppercase tracking-wider mb-1">Receipt Number</p>
          <p className="text-sm font-mono tracking-widest text-[#1A1A1A] font-semibold">{orderNumber}</p>
        </div>

        <div className="flex items-center justify-center gap-6 pt-4 text-xs text-[#666666] font-light">
          <div className="flex items-center gap-1.5">
            <Package size={12} className="text-[#999999]" />
            <span>Ships within 24h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-emerald-700" />
            <span>Complimentary Returns</span>
          </div>
        </div>

        <button
          id="order-success-close"
          onClick={onClose}
          className="bg-[#1A1A1A] text-white hover:bg-[#333333] transition-colors mt-6 px-8 py-3.5 rounded-none text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-2 mx-auto"
        >
          Return to Catalog
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
