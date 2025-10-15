import { Link } from "react-router"; // ✅ use react-router-dom

const EmptyState = ({
  heading = "No Items Found",
  description = "Looks like nothing is here yet.",
  icon: Icon, // only Lucide icon components
  ctaLabel = "Go Back",
  ctaLink,
  onClick, // optional
}) => {
  const buttonClasses =
    "inline-block bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 \
     text-gray-900 rounded-full md:px-8 md:py-3 px-4 py-2 text-sm md:text-base font-medium transition-all shadow-md hover:shadow-lg";

  return (
    <div className="h-[70vh] flex flex-col justify-center items-center text-center px-4 bg-white">
      {/* Icon Circle */}
      {Icon && (
        <div className="mx-auto md:w-28 md:h-28 w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Icon className="md:w-14 md:h-14 w-8 h-8 text-amber-400" />
        </div>
      )}

      {/* Heading */}
      <h3 className="text-lg md:text-2xl font-semibold text-gray-900 mb-3">
        {heading}
      </h3>

      {/* Subtext */}
      <p className="text-sm md:text-base text-gray-500 max-w-sm mb-4 md:mb-8">
        {description}
      </p>

      {/* CTA: dynamic */}
      {ctaLink ? (
        <Link to={ctaLink} className={buttonClasses}>
          {ctaLabel}
        </Link>
      ) : onClick ? (
        <button onClick={onClick} className={buttonClasses}>
          {ctaLabel}
        </button>
      ) : null}
    </div>
  );
};

export default EmptyState;
