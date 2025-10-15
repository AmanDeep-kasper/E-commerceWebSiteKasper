import {
  ChevronRight,
  CircleUserRound,
  PackagePlus,
  UserRound,
  Wallet,
  Menu as MenuIcon,
  X as XIcon,
} from "lucide-react";

function OrderSidebar() {
  return (
    <div className="w-full rounded-lg">
      {/* Account holder */}
      <div className="px-4 bg-white py-3 shadow-sm mb-4 flex gap-2 items-center rounded-lg">
        <span className="text-gray-700">
          <CircleUserRound className="w-5 h-5" />
        </span>
        <p className="text-sm lg:text-base">
          Hello, <span className="text-gray-500">User</span>
        </p>
      </div>

      <div className="shadow-sm bg-white px-4 rounded-lg">
        {/* MY ORDERS */}
        <div className="flex items-center justify-between py-3 hover:bg-gray-50 cursor-pointer">
          <div className="flex items-center gap-2">
            <PackagePlus className="w-5 h-5" />
            <h2 className="text-sm lg:text-base text-gray-500 font-medium">
              MY ORDERS
            </h2>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>

        {/* ACCOUNTS SETTINGS */}
        <div className="border-t border-gray-200 py-3">
          <div className="flex items-center gap-2 mb-2">
            <UserRound className="w-5 h-5" strokeWidth={0.5} fill="black" />
            <h2 className="text-sm lg:text-base text-gray-500 font-medium">
              ACCOUNT SETTINGS
            </h2>
          </div>
          <ul className="ml-7 flex flex-col gap-3">
            <li className="text-sm lg:text-base text-gray-600 hover:text-amber-500 cursor-pointer">
              Profile Information
            </li>
            <li className="text-sm lg:text-base text-gray-600 hover:text-amber-500 cursor-pointer">
              Manage Addresses
            </li>
          </ul>
        </div>

        {/* PAYMENTS */}
        <div className="border-t border-gray-200 py-3">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5" />
            <h2 className="text-sm lg:text-base text-gray-500 font-medium">
              PAYMENTS
            </h2>
          </div>
          <ul className="ml-7 flex flex-col gap-3">
            <li className="flex justify-between items-center text-sm lg:text-base text-gray-600 hover:text-amber-500 cursor-pointer">
              <span>Gift Cards</span>
              <span className="text-green-600">₹5</span>
            </li>
            <li className="text-sm lg:text-base text-gray-600 hover:text-amber-500 cursor-pointer">
              Saved UPI
            </li>
            <li className="text-sm lg:text-base text-gray-600 hover:text-amber-500 cursor-pointer">
              Saved Cards
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default OrderSidebar;