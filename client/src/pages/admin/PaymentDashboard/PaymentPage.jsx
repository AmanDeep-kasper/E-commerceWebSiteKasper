import { Outlet } from "react-router-dom";
import PaymentNavbar from "./PaymentNavbar";

// const profileMenu = [
//   { label: "Transaction View", path: "transaction-view" },
//   // { label: "All Statements", path: "all-statements" },
// ];

function PaymentPage() {
  return (
    <div className="p-[24px] bg-[#F6F8F9] min-h-screen">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between px-2 rounded-md">
            <h2 className="text-[20px] font-semibold text-gray-800">
              Payments Dashboard
            </h2>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl mt-5">
          <PaymentNavbar  />
          <div className="pt-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;