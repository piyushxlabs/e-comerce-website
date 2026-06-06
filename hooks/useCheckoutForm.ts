import { useState, useCallback } from 'react';
import type { CheckoutFormData, CheckoutFormErrors } from '@/types/product';
import { luhnCheck, isValidExpiry, formatCardNumber, formatExpiry } from '@/lib/utils';

const initialFormData: CheckoutFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  cardNumber: '',
  cardHolder: '',
  expiryDate: '',
  cvv: '',
};

function validateField(
  name: keyof CheckoutFormData,
  value: string
): string | undefined {
  switch (name) {
    case 'firstName':
      if (!value.trim()) return 'First name is required';
      if (value.trim().length < 2) return 'First name must be at least 2 characters';
      return undefined;
    case 'lastName':
      if (!value.trim()) return 'Last name is required';
      if (value.trim().length < 2) return 'Last name must be at least 2 characters';
      return undefined;
    case 'email': {
      if (!value.trim()) return 'Email is required';
      const emailRe = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRe.test(value)) return 'Please enter a valid email address';
      return undefined;
    }
    case 'phone': {
      const digits = value.replace(/\D/g, '');
      if (!digits) return 'Phone number is required';
      if (digits.length < 8) return 'Please enter a valid phone number';
      return undefined;
    }
    case 'address':
      if (!value.trim()) return 'Address is required';
      if (value.trim().length < 3) return 'Please enter a valid street address';
      return undefined;
    case 'city':
      if (!value.trim()) return 'City is required';
      return undefined;
    case 'state':
      if (!value.trim()) return 'State is required';
      return undefined;
    case 'zipCode': {
      const zipRe = /^[0-9a-zA-Z\s-]{3,10}$/;
      if (!value.trim()) return 'ZIP code is required';
      if (!zipRe.test(value.trim())) return 'Please enter a valid ZIP code';
      return undefined;
    }
    case 'country':
      if (!value.trim()) return 'Country is required';
      return undefined;
    case 'cardNumber': {
      const digits = value.replace(/\D/g, '');
      if (!digits) return 'Card number is required';
      if (digits.length < 12) return 'Card number must be at least 12 digits';
      return undefined;
    }
    case 'cardHolder':
      if (!value.trim()) return 'Card holder name is required';
      if (value.trim().length < 3) return 'Card holder name must be at least 3 characters';
      return undefined;
    case 'expiryDate':
      if (!value.trim()) return 'Expiry date is required';
      if (!isValidExpiry(value)) return 'Please enter a valid future expiry (MM/YY)';
      return undefined;
    case 'cvv': {
      const cvvRe = /^\d{3,4}$/;
      if (!value.trim()) return 'CVV is required';
      if (!cvvRe.test(value.trim())) return 'CVV must be 3 or 4 digits';
      return undefined;
    }
    default:
      return undefined;
  }
}

export function useCheckoutForm() {
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutFormData, boolean>>>({});

  const handleChange = useCallback(
    (name: keyof CheckoutFormData, rawValue: string) => {
      let value = rawValue;

      // Live formatting
      if (name === 'cardNumber') value = formatCardNumber(rawValue);
      if (name === 'expiryDate') value = formatExpiry(rawValue);
      if (name === 'cvv') value = rawValue.replace(/\D/g, '').slice(0, 4);

      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear error on change if field was already touched
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [touched]
  );

  const handleBlur = useCallback((name: keyof CheckoutFormData) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, [formData]);

  const validateStep = useCallback(
    (fields: (keyof CheckoutFormData)[]): boolean => {
      const newErrors: CheckoutFormErrors = { ...errors };
      const newTouched: Partial<Record<keyof CheckoutFormData, boolean>> = { ...touched };
      let isValid = true;

      fields.forEach((field) => {
        newTouched[field] = true;
        const error = validateField(field, formData[field]);
        newErrors[field] = error;
        if (error) isValid = false;
      });

      setErrors(newErrors);
      setTouched(newTouched);
      return isValid;
    },
    [formData, errors, touched]
  );

  const autofill = useCallback((step: 'shipping' | 'payment') => {
    if (step === 'shipping') {
      const shippingData = {
        firstName: 'Krishna',
        lastName: 'Chandra',
        email: 'jaguri437@gmail.com',
        phone: '6395536126',
        address: 'Dehradun',
        city: 'Dehradun',
        state: 'Uttarakhand',
        zipCode: '249101',
        country: 'India',
      };
      setFormData((prev) => ({ ...prev, ...shippingData }));
      setErrors((prev) => {
        const next = { ...prev };
        Object.keys(shippingData).forEach((k) => {
          delete next[k as keyof CheckoutFormData];
        });
        return next;
      });
    } else if (step === 'payment') {
      const paymentData = {
        cardNumber: '4111 1111 1111 1111',
        cardHolder: 'KRISHNA CHANDRA',
        expiryDate: '12/29',
        cvv: '123',
      };
      setFormData((prev) => ({ ...prev, ...paymentData }));
      setErrors((prev) => {
        const next = { ...prev };
        Object.keys(paymentData).forEach((k) => {
          delete next[k as keyof CheckoutFormData];
        });
        return next;
      });
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
  }, []);

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateStep,
    resetForm,
    autofill,
  };
}
