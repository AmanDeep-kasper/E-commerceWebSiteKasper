import users from "../../data/user";
import AccountDetails from "../AccountDetails";
import Navbar from "../../components/Navbar";
import AccountSidebar from "../../components/AccountSidebar";
import Footer from "../../sections/Footer";
import { Outlet } from "react-router-dom";

function AccountLayout() {
  return (
    <>
      <Navbar />
      <section className="lg:px-20 md:px-[60px] px-4 pt-24 pb-6 bg-gray-50 min-h-screen">
        <div className="flex gap-6 items-start">
          {/* Sidebar */}
          <div className="hidden lg:block w-[310px] shrink-0">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default AccountLayout;
