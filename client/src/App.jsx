// App.jsx
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { syncCart } from "./redux/cart/cartSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageRouter from "./Router/PageRouter";
import { getUserDetails } from "./redux/cart/userSlice";
import { useAutoRefreshToken } from "./hooks/useAutoRefreshToken";
// import About from "./sections/About";
import { fetchAddresses } from "./redux/cart/addressSlice";
import { fetchAllProducts } from "./redux/cart/productSlice";

function App() {
  const dispatch = useDispatch();
  const { token, user, isAuthenticated } = useSelector((state) => state.user);

  // 🔄 Auto-refresh token every 14 minutes
  useAutoRefreshToken();

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getUserDetails());
      dispatch(fetchAddresses());
      dispatch(fetchAllProducts());
    }
  }, [dispatch, isAuthenticated, user]);

  useEffect(() => {
    dispatch(syncCart());
  }, [dispatch]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        closeButton={false}
        pauseOnHover
      />

      <PageRouter></PageRouter>
    </>
  );
}

export default App;
