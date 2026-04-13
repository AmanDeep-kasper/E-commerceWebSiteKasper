import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }) => {
  const { isAuthenticated, authChecked } = useSelector((state) => state.user);

  // Wait until auth check completes
  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If already logged in, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default GuestRoute;
