import { Link, useLocation, useParams } from "react-router-dom";

const InventoryNavbar = ({ profileMenu }) => {
  const location = useLocation();
  const { customerId } = useParams(); // optional if route uses it

  return (
    <div className="flex gap-8 px-2">
      {profileMenu.map(({ label, path }) => {
        const isActive = location.pathname.includes(path);

        return (
          <Link
            key={path}
            to={path}
            className={`relative pb-3 ml-5 mb-2 text-[16px] font-medium transition-colors
              ${
                isActive
                  ? "text-[#1C3753]"
                  : "text-gray-500 hover:text-gray-700"
              }`}>
            {label}

            {isActive && (
              <span
                className="absolute left-0 bottom-0 h-[2px] w-full
                  bg-blue-600 rounded-full transition-all"
              />
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default InventoryNavbar;
