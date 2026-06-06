'use client';

import type { useCheckoutForm } from '@/hooks/useCheckoutForm';
import type { CheckoutFormData } from '@/types/product';
import { cn } from '@/lib/utils';
import { MapPin, Mail, Phone, User } from 'lucide-react';

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
  autoComplete?: string;
  onBlur: (name: keyof CheckoutFormData) => void;
  onChange: (name: keyof CheckoutFormData, value: string) => void;
}

function InputField({
  id, label, type = 'text', placeholder, name, value, error, icon,
  autoComplete, onBlur, onChange,
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
          autoComplete={autoComplete}
          className={cn(
            'w-full bg-white border border-[#E5E1DA] focus:border-[#1A1A1A] outline-none text-xs text-[#1A1A1A] rounded-none py-2.5 transition-colors font-light placeholder-[#999999]',
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

export default function StepShipping({ form }: { form: FormProps }) {
  const { formData, errors, handleChange, handleBlur } = form;

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h3 className="text-base uppercase tracking-wider font-light text-[#1A1A1A] mb-1">Shipping Address</h3>
        <p className="text-xs text-[#666666] font-light">Where should we deliver your selection?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="firstName"
          label="First Name"
          placeholder="Piyush"
          name="firstName"
          value={formData.firstName}
          error={errors.firstName}
          icon={<User size={12} />}
          autoComplete="given-name"
          onBlur={handleBlur}
          onChange={handleChange}
        />
        <InputField
          id="lastName"
          label="Last Name"
          placeholder="Sharma"
          name="lastName"
          value={formData.lastName}
          error={errors.lastName}
          autoComplete="family-name"
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>

      <InputField
        id="email"
        label="Email Address"
        type="email"
        placeholder="piyush@nexus.store"
        name="email"
        value={formData.email}
        error={errors.email}
        icon={<Mail size={12} />}
        autoComplete="email"
        onBlur={handleBlur}
        onChange={handleChange}
      />

      <InputField
        id="phone"
        label="Phone Number"
        type="tel"
        placeholder="(555) 867-5309"
        name="phone"
        value={formData.phone}
        error={errors.phone}
        icon={<Phone size={12} />}
        autoComplete="tel"
        onBlur={handleBlur}
        onChange={handleChange}
      />

      <InputField
        id="address"
        label="Street Address"
        placeholder="123 Innovation Boulevard, Suite 42"
        name="address"
        value={formData.address}
        error={errors.address}
        icon={<MapPin size={12} />}
        autoComplete="street-address"
        onBlur={handleBlur}
        onChange={handleChange}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <InputField
          id="city"
          label="City"
          placeholder="San Francisco"
          name="city"
          value={formData.city}
          error={errors.city}
          autoComplete="address-level2"
          onBlur={handleBlur}
          onChange={handleChange}
        />
        <InputField
          id="state"
          label="State"
          placeholder="CA"
          name="state"
          value={formData.state}
          error={errors.state}
          autoComplete="address-level1"
          onBlur={handleBlur}
          onChange={handleChange}
        />
        <InputField
          id="zipCode"
          label="ZIP Code"
          placeholder="94105"
          name="zipCode"
          value={formData.zipCode}
          error={errors.zipCode}
          autoComplete="postal-code"
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="country" className="text-[10px] font-medium text-[#666666] uppercase tracking-wider">
          Country
        </label>
        <select
          id="country"
          value={formData.country}
          onChange={(e) => handleChange('country', e.target.value)}
          onBlur={() => handleBlur('country')}
          className={cn(
            'w-full bg-white border border-[#E5E1DA] focus:border-[#1A1A1A] outline-none text-xs text-[#1A1A1A] rounded-none px-4 py-2.5 transition-colors font-light appearance-none',
            errors.country && 'border-red-400 focus:border-red-500'
          )}
          aria-invalid={!!errors.country}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%231A1A1A' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 14px center',
          }}
        >
          <option value="" className="bg-white text-[#1A1A1A]">Select country…</option>
          {['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan', 'India', 'Singapore'].map(c => (
            <option key={c} value={c} className="bg-white text-[#1A1A1A]">{c}</option>
          ))}
        </select>
        {errors.country && (
          <p className="text-[10px] text-red-600 uppercase tracking-wider font-medium animate-fade-down" role="alert">{errors.country}</p>
        )}
      </div>
    </div>
  );
}
