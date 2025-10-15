// App.jsx
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { syncCart } from "./redux/cart/cartSlice";
import { ToastContainer } from "react-toastify";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Customer from "./pages/admin/customer/Customer";
import Product from "./pages/admin/product/Product";
import Categories from "./pages/admin/Categories";
import User from "./pages/admin/User";
import Sale from "./pages/admin/Sale";
import Stock from "./pages/admin/stock/Stock";
import Order from "./pages/admin/order/Order";
import AddProduct from "./components/admin/AddProduct";
import ProductInformation from "./pages/admin/product/ProductInformation";
import OrderInformation from "./pages/admin/order/OrderInformation";
import StockDetail from "./pages/admin/stock/StockDetail";
import StockEditForm from "./pages/admin/stock/form/StockEditForm";

// Customer Management
import CustomerLayout from "./pages/admin/customer/CustomerLayout";
import Information from "./pages/admin/components/Information";
import OrderInsight from "./pages/admin/components/Orders";
import WishlistCartInfo from "./pages/admin/components/WishlistCartInfo";
import Address from "./pages/admin/components/AddressBook";
import Feedback from "./pages/admin/components/SupportFeedback";

// Customer Forms
import CustomerForm from "./pages/admin/customer/CustomerForm";
import InformationForm from "./pages/admin/customer/form/InformationForm";
import OrderInsightForm from "./pages/admin/customer/form/OrderInsightForm";
import WishlistCartForm from "./pages/admin/customer/form/WishlistCartForm";
import AddressBookForm from "./pages/admin/customer/form/AddressBookForm";
import SupportFeedbackForm from "./pages/admin/customer/form/SupportFeedbackForm";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminProfileSetting from "./pages/admin/profile/AdminProfileSetting";
import AdminProfileForm from "./pages/admin/profile/AdminProfileForm";
import GeneralSettings from "./pages/admin/setting/GeneralSettings";
import NotificationSettings from "./pages/admin/setting/NotificationSettings";
import PaymentSettings from "./pages/admin/setting/PaymentSettings";
import SettingsLayout from "./pages/admin/setting/SettingsLayout";
import TaxesSettings from "./pages/admin/setting/TaxesSettings";
import GeneralSettingsForm from "./pages/admin/setting/form/GeneralSettingsForm";
import NotificationSettingsForm from "./pages/admin/setting/form/NotificationsSettingsForm";
import PaymentSettingsForm from "./pages/admin/setting/form/PaymentSettingsForm";
import TaxSettingsForm from "./pages/admin/setting/form/TaxSettingsForm";
import PageRouter from "./Router/PageRouter";
import { getUserDetails } from "./redux/cart/userSlice";
import About from "./sections/About";
import { fetchAddresses } from "./redux/cart/addressSlice";
import { fetchAllProducts } from "./redux/cart/productSlice";

function App() {
  const dispatch = useDispatch();
  const { token, user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getUserDetails());
      dispatch(fetchAddresses())
      dispatch(fetchAllProducts())
    }
  }, [dispatch, isAuthenticated, user]);

  useEffect(() => {
    dispatch(syncCart());
  }, [dispatch]);


  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        pauseOnHover={false}
        draggable={false}
        closeOnClick
        limit={1} // Keep only 1 notification at a time
        newestOnTop // Show the latest toast on top
        theme="light"
        style={{ fontSize: "14px", padding: "8px" }} // Minimal styling
      />
      
      <PageRouter></PageRouter>
    </>
  );
}

export default App;

// tgvfv
// <BrowserRouter>
//         <Routes>
          // <Route path="/admin" element={<AdminLayout />}>
          //   <Route index element={<Dashboard />} />
          //   <Route path="add-product" element={<AddProduct />} />
          //   <Route path="customers" element={<Customer />} />
          //   <Route path="products" element={<Product />} />
          //   <Route path="categories" element={<Categories />} />
          //   <Route path="orders" element={<Order />} />
          //   <Route path="users" element={<User />} />
          //   <Route path="sales" element={<Sale />} />
          //   <Route path="stocks" element={<Stock />} />

          //   {/* Customer */}
          //   <Route path="customers/:id" element={<CustomerLayout />}>
          //     <Route path="customer-info" element={<Information />} />
          //     <Route path="order-insight" element={<OrderInsight />} />
          //     <Route path="wishlist-cart" element={<WishlistCartInfo />} />
          //     <Route path="address-book" element={<Address />} />
          //     <Route path="support-feedback" element={<Feedback />} />
          //   </Route>

          //   {/* Forms */}
          //   <Route path="" element={<CustomerForm />}>
          //     <Route path="customer-form" element={<InformationForm />} />
          //     <Route path="insight-form" element={<OrderInsightForm />} />
          //     <Route path="wishlist-form" element={<WishlistCartForm />} />
          //     <Route path="address-form" element={<AddressBookForm />} />
          //     <Route path="support-form" element={<SupportFeedbackForm />} />
          //   </Route>

          //   {/* Details */}
          //   <Route path="product-info/:uuid" element={<ProductInformation />} />
          //   <Route path="order-info/:orderId" element={<OrderInformation />} />
          //   <Route path="stock-info/:uuid" element={<StockDetail />} />
          //   <Route path="stock-form" element={<StockEditForm />} />

          //   {/* Admin Profile */}
          //   <Route path="profile-setting" element={<AdminProfileSetting />} />
          //   <Route path="profile-form" element={<AdminProfileForm />} />

          //   {/* Settings */}
          //   <Route path="settings" element={<SettingsLayout />}>
          //     <Route path="general" element={<GeneralSettings />} />
          //     <Route path="notification" element={<NotificationSettings />} />
          //     <Route path="payment" element={<PaymentSettings />} />
          //     <Route path="taxes" element={<TaxesSettings />} />
          //     {/* <Route path="product" element={<ProductSettings />} /> */}

          //     {/* Settings form */}
          //   </Route>
          //   <Route path="settings/general-form" element={<GeneralSettingsForm />} />
          //   <Route path="settings/notification-form" element={<NotificationSettingsForm />} />
          //   <Route path="settings/payment-form" element={<PaymentSettingsForm />} />
          //   <Route path="settings/tax-form" element={<TaxSettingsForm />} />
          // </Route>
//         </Routes>
//       </BrowserRouter>
