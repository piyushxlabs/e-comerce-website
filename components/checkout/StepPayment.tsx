'use client';

import type { useCheckoutForm } from '@/hooks/useCheckoutForm';
import type { CheckoutFormData } from '@/types/product';
import { cn } from '@/lib/utils';
import { Lock, CreditCard, Calendar, Shield } from 'lucide-react';

type FormProps = ReturnType<typeof useCheckoutForm>;

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  name: keyof CheckoutFormData;
  value: string;
  error?: string;
  icon?: React.ReactNode;
  maxLength?: number;
  autoComplete?: string;
  onBlur: (name: keyof CheckoutFormData) => void;
  onChange: (name: keyof CheckoutFormData, value: string) => void;
}

function InputField({
  id, label, type = 'text', placeholder, name, value, error, icon,
  maxLength, autoComplete, onBlur, onChange,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[10px] font-medium text-[#666666] uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          onBlur={() => onBlur(name)}
          maxLength={maxLength}
          autoComplete={autoComplete}
          inputMode={name === 'cardNumber' || name === 'cvv' || name === 'expiryDate' ? 'numeric' : undefined}
          className={cn(
            'w-full bg-white border border-[#E5E1DA] focus:border-[#1A1A1A] outline-none text-xs text-[#1A1A1A] rounded-none py-2.5 font-mono tracking-widest placeholder-[#999999] transition-colors',
            icon ? 'pl-9 pr-4' : 'px-4',
            error && 'border-red-400 focus:border-red-500'
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="text-[10px] text-red-600 uppercase tracking-wider font-medium animate-fade-down" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// Detect card type from first digit
function getCardType(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.startsWith('4')) return 'Visa';
  if (/^5[1-5]/.test(digits)) return 'Mastercard';
  if (/^3[47]/.test(digits)) return 'Amex';
  if (digits.startsWith('6')) return 'Discover';
  return 'Card';
}

export default function StepPayment({ form }: { form: FormProps }) {
  const { formData, errors, handleChange, handleBlur } = form;
  const cardType = formData.cardNumber ? getCardType(formData.cardNumber) : null;

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h3 className="text-base uppercase tracking-wider font-light text-[#1A1A1A] mb-1">Payment Details</h3>
        <p className="text-xs text-[#666666] font-light">Your payment information is encrypted and secure.</p>
      </div>

      {/* Security badge */}
      <div className="flex items-center gap-3 border border-[#E5E1DA] bg-[#FBF9F6] px-4 py-3 rounded-none">
        <Lock size={14} className="text-amber-800 flex-shrink-0" />
        <p className="text-xs text-[#666666] font-light">
          256-bit SSL encryption · PCI DSS compliant · Your data is never stored
        </p>
      </div>

      {/* Card number with live type detection */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="cardNumber" className="text-[10px] font-medium text-[#666666] uppercase tracking-wider">
            Card Number
          </label>
          {cardType && (
            <span className="text-[10px] font-medium uppercase tracking-widest text-[#1A1A1A] animate-fade-down">
              {cardType}
            </span>
          )}
        </div>
        <div className="relative">
          <CreditCard size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none" />
          <input
            id="cardNumber"
            type="text"
            placeholder="4111 1111 1111 1111"
            value={formData.cardNumber}
            onChange={(e) => handleChange('cardNumber', e.target.value)}
            onBlur={() => handleBlur('cardNumber')}
            maxLength={19}
            inputMode="numeric"
            autoComplete="cc-number"
            className={cn(
              'w-full bg-white border border-[#E5E1DA] focus:border-[#1A1A1A] outline-none text-xs text-[#1A1A1A] rounded-none py-2.5 pl-9 pr-4 font-mono tracking-[0.2em] placeholder-[#999999] transition-colors',
              errors.cardNumber && 'border-red-400 focus:border-red-500'
            )}
            aria-invalid={!!errors.cardNumber}
          />
        </div>
        {errors.cardNumber && (
          <p className="text-[10px] text-red-600 uppercase tracking-wider font-medium animate-fade-down" role="alert">{errors.cardNumber}</p>
        )}
      </div>

      <InputField
        id="cardHolder"
        label="Card Holder Name"
        placeholder="PIYUSH SHARMA"
        name="cardHolder"
        value={formData.cardHolder}
        error={errors.cardHolder}
        icon={<Shield size={12} />}
        autoComplete="cc-name"
        onBlur={handleBlur}
        onChange={(name, val) => handleChange(name, val.toUpperCase())}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="expiryDate" className="text-[10px] font-medium text-[#666666] uppercase tracking-wider">
            Expiry Date
          </label>
          <div className="relative">
            <Calendar size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none" />
            <input
              id="expiryDate"
              type="text"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={(e) => handleChange('expiryDate', e.target.value)}
              onBlur={() => handleBlur('expiryDate')}
              maxLength={5}
              inputMode="numeric"
              autoComplete="cc-exp"
              className={cn(
                'w-full bg-white border border-[#E5E1DA] focus:border-[#1A1A1A] outline-none text-xs text-[#1A1A1A] rounded-none py-2.5 pl-9 pr-4 font-mono tracking-widest placeholder-[#999999] transition-colors',
                errors.expiryDate && 'border-red-400 focus:border-red-500'
              )}
              aria-invalid={!!errors.expiryDate}
            />
          </div>
          {errors.expiryDate && (
            <p className="text-[10px] text-red-600 uppercase tracking-wider font-medium animate-fade-down" role="alert">{errors.expiryDate}</p>
          )}
        </div>

        <InputField
          id="cvv"
          label="CVV / CVC"
          type="password"
          placeholder="•••"
          name="cvv"
          value={formData.cvv}
          error={errors.cvv}
          maxLength={4}
          autoComplete="cc-csc"
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>

      {/* Accepted cards visual */}
      <div className="flex items-center gap-2 flex-wrap pt-2">
        <span className="text-[10px] uppercase tracking-wider text-[#999999]">Accepted:</span>
        {['Visa', 'Mastercard', 'Amex', 'Discover'].map((card) => (
          <span
            key={card}
            className="text-[9px] uppercase tracking-wider border border-[#E5E1DA] px-2 py-0.5 text-[#666666]"
          >
            {card}
          </span>
        ))}
      </div>
    </div>
  );
}
