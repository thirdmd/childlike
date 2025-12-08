import { Star } from "lucide-react";
import { FlavorReviewData } from "@/types/review";
import { getStarPercentage } from "@/types/review";

interface ReviewsModalProps {
  flavorName: string;
  reviews: FlavorReviewData;
  onClose: () => void;
}

export const ReviewsModal = ({ flavorName, reviews, onClose }: ReviewsModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-brand-blue border border-brand-white/20 rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-brand-blue border-b border-brand-white/20 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-brand-white">Reviews</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-brand-white/10 hover:bg-brand-white/20 flex items-center justify-center text-brand-white transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Flavor Name */}
          <div>
            <p className="text-sm text-brand-white/60">Product: {flavorName}</p>
          </div>

          {/* Review Stats */}
          {reviews.totalCount === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-8 h-8 text-brand-white/20"
                  />
                ))}
              </div>
              <p className="text-brand-white/70 text-lg font-semibold mb-2">
                No reviews yet
              </p>
              <p className="text-brand-white/50 text-sm">
                Be the first to review this flavor
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Average Rating Section */}
              <div className="flex items-center gap-8 pb-6 border-b border-brand-white/10">
                <div>
                  <div className="text-4xl font-bold text-brand-white">
                    {reviews.averageRating.toFixed(1)}
                  </div>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.floor(reviews.averageRating)
                            ? "fill-brand-white text-brand-white"
                            : "text-brand-white/20"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-brand-white/60 mt-2">
                    {reviews.totalCount} review{reviews.totalCount === 1 ? "" : "s"}
                  </p>
                </div>

                {/* Rating Distribution */}
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-brand-white/60 w-4">
                        {star}★
                      </span>
                      <div className="flex-1 h-1.5 bg-brand-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-white/60 transition-all"
                          style={{
                            width: `${getStarPercentage(
                              reviews.distribution[star as keyof typeof reviews.distribution],
                              reviews.totalCount
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-brand-white/40 w-8 text-right">
                        {reviews.distribution[star as keyof typeof reviews.distribution]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual Reviews (placeholder for future) */}
              <div className="pt-4">
                <p className="text-sm text-brand-white/70">
                  Individual reviews will be displayed here
                </p>
              </div>
            </div>
          )}

          {/* Submit Review Button (placeholder for future) */}
          <div className="pt-4 border-t border-brand-white/10">
            <button
              disabled
              className="w-full py-3 px-4 bg-brand-white/10 hover:bg-brand-white/20 rounded-lg border border-brand-white/20 text-brand-white/70 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit a Review (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
