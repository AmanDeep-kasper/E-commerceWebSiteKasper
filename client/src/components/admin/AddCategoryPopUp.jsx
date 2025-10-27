import React from "react";

const AddCategoryPopUp = () => {
  return (
    <div
      className="relative w-screen h-screen flex items-center justify-center bg-cover bg-center"
      style={{}}
    >
      <div>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <div className="relative z-10 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 w-[350px]">
          <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
            Sign In
          </h2>
        </div>

         <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryPopUp;
