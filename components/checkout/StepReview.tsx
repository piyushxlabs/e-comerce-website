'use client';

import type { useCheckoutForm } from '@/hooks/useCheckoutForm';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { MapPin, CreditCard, Package, Tag } from 'lucide-react';

type FormProps = ReturnType<typeof useCheckoutForm>;

export default function StepReview({ form }: { form: FormProps }) {
  const { state, priceBreakdown } = useCart();
  const { formData } = form;

  const maskedCard = formData.cardNumber
    ? `•••• •••• •••• ${formData.cardNumber.replace(/\D/g, '').slice(-4)}`
    : '–';

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h3 className="text-base uppercase tracking-wider font-light text-[#1A1A1A] mb-1">Order Review</h3>
        <p className="text-xs text-[#666666] font-light">Confirm your order details before placing.</p>
      </div>

      {/* ─── Shipping Summary ─────────────────────────────── */}
      <div className="border border-[#E5E1DA] bg-white rounded-none p-5 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={12} className="text-[#999999]" />
          <span className="text-[10px] uppercase tracking-wider font-medium text-[#666666]">
            Shipping To
          </span>
        </div>
        <p className="text-xs font-medium text-[#1A1A1A]">
          {formData.firstName} {formData.lastName}
        </p>
        <div className="text-xs text-[#666666] font-light space-y-0.5">
          <p>{formData.address}</p>
          <p>
            {formData.city}, {formData.state} {formData.zipCode}
          </p>
          <p>{formData.country}</p>
          <p className="text-[#999999] mt-1">{formData.email} · {formData.phone}</p>
        </div>
      </div>

      {/* ─── Payment Summary ─────────────────────────────── */}
      <div className="border border-[#E5E1DA] bg-white rounded-none p-5">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard size={12} className="text-[#999999]" />
          <span className="text-[10px] uppercase tracking-wider font-medium text-[#666666]">
            Payment Method
          </span>
        </div>
        <p className="text-xs text-[#1A1A1A] font-mono tracking-widest">
          {maskedCard}
        </p>
        <p className="text-xs text-[#666666] font-light mt-1">{formData.cardHolder}</p>
      </div>

      {/* ─── Order Items ──────────────────────────────────── */}
      <div className="border border-[#E5E1DA] bg-white rounded-none p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Package size={12} className="text-[#999999]" />
          <span className="text-[10px] uppercase tracking-wider font-medium text-[#666666]">
            {state.items.length} Item{state.items.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
          {state.items.map((item) => (
            <div key={item.product.id} className="flex items-center gap-3">
              <div className="relative w-12 h-12 border border-[#E5E1DA] overflow-hidden bg-[#FBF9F6] flex-shrink-0">
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.imageAlt}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#1A1A1A] line-clamp-1">
                  {item.product.title}
                </p>
                <p className="text-[10px] text-[#999999] uppercase tracking-wider">Qty: {item.quantity}</p>
              </div>
              <p className="text-xs font-light text-[#1A1A1A] flex-shrink-0">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Price Breakdown ──────────────────────────────── */}
      <div className="border border-[#E5E1DA] bg-white rounded-none p-5 space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-light">
            <span className="text-[#666666]">Subtotal</span>
            <span className="text-[#1A1A1A]">{formatPrice(priceBreakdown.subtotal)}</span>
          </div>
          {state.isCouponApplied && (
            <div className="flex justify-between text-xs font-light">
              <span className="text-amber-800 flex items-center gap-1.5 font-medium">
                <Tag size={10} />
                {state.couponCode} −20%
              </span>
              <span className="text-amber-800 font-medium">
                −{formatPrice(priceBreakdown.couponDiscount)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-xs font-light">
            <span className="text-[#666666]">Tax (8.5%)</span>
            <span className="text-[#1A1A1A]">{formatPrice(priceBreakdown.estimatedTax)}</span>
          </div>
          <div className="flex justify-between text-xs font-light">
            <span className="text-[#666666]">Shipping</span>
            <span className="text-amber-800 font-medium">FREE</span>
          </div>
        </div>
        <div className="h-px bg-[#E5E1DA]" />
        <div className="flex justify-between items-center pt-1">
          <span className="text-xs uppercase tracking-wider font-medium text-[#1A1A1A]">Total Due</span>
          <span className="text-sm font-light text-[#1A1A1A]">
            {formatPrice(priceBreakdown.total)}
          </span>
        </div>
      </div>
    </div>
  );
}
