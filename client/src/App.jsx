// App.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { syncCart } from "./redux/cart/cartSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageRouter from "./Router/PageRouter";
import { getUserDetails } from "./redux/cart/userSlice";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        await dispatch(getUserDetails()).unwrap();
      } catch (err) {
        // Cookie expired ya user not logged in
        // console.log("User not authenticated check");
      }
    };

    initializeUser();
  }, [dispatch]);

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
      <PageRouter />
    </>
  );
}
export default App;
