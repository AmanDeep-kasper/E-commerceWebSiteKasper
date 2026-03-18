import { Link, useLocation, useParams } from "react-router";

const NavOrders = ({ profileMenu, data }) => {
  const location = useLocation();
  // const { customerId } = useParams();
  const getCount = (path) => {
    if (path === "all") return data.length;

    return data.filter(
      (item) => item.orderStatus?.toLowerCase() === path.toLowerCase(),
    ).length;
  };

  return (
    <div className="flex gap-8 px-2">
      {profileMenu.map(({ label, path }) => {
        const isActive = location.pathname.includes(path);
        const count = getCount(path);

        return (
          <Link
            key={path}
            to={path}
            className={`relative pb-3 ml-5 mb-2 text-[16px] font-medium transition-colors
              ${
                isActive
                  ? "text-[#1C3753]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {label}
            <span
              className={`min-w-[22px] h-[22px] px-2 text-[12px] rounded-full flex items-center justify-center
                ${
                  isActive
                    ? "bg-[#1C3753] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
            >
              {count}
            </span>

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

export default NavOrders;
