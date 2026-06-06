'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Package, CreditCard, ClipboardList } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCheckoutForm } from '@/hooks/useCheckoutForm';
import StepShipping from './StepShipping';
import StepPayment from './StepPayment';
import StepReview from './StepReview';
import OrderSuccess from './OrderSuccess';

interface CheckoutModalProps {
  onClose: () => void;
}

type Step = 'shipping' | 'payment' | 'review' | 'success';

const STEPS: { key: Step; label: string; icon: React.ReactNode }[] = [
  { key: 'shipping', label: 'Shipping', icon: <Package size={12} /> },
  { key: 'payment', label: 'Payment', icon: <CreditCard size={12} /> },
  { key: 'review', label: 'Review', icon: <ClipboardList size={12} /> },
];

const SHIPPING_FIELDS = [
  'firstName', 'lastName', 'email', 'phone',
  'address', 'city', 'state', 'zipCode', 'country',
] as const;

const PAYMENT_FIELDS = [
  'cardNumber', 'cardHolder', 'expiryDate', 'cvv',
] as const;

export default function CheckoutModal({ onClose }: CheckoutModalProps) {
  const { clearCart, closeDrawer } = useCart();
  const form = useCheckoutForm();
  const [currentStep, setCurrentStep] = useState<Step>('shipping');
  const [isVisible, setIsVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 250);
  };

  const handleNext = () => {
    if (currentStep === 'shipping') {
      const valid = form.validateStep([...SHIPPING_FIELDS]);
      if (!valid) return;
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      const valid = form.validateStep([...PAYMENT_FIELDS]);
      if (!valid) return;
      setCurrentStep('review');
    }
  };

  const handleBack = () => {
    if (currentStep === 'payment') setCurrentStep('shipping');
    if (currentStep === 'review') setCurrentStep('payment');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate async payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    clearCart();
    setIsProcessing(false);
    setCurrentStep('success');
  };

  const handleSuccessClose = () => {
    handleClose();
    closeDrawer();
    setTimeout(() => {
      form.resetForm();
    }, 300);
  };

  const stepIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div
      className={`fixed inset-0 z-[120] flex items-center justify-center p-4 transition-opacity duration-250 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      {currentStep !== 'success' && (
        <div
          className="absolute inset-0 bg-[#1A1A1A]/40 backdrop-blur-sm"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}
      {currentStep === 'success' && (
        <div className="absolute inset-0 bg-[#FBF9F6]" aria-hidden="true" />
      )}

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Checkout"
        className={`relative w-full max-w-2xl bg-white border border-[#E5E1DA] overflow-hidden shadow-xl transition-all duration-350 ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
        }`}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Close */}
        {currentStep !== 'success' && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 text-[#1A1A1A] hover:opacity-60 transition-opacity bg-white/80 border border-[#E5E1DA] rounded-none"
            aria-label="Close checkout"
          >
            <X size={16} />
          </button>
        )}

        {/* ─── Step Indicator ──────────────────────────────── */}
        {currentStep !== 'success' && (
          <div className="px-8 pt-8 pb-6 border-b border-[#E5E1DA]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light text-[#1A1A1A] tracking-tight mb-0">Checkout</h2>
              {(currentStep === 'shipping' || currentStep === 'payment') && (
                <button
                  type="button"
                  onClick={() => form.autofill(currentStep)}
                  className="text-[10px] uppercase tracking-wider text-amber-800 hover:text-white hover:bg-[#1A1A1A] hover:border-[#1A1A1A] border border-amber-800/30 px-3.5 py-1.5 bg-[#FBF9F6] transition-all font-medium rounded-none active:scale-95"
                >
                  Auto-fill Dummy
                </button>
              )}
            </div>
            <div className="flex items-center gap-0">
              {STEPS.map((step, idx) => {
                const isDone = idx < stepIndex;
                const isActive = idx === stepIndex;
                return (
                  <div key={step.key} className="flex items-center flex-1 last:flex-none">
                    <div className={`flex items-center gap-2 px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium transition-all duration-300 rounded-none border ${
                      isActive
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                        : isDone
                        ? 'text-amber-900 bg-[#FBF9F6] border-amber-800/20'
                        : 'text-[#999999] bg-[#FBF9F6] border-[#E5E1DA]'
                    }`}>
                      {step.icon}
                      <span>{step.label}</span>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className={`flex-1 h-px mx-2 transition-all duration-300 ${
                        isDone ? 'bg-[#1A1A1A]' : 'bg-[#E5E1DA]'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Step Content ───────────────────────────────── */}
        <div className="px-8 py-6">
          {currentStep === 'shipping' && (
            <StepShipping form={form} />
          )}
          {currentStep === 'payment' && (
            <StepPayment form={form} />
          )}
          {currentStep === 'review' && (
            <StepReview form={form} />
          )}
          {currentStep === 'success' && (
            <OrderSuccess onClose={handleSuccessClose} />
          )}
        </div>

        {/* ─── Navigation Buttons ─────────────────────────── */}
        {currentStep !== 'success' && (
          <div
            className="px-8 pb-8 pt-4 flex gap-3 border-t border-[#E5E1DA]"
          >
            {currentStep !== 'shipping' && (
              <button
                onClick={handleBack}
                className="border border-[#E5E1DA] text-[#1A1A1A] hover:bg-[#FBF9F6] transition-colors flex items-center gap-2 px-5 py-3 rounded-none text-xs uppercase tracking-widest font-medium"
              >
                <ChevronLeft size={14} />
                Back
              </button>
            )}

            {currentStep !== 'review' ? (
              <button
                onClick={handleNext}
                className="bg-[#1A1A1A] text-white hover:bg-[#333333] transition-colors flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-none text-xs uppercase tracking-widest font-medium"
              >
                Continue
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="bg-[#1A1A1A] text-white hover:bg-[#333333] transition-colors flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-none text-xs uppercase tracking-widest font-medium disabled:opacity-40"
              >
                {isProcessing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Payment…
                  </>
                ) : (
                  <>
                    Place Order
                    <ChevronRight size={14} />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
