import { twMerge } from "tailwind-merge";

function Ratings({ className = "", avgRating }) {
  return (
    <div className={twMerge("flex", className)}>
      {new Array(5).fill(0).map((_, index) => {
        const fullStars = Math.floor(avgRating); 
        const decimal = avgRating - fullStars; 
        const starIndex = index + 1;

        if (starIndex <= fullStars) {
          // Full star
          return (
            <span key={index} className="text-[gold]">
              ★
            </span>
          );
        } else if (starIndex === fullStars + 1 && decimal > 0) {
          // Partial star (using gradient)
          return (
            <span
              key={index}
              className="relative inline-block text-neutral-300"
            >
              <span
                className="absolute top-0 left-0 overflow-hidden text-[gold]"
                style={{ width: `${decimal * 100}%` }}
              >
                ★
              </span>
              ★
            </span>
          );
        } else {
          // Empty star
          return (
            <span key={index} className="text-neutral-300">
              ★
            </span>
          );
        }
      })}
    </div>
  );
}

export default Ratings;
