import { NavLink } from "react-router";

const PaymentNavbar = ({ profileMenu }) => {
  return (
    <div className="border-b border-[#E5E7EB] mb-4">
      <div className="flex items-center gap-8">
        {profileMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `pb-3 text-[14px] font-medium border-b-2 transition-all ${
                isActive
                  ? "text-[#111827] border-[#2C87E2]"
                  : "text-[#6B7280] border-transparent hover:text-[#111827]"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default PaymentNavbar;