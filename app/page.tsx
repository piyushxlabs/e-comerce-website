import ProductGrid from '@/components/product/ProductGrid';
import HeroSection from '@/components/layout/HeroSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pb-32">
        <div className="mb-12 border-b border-[#E5E1DA] pb-8">
          <span className="text-xs uppercase tracking-widest text-[#999999] block mb-2">Selected Range</span>
          <h2 className="text-3xl font-light text-[#1A1A1A] tracking-tight mb-2">
            Featured Products
          </h2>
          <p className="text-[#666666] text-sm max-w-md font-light">
            Curated precision for the discerning technologist. Selected for form, function, and aesthetic integrity.
          </p>
        </div>
        <ProductGrid />
      </section>
    </>
  );
}

