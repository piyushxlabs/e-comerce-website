'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useFilter } from '@/context/FilterContext';
import { Search, ShoppingBag, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { totalItemCount, openDrawer } = useCart();
  const { filters, setSearchQuery } = useFilter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  useEffect(() => {
    if (filters.searchQuery === '' && localSearch !== '') {
      setLocalSearch('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.searchQuery]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsProfileOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const displayCount = totalItemCount > 99 ? '99+' : totalItemCount;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-500',
        'navbar-warm',
        isScrolled ? 'py-3' : 'py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between gap-6">
          {/* ─── Brand ──────────────────────────────────────────── */}
          <a href="/" className="flex-shrink-0 group">
            <span className="text-[22px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase select-none">
              NEXUS
            </span>
          </a>

          {/* ─── Search (Desktop) ───────────────────────────────── */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search
                size={15}
                strokeWidth={1.5}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none"
              />
              <input
                id="navbar-search"
                type="text"
                placeholder="Search products…"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full input-warm rounded-sm pl-10 pr-9 py-2.5 text-[13px] tracking-wide"
                aria-label="Search products"
              />
              {localSearch && (
                <button
                  onClick={() => setLocalSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#1A1A1A] transition-colors"
                  aria-label="Clear search"
                >
                  <X size={13} strokeWidth={1.5} />
                </button>
              )}
            </div>
          </div>

          {/* ─── Actions ────────────────────────────────────────── */}
          <div className="flex items-center gap-0.5">
            {/* Mobile search */}
            <button
              onClick={() => setIsMobileSearchOpen((v) => !v)}
              className="md:hidden p-2.5 text-[#666666] hover:text-[#1A1A1A] transition-colors"
              aria-label="Toggle search"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                id="profile-menu-btn"
                onClick={() => setIsProfileOpen((v) => !v)}
                className="p-2.5 text-[#666666] hover:text-[#1A1A1A] transition-colors"
                aria-label="Profile menu"
                aria-haspopup="true"
                aria-expanded={isProfileOpen}
              >
                <User size={18} strokeWidth={1.5} />
              </button>

              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#E5E1DA] rounded-sm p-1 shadow-[0_12px_48px_rgba(0,0,0,0.08)] z-20 animate-fade-down">
                    <div className="px-4 py-3 border-b border-[#E5E1DA]">
                      <p className="text-sm font-medium text-[#1A1A1A]">Piyush</p>
                      <p className="text-[11px] text-[#999999] tracking-wide">piyush@nexus.store</p>
                    </div>
                    {['My Orders', 'Wishlist', 'Settings', 'Sign Out'].map((item) => (
                      <button
                        key={item}
                        className="w-full text-left px-4 py-2.5 text-[13px] text-[#666666] hover:text-[#1A1A1A] hover:bg-[#FBF9F6] rounded-sm transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Cart */}
            <button
              id="cart-drawer-btn"
              onClick={openDrawer}
              className="relative p-2.5 text-[#666666] hover:text-[#1A1A1A] transition-colors"
              aria-label={`Shopping cart with ${totalItemCount} items`}
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {totalItemCount > 0 && (
                <span className="absolute -top-0 -right-0.5 min-w-[17px] h-[17px] flex items-center justify-center rounded-full text-[9px] font-semibold text-white bg-[#1A1A1A] px-1 tracking-wide">
                  {displayCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ─── Mobile Search ──────────────────────────────────── */}
        {isMobileSearchOpen && (
          <div className="md:hidden mt-4 pb-1 animate-fade-down">
            <div className="relative">
              <Search
                size={15}
                strokeWidth={1.5}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search products…"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full input-warm rounded-sm pl-10 pr-4 py-2.5 text-[13px] tracking-wide"
                autoFocus
                aria-label="Search products mobile"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
