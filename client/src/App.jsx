// App.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageRouter from "./Router/PageRouter";
import { getUserDetails } from "./redux/cart/userSlice";
import axiosInstance from "./api/axiosInstance";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  //  INITIAL AUTH CHECK (IMPORTANT)
  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  //  AUTO TOKEN REFRESH (OPTIONAL BUT RECOMMENDED)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(
      () => {
        axiosInstance.post("/auth/refresh-token").catch(() => {});
      },
      9 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        closeButton={false}
        pauseOnHover
      />

      <PageRouter />
    </>
  );
}

export default App;
