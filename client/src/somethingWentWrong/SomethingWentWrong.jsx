// src/components/SomethingWentWrong.jsx
import { Link } from "react-router";

const SomethingWentWrong = ({
  errorCode = 500,
  message = "Something went wrong",
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md overflow-hidden text-center p-10">
        {/* Icon Circle */}
        <div className="mx-auto w-28 h-28 bg-amber-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-14 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Error Code */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{errorCode}</h1>

        {/* Message */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">{message}</h2>
        <p className="text-gray-500 max-w-sm mx-auto mb-8">
          Oops! Something went wrong. Don’t worry — you can head back to
          shopping or try again.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600
                   text-white rounded-full px-8 py-3 font-medium transition-all shadow-md hover:shadow-lg"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="inline-block border border-gray-300 text-gray-700 rounded-full px-8 py-3 font-medium transition-all hover:bg-gray-50"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default SomethingWentWrong;
