import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Receipt } from 'lucide-react';

export default function CartSummary() {
  const { priceBreakdown, state } = useCart();

  const rows: { label: string; value: string; accent?: boolean; negative?: boolean }[] = [
    {
      label: 'Subtotal',
      value: formatPrice(priceBreakdown.subtotal),
    },
    ...(state.isCouponApplied
      ? [
          {
            label: `Coupon (${state.couponCode} −20%)`,
            value: `−${formatPrice(priceBreakdown.couponDiscount)}`,
            accent: true,
            negative: true,
          },
        ]
      : []),
    {
      label: 'Estimated Tax (8.5%)',
      value: formatPrice(priceBreakdown.estimatedTax),
    },
  ];

  return (
    <div className="border border-[#E5E1DA] bg-white p-4 space-y-3 rounded-none">
      <div className="flex items-center gap-2 mb-1">
        <Receipt size={12} className="text-[#999999]" />
        <span className="text-[10px] uppercase tracking-widest text-[#999999]">
          Order Summary
        </span>
      </div>

      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between items-center">
            <span
              className={`text-xs ${
                row.accent ? 'text-amber-800 font-medium' : 'text-[#666666] font-light'
              }`}
            >
              {row.label}
            </span>
            <span
              className={`text-xs ${
                row.accent ? 'text-amber-800 font-medium' : 'text-[#1A1A1A] font-light'
              }`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* ─── Divider ─────────────────────────────────────── */}
      <div className="h-px bg-[#E5E1DA]" />

      {/* ─── Total ───────────────────────────────────────── */}
      <div className="flex justify-between items-center">
        <span className="text-sm uppercase tracking-wider font-medium text-[#1A1A1A]">Total</span>
        <span className="text-base font-light text-[#1A1A1A]">
          {formatPrice(priceBreakdown.total)}
        </span>
      </div>

      {state.isCouponApplied && (
        <p className="text-[10px] text-amber-800/80 text-center uppercase tracking-wider animate-fade-up pt-1">
          🎉 Saved {formatPrice(priceBreakdown.couponDiscount)} with coupon
        </p>
      )}
    </div>
  );
}
