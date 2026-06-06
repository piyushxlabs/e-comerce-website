import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
}

export default function StarRating({
  rating,
  reviewCount,
  size = 'sm',
}: StarRatingProps) {
  const starSize = size === 'sm' ? 11 : 14;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i < Math.floor(rating);
          const partial = !filled && i < rating;
          return (
            <div key={i} className="relative inline-flex">
              <Star
                size={starSize}
                strokeWidth={1}
                className="text-[#E5E1DA]"
                fill="currentColor"
              />
              {(filled || partial) && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: filled ? '100%' : `${(rating % 1) * 100}%` }}
                >
                  <Star
                    size={starSize}
                    strokeWidth={1}
                    className="text-[#1A1A1A]"
                    fill="currentColor"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <span className="text-[11px] font-medium text-[#1A1A1A] tracking-wide">
        {rating.toFixed(1)}
      </span>
      {reviewCount !== undefined && (
        <span className="text-[11px] text-[#C9C4BC]">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
