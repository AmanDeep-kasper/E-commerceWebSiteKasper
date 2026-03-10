// PageRouter.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

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
import ReturnPage from "../pages/admin/Returns/ReturnPage";

import ReturnRequested from "../pages/admin/Returns/ReturnRequested";
import ReturnInitiated from "../pages/admin/Returns/ReturnInitiated";
import ReceivedReturns from "../pages/admin/Returns/ReceivedReturns";
import ReturnClosed from "../pages/admin/Returns/ReturnClosed";
// import PaymentSuccess from "../pages/PaymentSuccess";
// Admin Pages
import Dashboard from "../pages/admin/Dashboard/Dashboard";
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
import TaxesSettings from "../pages/admin/setting/WarehouseDetails";
import GeneralSettingsForm from "../pages/admin/setting/form/GeneralSettingsForm";
import NotificationSettingsForm from "../pages/admin/setting/form/NotificationsSettingsForm";
import PaymentSettingsForm from "../pages/admin/setting/form/PaymentSettingsForm";
import TaxSettingsForm from "../pages/admin/setting/form/TaxSettingsForm";
import Login from "../pages/user/Login";
import Register from "../pages/user/RegisterPage";
import ForgotPassword from "../components/forms/ForgotPassword";
import ResetPassword from "../components/forms/ResetPassword";
import AllOrders from "../pages/admin/order/AllOrders";
import PendingOrders from "../pages/admin/order/NewOrders";
import ProcessingOrders from "../pages/admin/order/ProcessingOrders";
import ShippedOrders from "../pages/admin/order/ShippedOrders";
import DeliveredOrders from "../pages/admin/order/DeliveredOrders";
import CancelledOrders from "../pages/admin/order/CancelledOrders";
import Transporter from "../pages/admin/Transporter/Transporter";
import AboutUs from "../pages/AboutUs";
import ShippingPolicy from "../pages/ShippingPolicy";
import ReturnRefundPolicy from "../pages/ReturnRefundPolicy";
import TermsConditions from "../pages/TermsConditions";
import CancelItemsPage from "../components/CancelItemsPage";
import UserReturnPage from "../components/UserReturnPage";
import TransporterDetail from "../pages/admin/Transporter/TransporterDetail";
import Support from "../pages/admin/Support&Ticket/Support";
import TicketDetail from "../pages/admin/Support&Ticket/TicketDetail";
import InventoryPage from "../pages/admin/Inventory/InventoryPage";
import All from "../pages/admin/Inventory/All";
import LowStock from "../pages/admin/Inventory/LowStock";
import OutofStock from "../pages/admin/Inventory/OutofStock";
import InventoryDetails from "../pages/admin/Inventory/InventoryDetails";
import PaymentPage from "../pages/admin/PaymentDashboard/PaymentPage";
import TransactionView from "../pages/admin/PaymentDashboard/TransactionView";
import AllStatements from "../pages/admin/PaymentDashboard/AllStatements";
import ProductSettings from "../pages/admin/setting/BannersSettings";
import BannersSettings from "../pages/admin/setting/BannersSettings";
import PoliciesSettings from "../pages/admin/setting/PoliciesSettings";
import NotificationsSettings from "../pages/admin/setting/NotificationsSettings";
import AccountSettings from "../pages/admin/setting/AccountSettings";

const PageRouter = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/shippingpolicy" element={<ShippingPolicy />} />
        <Route path="/returnrefundpolicy" element={<ReturnRefundPolicy />} />
        <Route path="/termsconditions" element={<TermsConditions />} />

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
          <Route
            path="order-detail/:orderId/cancel"
            element={<CancelItemsPage />}
          />
          <Route
            path="order-detail/:orderId/return"
            element={<UserReturnPage />}
          />
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
        {/* <Route path="/payment-success" element={<PaymentSuccess />} /> */}
        {/* <Route path="/confirm-order" element={<ConfirmOrder />} /> */}

        {/* Admin Route */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* dashboard */}
          <Route path="dashboard" element={<Dashboard />} />
          {/* add product */}
          <Route path="add-product" element={<AddProduct />} />
          <Route path="add-product/:uuid" element={<AddProduct />} />
          {/* customers */}
          <Route path="customers" element={<Customer />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          {/* orders */}
          <Route path="orders" element={<Order />}>
            <Route index element={<Navigate to="all" replace />} />
            <Route path="all" element={<AllOrders />} />
            <Route path="pending" element={<PendingOrders />} />
            <Route path="processing" element={<ProcessingOrders />} />
            <Route path="shipped" element={<ShippedOrders />} />
            <Route path="delivered" element={<DeliveredOrders />} />
            <Route path="cancelled" element={<CancelledOrders />} />
          </Route>

          {/* returns */}
          <Route path="returns" element={<ReturnPage />}>
            <Route index element={<Navigate to="ReturnRequested" replace />} />
            <Route path="ReturnRequested" element={<ReturnRequested />} />
            <Route path="ReturnInitiated" element={<ReturnInitiated />} />
            <Route path="ReceivedReturns" element={<ReceivedReturns />} />
            <Route path="ReturnClosed" element={<ReturnClosed />} />
          </Route>

          <Route path="users" element={<User />} />
          <Route path="sales" element={<Sale />} />
          <Route path="stocks" element={<Stock />} />

          {/* Customer */}
          <Route path="customers/:id" element={<CustomerLayout />}>
            <Route path="customer-info" element={<Information />} />
            <Route path="edit" element={<InformationForm />} />
            <Route path="order-insight" element={<OrderInsight />} />
            <Route path="wishlist-cart" element={<WishlistCartInfo />} />
            <Route path="address-book" element={<Addresses />} />
            <Route path="support-feedback" element={<Feedback />} />
          </Route>

          {/* Add transporters */}
          <Route path="transporter" element={<Transporter />} />
          <Route path="transporter/detail" element={<TransporterDetail />} />

          {/* payment */}
          <Route path="payment" element={<PaymentPage />}>
            <Route index element={<Navigate to="transaction-view" replace />} />
            <Route path="transaction-view" element={<TransactionView />} />
            <Route path="all-statements" element={<AllStatements />} />
          </Route>

          {/* Support & ticket */}
          <Route path="support&ticket" element={<Support />} />
          <Route
            path="support&ticket/ticketdetail"
            element={<TicketDetail />}
          />

          {/* Inventory */}
          <Route path="Inventory" element={<InventoryPage />}>
            <Route index element={<Navigate to="All" replace />} />
            <Route path="All" element={<All />} />
            <Route path="LowStock" element={<LowStock />} />
            <Route path="OutofStock" element={<OutofStock />} />

            {/* Inventory Details Page */}
            <Route path="details/:id" element={<InventoryDetails />} />
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
            <Route path="Banners" element={<BannersSettings/>} />
            <Route path="Policies" element={<PoliciesSettings/>} />
            <Route path="Notifications" element={<NotificationsSettings />} />
            <Route path="AccountSettings" element={<AccountSettings />} />
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
