/**
 * Review System - Centralized Types & Utilities
 *
 * Future-proof design for Supabase integration
 * Structure allows easy API integration without changing UI components
 */

export interface Review {
  id: string;
  flavorId: string;
  productId: string;
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  author?: string;
  createdAt: Date;
  verified?: boolean; // For future: verified purchase
}

export interface FlavorReviewData {
  totalCount: number;
  averageRating: number; // 0-5, rounded to 1 decimal
  distribution: {
    // Distribution of ratings for stats
    5: number; // Count of 5-star reviews
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

/**
 * Calculate average rating from reviews
 * Ready for Supabase: just map the response to this function
 */
export const calculateAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10; // Round to 1 decimal
};

/**
 * Get star display data
 * Returns array of 5 booleans for rendering stars
 */
export const getStarArray = (rating: number): boolean[] => {
  return [1, 2, 3, 4, 5].map((star) => star <= Math.floor(rating));
};

/**
 * Get percentage for a specific star rating
 */
export const getStarPercentage = (starCount: number, totalCount: number): number => {
  return totalCount === 0 ? 0 : Math.round((starCount / totalCount) * 100);
};

/**
 * Format review data for display
 * Centralized so changes propagate everywhere
 */
export const formatReviewStats = (reviewData: FlavorReviewData): {
  displayRating: string;
  displayCount: string;
} => {
  return {
    displayRating: reviewData.averageRating === 0 ? "0" : reviewData.averageRating.toFixed(1),
    displayCount: reviewData.totalCount === 0 ? "No reviews" : `${reviewData.totalCount} review${reviewData.totalCount === 1 ? "" : "s"}`,
  };
};
