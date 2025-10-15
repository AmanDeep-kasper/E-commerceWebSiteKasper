
function OrderFilter({ setStatus, status, setTime, time }) {
  const currentYear = new Date().getFullYear();
  const timeOptions = [
    { id: "last30Days", label: "Last 30 days" },
    { id: `year${currentYear}`, label: `${currentYear}` },
    { id: `year${currentYear - 1}`, label: `${currentYear - 1}` },
    { id: `year${currentYear - 2}`, label: `${currentYear - 2}` },
    { id: "older", label: "Older" },
  ];

  return (
    <div className="w-[280px] bg-white rounded-lg shadow-sm p-5 h-max sticky top-4">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 pb-4 border-b border-gray-200">
        Filters
      </h3>

      {/* Order Status */}
      <div className="py-4 border-b border-gray-200">
        <h2 className="text-gray-800 font-semibold mb-3 flex items-center justify-between">
          ORDER STATUS
          {status && (
            <button
              onClick={() => setStatus("")}
              className="text-xs text-blue-600 font-normal hover:underline"
            >
              Reset
            </button>
          )}
        </h2>
        <div className="space-y-3">
          {[
            { id: "onTheWay", label: "Out for Delivery" },
            { id: "delivered", label: "Delivered" },
            { id: "cancelled", label: "Cancelled" },
            { id: "returned", label: "Returned" },
          ].map((item) => (
            <div key={item.id} className="flex items-center">
              <input
                type="checkbox"
                id={`status-${item.id}`}
                checked={status === item.label}
                onChange={() =>
                  setStatus(status === item.label ? "" : item.label)
                }
                className="w-4 h-4 text-[#EBB100] rounded border-gray-300 focus:ring-[#EBB100]"
              />
              <label
                htmlFor={`status-${item.id}`}
                className={`ml-2 text-sm ${
                  status === item.label ? "text-gray-800" : "text-gray-600"
                }`}
              >
                {item.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Order Time */}
      <div className="py-4">
        <h2 className="text-gray-800 font-semibold mb-3 flex items-center justify-between">
          ORDER TIME
          {time && (
            <button
              onClick={() => setTime("")}
              className="text-xs text-blue-600 font-normal hover:underline"
            >
              Reset
            </button>
          )}
        </h2>

        <div className="space-y-3">
          {timeOptions.map((item) => (
            <div key={item.id} className="flex items-center">
              <input
                type="radio"
                name="order-time"
                id={`time-${item.id}`}
                value={item.id}
                checked={time === item.id}
                onChange={() => setTime(item.id)}
                className="w-4 h-4 text-[#EBB100] border-gray-300 focus:ring-[#EBB100]"
              />
              <label
                htmlFor={`time-${item.id}`}
                className="ml-2 text-sm text-gray-700"
              >
                {item.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear All */}
      {(status || time) && (
        <button
          onClick={() => {
            setStatus("");
            setTime("");
          }}
          className="w-full mt-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}

export default OrderFilter;
