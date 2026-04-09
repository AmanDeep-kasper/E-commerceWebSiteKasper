import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { cancelOrderItems } from "../redux/cart/orderSlice"; // create this action

const CancelItemsPage = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const orders = useSelector((s) => s.order.list);
  const order = useMemo(
    () => orders?.find((o) => o.orderId.slice(1) === orderId),
    [orders, orderId],
  );

  const [selected, setSelected] = useState({});
  // selected[itemId] = qtyToCancel

  if (!order) return <div className="p-8">Order not found...</div>;

  const toggleItem = (idx, maxQty) => {
    setSelected((prev) => {
      const key = String(idx);
      if (prev[key]) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      return { ...prev, [key]: maxQty }; // default cancel full qty
    });
  };

  const changeQty = (idx, qty, maxQty) => {
    const q = Math.max(1, Math.min(Number(qty), maxQty));
    setSelected((prev) => ({ ...prev, [String(idx)]: q }));
  };

  const selectedCount = Object.keys(selected).length;

  const handleConfirm = () => {
    if (selectedCount === 0) return;

    // const itemsToCancel = Object.entries(selected).map(([idx, qty]) => {
    //   const item = order.items[Number(idx)];
    //   return {
    //     itemId: item.itemId || item.variantId || item.uuid || idx, // use best unique key
    //     qty: Number(qty),
    //   };
    // });

    const itemsToCancel = Object.entries(selected).map(([idx, qty]) => ({
      idx: Number(idx),
      qty: Number(qty),
    }));

    dispatch(
      cancelOrderItems({
        orderId: order.orderId, // keep original with prefix
        itemsToCancel,
      }),
    );

    navigate(`/accounts/order-detail/${orderId}`);
  };

  return (
    <div className="p-6 sm:p-10 bg-white rounded-lg w-full">
      <h1 className="text-xl font-semibold text-gray-900 mb-2">
        Select Items to Cancel
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Choose products and quantity you want to cancel.
      </p>

      <div className="space-y-4">
        {order.items
          .filter((it) => Number(it.quantity ?? it.Quantity ?? 0) > 0)
          .map((item, idx) => {
            const maxQty = Number(item.quantity ?? item.Quantity ?? 1);
            const checked = selected[String(idx)] != null;

            return (
              <div
                key={idx}
                className="border rounded-lg p-4 flex items-start gap-4"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleItem(idx, maxQty)}
                  className="mt-2 w-4 h-4"
                />

                <img
                  src={item.img}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded border"
                />

                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Qty in order: {maxQty}
                  </p>

                  {checked && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm text-gray-700">Cancel Qty:</span>
                      <input
                        type="number"
                        min={1}
                        max={maxQty}
                        value={selected[String(idx)]}
                        onChange={(e) => changeQty(idx, e.target.value, maxQty)}
                        className="w-24 border rounded px-2 py-1 text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

        {/* Cancel Reason */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Reason for Cancellation
          </label>

          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Select a reason</option>
            <option value="Changed my mind">Changed my mind</option>
            <option value="Ordered by mistake">Ordered by mistake</option>
            <option value="Found cheaper elsewhere">
             Found Cheaper Somewhere Else
            </option>
            <option value="Delivery taking too long">
             Need to Change Payment Method
            </option>
            <option value="Need to change address">
              Need to Change Shipping Address
            </option>
            <option value="Other">Other</option>
          </select>

          {reason === "Other" && (
            <input
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Write your reason..."
              className="w-full mt-3 border rounded-lg px-3 py-2 text-sm"
            />
          )}

          {!reason && (
            <p className="text-xs text-red-600 mt-2">Please select a reason.</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center gap-3">
        <button
          onClick={() => navigate(`/accounts/order-detail/${orderId}`)}
          className="px-5 py-2 rounded-lg border"
        >
          Back
        </button>

        <button
          onClick={handleConfirm}
          disabled={selectedCount === 0}
          className="px-5 py-2 rounded-lg bg-[#D53B35] text-white disabled:opacity-50"
        >
          Request Cancellation ({selectedCount})
        </button>
      </div>
    </div>
  );
};

export default CancelItemsPage;
