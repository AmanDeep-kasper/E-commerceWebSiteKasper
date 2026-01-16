const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        if (star <= fullStars) {
          // Full star
          return (
            <span key={star} className="text-yellow-400 text-2xl">
              ★
            </span>
          );
        }

        if (star === fullStars + 1 && hasHalfStar) {
          // Half star (CSS trick)
          return (
            <span
              key={star}
              className="text-2xl text-yellow-400 relative inline-block">
              <span className="absolute overflow-hidden w-1/2">★</span>
              <span className="text-gray-300">★</span>
            </span>
          );
        }

        // Empty star
        return (
          <span key={star} className="text-gray-300 text-2xl">
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
