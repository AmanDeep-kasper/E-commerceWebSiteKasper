import React from "react";
import { Link } from "react-router";

function Breadcrumbs({ category, subcategory, title }) {
  return (
    <nav
      className="flex lg:px-20 md:px-[60px] px-3 py-3 bg-gray-50"
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center text-sm sm:text-[16px] space-x-1 sm:space-x-2 rtl:space-x-reverse overflow-x-auto max-w-full scrollbar-hide">
        {/* Home */}
        <li className="inline-flex items-center flex-shrink-0">
          <Link to="/" className="inline-flex items-center text-gray-600">
            Home
          </Link>
        </li>

        {/* Category */}
        {category && (
          <li className="flex-shrink-0">
            <div className="flex items-center">
              <SeparatorIcon />
              <Link
                to={`/products/${encodeURIComponent(category)}`}
                className="ms-1 text-gray-800 truncate max-w-[120px] sm:max-w-none"
              >
                {category}
              </Link>
            </div>
          </li>
        )}

        {/* Subcategory */}
        {subcategory && (
          <li className="flex-shrink-0">
            <div className="flex items-center">
              <SeparatorIcon />
              <Link
                to={`/products/${encodeURIComponent(
                  category
                )}/${encodeURIComponent(subcategory)}`}
                className="ms-1 text-gray-800 truncate max-w-[120px] sm:max-w-none"
              >
                {subcategory}
              </Link>
            </div>
          </li>
        )}

        {/* Product / Last Crumb */}
        {title && <li className="flex-shrink-0">
          <div className="flex items-center">
            <SeparatorIcon />
            <span className="ms-1 text-gray-900 truncate max-w-[150px] sm:max-w-none">
              {title}
            </span>
          </div>
        </li>}
      </ol>
    </nav>
  );
}

/* Small chevron separator extracted to keep DRY */
function SeparatorIcon() {
  return (
    <svg
      className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 6 10"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m1 9 4-4-4-4"
      />
    </svg>
  );
}

export default Breadcrumbs;
