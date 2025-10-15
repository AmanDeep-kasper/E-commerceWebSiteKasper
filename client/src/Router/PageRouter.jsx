// PageRouter.js
import { BrowserRouter, Routes, Route } from "react-router";

// Public Pages
import Home from "../pages/Home";
import Faqs from "../pages/Faqs";
import Policy from "../pages/Policy";
import SomethingWentWrong from "../SomethingWentWrong/SomethingWentWrong";
import Product from "../pages/Product";
import Cart from "../pages/Cart";
import AccountDetails from "../pages/AccountDetails";
import OrderHistory from "../pages/OrderHistory";
import Wishlist from "../pages/Wishlist";
import Address from "../pages/Address";
import OrderTracking from "../pages/OrderTracking";
import AddProduct from "../components/admin/AddProduct";
import ProductDetails from "../pages/ProductDetails";
import Delivery from "../pages/Delivery";
import Payment from "../pages/Payment";
import ConfirmOrder from "../pages/ConfirmOrder";
import Reviews from "../pages/Reviews";
import AllReviews from "../pages/AllReviews";
import NewProducts from "../pages/NewProducts";
import TopProducts from "../pages/TopProducts";
import ScrollToTop from "../components/ScrollToTop";
import AccountLayout from "../pages/account/AccountLayout";
import MyReviews from "../components/MyReviews";
import Contact from "../components/Contact";
import OrderDetail from "../components/OrderDetail";
import ReturnPage from "../pages/ReturnPage";
// Admin Pages
import Dashboard from "../pages/admin/Dashboard";
import Customer from "../pages/admin/customer/Customer";
import Products from "../pages/admin/product/Product";
import Categories from "../pages/admin/Categories";
import User from "../pages/admin/User";
import Sale from "../pages/admin/Sale";
import Stock from "../pages/admin/stock/Stock";
import Order from "../pages/admin/order/Order";
import ProductInformation from "../pages/admin/product/ProductInformation";
import OrderInformation from "../pages/admin/order/OrderInformation";
import StockDetail from "../pages/admin/stock/StockDetail";
import StockEditForm from "../pages/admin/stock/form/StockEditForm";

// Customer Management
import CustomerLayout from "../pages/admin/customer/CustomerLayout";
import Information from "../pages/admin/components/Information";
import OrderInsight from "../pages/admin/components/Orders";
import WishlistCartInfo from "../pages/admin/components/WishlistCartInfo";
import Addresses from "../pages/admin/components/AddressBook";
import Feedback from "../pages/admin/components/SupportFeedback";

// Customer Forms
import CustomerForm from "../pages/admin/customer/CustomerForm";
import InformationForm from "../pages/admin/customer/form/InformationForm";
import OrderInsightForm from "../pages/admin/customer/form/OrderInsightForm";
import WishlistCartForm from "../pages/admin/customer/form/WishlistCartForm";
import AddressBookForm from "../pages/admin/customer/form/AddressBookForm";
import SupportFeedbackForm from "../pages/admin/customer/form/SupportFeedbackForm";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminProfileSetting from "../pages/admin/profile/AdminProfileSetting";
import AdminProfileForm from "../pages/admin/profile/AdminProfileForm";
import GeneralSettings from "../pages/admin/setting/GeneralSettings";
import NotificationSettings from "../pages/admin/setting/NotificationSettings";
import PaymentSettings from "../pages/admin/setting/PaymentSettings";
import SettingsLayout from "../pages/admin/setting/SettingsLayout";
import TaxesSettings from "../pages/admin/setting/TaxesSettings";
import GeneralSettingsForm from "../pages/admin/setting/form/GeneralSettingsForm";
import NotificationSettingsForm from "../pages/admin/setting/form/NotificationsSettingsForm";
import PaymentSettingsForm from "../pages/admin/setting/form/PaymentSettingsForm";
import TaxSettingsForm from "../pages/admin/setting/form/TaxSettingsForm";
import Login from "../pages/user/Login";
import Register from "../pages/user/RegisterPage";
import ForgotPassword from "../components/forms/ForgotPassword";
import ResetPassword from "../components/forms/ResetPassword";

