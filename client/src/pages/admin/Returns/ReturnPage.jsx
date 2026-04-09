import { useState } from "react";
import {
  ClipboardClock,
  PackageSearch,
  Truck,
  PackageCheck,
} from "lucide-react";
import { Outlet } from "react-router-dom";
import returns from "../../../data/Returns.json";
import NavReturn from "./NavReturn";

const Badge = ({ children, tone }) => {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium `}>
      {children}
    </span>
  );
};

const profileMenu = [
  { label: "New Returns", path: "ReturnRequested" },
  { label: "Processing", path: "ReturnInitiated" },
  { label: "Returned", path: "ReceivedReturns" },
];

function ReturnPage() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const allRows = [...returns];
  const totalPages = Math.ceil(allRows.length / rowsPerPage);
  const rows = allRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const [param, setParam] = useState("all");

  const filteredRows =
    param.toLowerCase() === "all"
      ? rows
      : rows.filter(
          (row) => row.orderStatus.toLowerCase() === param.toLowerCase(),
        );

  // /////////////////////////////////////////
  const [returnsData, setReturnsData] = useState(returns || []);

  return (
    <div className="p-[24px] bg-[#F6F8F9] min-h-screen">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between  16px px-2 rounded-md">
            <h2 className="text-[20px] font-semibold text-gray-800">Returns</h2>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl mt-5">
          <NavReturn profileMenu={profileMenu} />
          <div className="pt-4">
            <Outlet context={{ returnsData, setReturnsData }} />
            {/* <Outlet  /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReturnPage;
