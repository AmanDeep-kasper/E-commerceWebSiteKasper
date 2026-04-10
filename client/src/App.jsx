// App.jsx
// import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { syncCart } from "./redux/cart/cartSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageRouter from "./Router/PageRouter";
// import { getUserDetails } from "./redux/cart/userSlice";
// // import { useAutoRefreshToken } from "./hooks/useAutoRefreshToken";
// import { fetchAddresses } from "./redux/cart/addressSlice";
// import { fetchAllProducts } from "./redux/cart/productSlice";

function App() {
  const dispatch = useDispatch();
  // const { isAuthenticated } = useSelector((state) => state.user);

  // useAutoRefreshToken();

  // useEffect(() => {
  //   const initializeUser = async () => {
  //     try {
  //       await dispatch(fetchAllProducts());
  //     } catch (err) {
  //       // Cookie expired ya user not logged in
  //       console.log("User not authenticated");
  //     }
  //   };

  //   initializeUser();
  // }, [dispatch]);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //   }
  // }, [dispatch, isAuthenticated]);

  // useEffect(() => {
  //   dispatch(syncCart());
  // }, [dispatch]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        closeButton={false}
        pauseOnHover
      />
      <PageRouter />
    </>
  );
}
export default App;
