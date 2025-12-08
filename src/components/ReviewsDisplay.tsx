import { Star } from "lucide-react";
import { formatReviewStats, getStarArray } from "@/types/review";
import { FlavorReviewData } from "@/types/review";

interface ReviewsDisplayProps {
  reviews: FlavorReviewData;
  onOpenReviews: () => void;
}

export const ReviewsDisplay = ({ reviews, onOpenReviews }: ReviewsDisplayProps) => {
  const stars = getStarArray(reviews.averageRating);

  return (
    <button
      onClick={onOpenReviews}
      className="flex items-center gap-2 text-sm text-brand-white/70 hover:text-brand-white transition-colors"
    >
      {/* Stars */}
      <div className="flex gap-0.5">
        {stars.map((filled, idx) => (
          <Star
            key={idx}
            className={`w-3.5 h-3.5 ${
              filled
                ? "fill-brand-white text-brand-white"
                : "text-brand-white/20"
            }`}
          />
        ))}
      </div>

      {/* Rating & Count - same font */}
      {reviews.totalCount === 0 ? (
        <span className="text-sm text-brand-white/50">No reviews</span>
      ) : (
        <>
          <span>{reviews.averageRating.toFixed(1)}</span>
          <span>({reviews.totalCount})</span>
        </>
      )}
    </button>
  );
};
