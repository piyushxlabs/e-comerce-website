'use client';

import { useState } from 'react';
import { Tag, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export default function CouponInput() {
  const { state, applyCoupon, removeCoupon } = useCart();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const handleApply = () => {
    if (!inputValue.trim()) {
      triggerShake('Please enter a promo code.');
      return;
    }
    const success = applyCoupon(inputValue.trim());
    if (!success) {
      triggerShake('Invalid code. Try "NST2026".');
    } else {
      setError(null);
      setInputValue('');
    }
  };

  const triggerShake = (msg: string) => {
    setError(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleRemove = () => {
    removeCoupon();
    setInputValue('');
    setError(null);
  };

  // Applied state
  if (state.isCouponApplied) {
    return (
      <div className="flex items-center justify-between rounded-none px-4 py-3 bg-amber-500/5 border border-amber-800/20 animate-fade-up">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-amber-800 flex-shrink-0" />
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-amber-900">
              {state.couponCode.toUpperCase()} Applied!
            </p>
            <p className="text-[10px] text-amber-800/80 uppercase tracking-wider">
              20% discount is active
            </p>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="p-1 text-[#999999] hover:text-[#1A1A1A] transition-colors"
          aria-label="Remove coupon"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'flex gap-2',
          isShaking && 'animate-shake'
        )}
      >
        <div className="relative flex-1">
          <Tag
            size={12}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none"
          />
          <input
            id="coupon-input"
            type="text"
            placeholder='PROMO CODE ("NST2026")'
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value.toUpperCase());
              setError(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            className={cn(
              'w-full bg-white border border-[#E5E1DA] focus:border-[#1A1A1A] outline-none text-xs uppercase tracking-wider text-[#1A1A1A] rounded-none pl-9 pr-4 py-2.5 font-mono transition-colors',
              error && 'border-red-400 focus:border-red-500'
            )}
            aria-label="Promo code input"
          />
        </div>
        <button
          onClick={handleApply}
          className="px-4 py-2.5 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors text-xs uppercase tracking-widest font-medium rounded-none flex-shrink-0"
        >
          Apply
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 animate-fade-down">
          <AlertCircle size={12} className="text-red-600 flex-shrink-0" />
          <p className="text-[10px] uppercase tracking-wider text-red-600 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
