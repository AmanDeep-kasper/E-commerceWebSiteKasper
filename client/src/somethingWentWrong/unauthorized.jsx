import React from "react";
import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-red-50">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
      <p className="text-gray-700 mb-6">You don't have permission to access this page.</p>
      <Link to="/" className="text-blue-500 underline hover:text-blue-700">
        Go Back Home
      </Link>
    </div>
  );
}

export default Unauthorized;