const PageRouter = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/policy" element={<Policy />} />

        {/* Auth Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* App Pages */}
        <Route path="/bag" element={<Cart />} />

        {/* Accounts */}
        <Route path="/accounts" element={<AccountLayout />}>
          <Route path="details" element={<AccountDetails />} />
          <Route path="order-history" element={<OrderHistory />} />
          <Route path="order-detail/:orderId" element={<OrderDetail />} />
          <Route path="order-detail/:orderId/return" element={<ReturnPage />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="addresses" element={<Address />} />
          <Route path="support" element={<Contact />} />
          <Route path="reviews" element={<MyReviews />} />
        </Route>

        <Route path="checkout/delivery" element={<Delivery />} />
        {/* <Route path="/recent" element={<RecentActivity />} /> */}
        <Route path="/order-history/:orderId" element={<OrderTracking />} />
        <Route path="/products/:categoryName" element={<Product />} />
        <Route path="/confirm-order" element={<ConfirmOrder />} />
        <Route path="/all-reviews/:uuid" element={<AllReviews />} />
        <Route path="/products" element={<NewProducts />} />
        <Route path="/products/top-products" element={<TopProducts />} />
        <Route
          path="/products/:categoryName/:subcategoryName"
          element={<Product />}
        />
        <Route path="/product/:uuid" element={<ProductDetails />} />
        <Route path="/product-form" element={<AddProduct />} />
        <Route path="/checkout/payment" element={<Payment />} />

        <Route path="/policy" element={<Policy />} />

        {/* Admin Route */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="customers" element={<Customer />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Order />} />
          <Route path="users" element={<User />} />
          <Route path="sales" element={<Sale />} />
          <Route path="stocks" element={<Stock />} />

          {/* Customer */}
          <Route path="customers/:id" element={<CustomerLayout />}>
            <Route path="customer-info" element={<Information />} />
            <Route path="order-insight" element={<OrderInsight />} />
            <Route path="wishlist-cart" element={<WishlistCartInfo />} />
            <Route path="address-book" element={<Addresses />} />
            <Route path="support-feedback" element={<Feedback />} />
          </Route>

          {/* Forms */}
          <Route path="" element={<CustomerForm />}>
            <Route path="customer-form" element={<InformationForm />} />
            <Route path="insight-form" element={<OrderInsightForm />} />
            <Route path="wishlist-form" element={<WishlistCartForm />} />
            <Route path="address-form" element={<AddressBookForm />} />
            <Route path="support-form" element={<SupportFeedbackForm />} />
          </Route>

          {/* Details */}
          <Route path="product-info/:uuid" element={<ProductInformation />} />
          <Route path="order-info/:orderId" element={<OrderInformation />} />
          <Route path="stock-info/:uuid" element={<StockDetail />} />
          <Route path="stock-form" element={<StockEditForm />} />

          {/* Admin Profile */}
          <Route path="profile-setting" element={<AdminProfileSetting />} />
          <Route path="profile-form" element={<AdminProfileForm />} />

          {/* Settings */}
          <Route path="settings" element={<SettingsLayout />}>
            <Route path="general" element={<GeneralSettings />} />
            <Route path="notification" element={<NotificationSettings />} />
            <Route path="payment" element={<PaymentSettings />} />
            <Route path="taxes" element={<TaxesSettings />} />
            {/* <Route path="product" element={<ProductSettings />} /> */}

            {/* Settings form */}
          </Route>
          <Route
            path="settings/general-form"
            element={<GeneralSettingsForm />}
          />
          <Route
            path="settings/notification-form"
            element={<NotificationSettingsForm />}
          />
          <Route
            path="settings/payment-form"
            element={<PaymentSettingsForm />}
          />
          <Route path="settings/tax-form" element={<TaxSettingsForm />} />
        </Route>

        {/* Catch-All */}
        <Route path="*" element={<SomethingWentWrong />} />
      </Routes>
    </BrowserRouter>
  );
};

export default PageRouter;
