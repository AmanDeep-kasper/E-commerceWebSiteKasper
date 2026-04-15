import React, { useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { requestReturnItems } from "../redux/cart/orderSlice";

const REASONS = [
  "Damaged product",
  "Wrong item received",
  "Missing parts/accessories",
  "Size issue",
  "Quality not as expected",
  "Other",
];

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const UserReturnPage = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRefs = useRef({});

  const orders = useSelector((s) => s.order.list);
  const order = useMemo(
    () => orders?.find((o) => o.orderId.slice(1) === orderId),
    [orders, orderId],
  );

  // ✅ state FIRST
  const [selected, setSelected] = useState({});
  const [reasonByIdx, setReasonByIdx] = useState({});
  const [photosByIdx, setPhotosByIdx] = useState({}); // ✅ store File[]
  const [commentByIdx, setCommentByIdx] = useState({});

  if (!order) return <div className="p-8">Order not found...</div>;

  if (String(order.orderStatus || "").toLowerCase() !== "delivered") {
    return <div className="p-8">Return is available only after delivery.</div>;
  }

  const toggleItem = (idx, maxQty) => {
    setSelected((prev) => {
      const key = String(idx);
      if (prev[key]) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      return { ...prev, [key]: maxQty };
    });
  };

  const changeQty = (idx, qty, maxQty) => {
    const q = Math.max(1, Math.min(Number(qty), maxQty));
    setSelected((prev) => ({ ...prev, [String(idx)]: q }));
  };

  // ✅ ONLY ONE handler (stores files)
  const handlePhotoChange = (idx, files) => {
    const key = String(idx);
    const arr = Array.from(files || []);

    setPhotosByIdx((prev) => {
      const existing = prev[key] || [];
      const remaining = 3 - existing.length;
      const limited = arr.slice(0, remaining);
      return { ...prev, [key]: [...existing, ...limited] };
    });
  };

  const handlePickImages = (idx) => {
    fileRefs.current[idx]?.click();
  };

  const removePhoto = (idx, photoIndex) => {
    setPhotosByIdx((prev) => {
      const key = String(idx);
      const list = prev[key] || [];
      const updated = list.filter((_, i) => i !== photoIndex);
      return { ...prev, [key]: updated };
    });
  };

  const selectedCount = Object.keys(selected).length;

  const handleSubmit = async () => {
    if (selectedCount === 0) return;

    for (const idxStr of Object.keys(selected)) {
      if (!reasonByIdx[idxStr]) {
        alert("Please select a return reason for all selected items.");
        return;
      }
      if (!photosByIdx[idxStr] || photosByIdx[idxStr].length === 0) {
        alert("Please upload at least one photo for all selected items.");
        return;
      }
    }

    const itemsToReturn = await Promise.all(
      Object.entries(selected).map(async ([idxStr, qty]) => {
        const files = photosByIdx[idxStr] || [];
        const base64Photos = await Promise.all(files.map(fileToBase64));

        return {
          idx: Number(idxStr),
          qty: Number(qty),
          reason: reasonByIdx[idxStr],
          photos: base64Photos,
          comment: commentByIdx[idxStr] || "",
        };
      }),
    );

    dispatch(
      requestReturnItems({
        orderId: order.orderId,
        itemsToReturn,
      }),
    );

    navigate(`/accounts/order-detail/${orderId}`);
  };

  return (
    <div className="p-6 sm:p-10 bg-white rounded-lg w-full">
      <h1 className="text-xl font-semibold text-gray-900 mb-2">
        Return / Replace Items
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Select item(s), quantity, reason and upload photo proof.
      </p>

      <div className="space-y-4">
        {order.items
          .filter((it) => Number(it.quantity ?? it.Quantity ?? 0) > 0)
          .map((item, idx) => {
            const maxQty = Number(item.quantity ?? item.Quantity ?? 1);
            const checked = selected[String(idx)] != null;
            const files = photosByIdx[String(idx)] || [];

            return (
              <div
                key={idx}
                className="border rounded-lg p-4 flex items-start gap-4"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleItem(idx, maxQty)}
                  className="mt-2"
                />

                <img
                  src={item.img}
                  alt={item.name}
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-cover rounded border"
                />

                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Qty in order: {maxQty}
                  </p>

                  {checked && (
                    <>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-sm text-gray-700">
                          Return Qty:
                        </span>
                        <input
                          type="number"
                          min={1}
                          max={maxQty}
                          value={selected[String(idx)]}
                          onChange={(e) =>
                            changeQty(idx, e.target.value, maxQty)
                          }
                          className="w-24 border rounded px-2 py-1 text-sm"
                        />
                      </div>

                      <div className="mt-3">
                        <label className="text-sm text-gray-700 block mb-1">
                          Reason
                        </label>
                        <select
                          value={reasonByIdx[String(idx)] || ""}
                          onChange={(e) =>
                            setReasonByIdx((prev) => ({
                              ...prev,
                              [String(idx)]: e.target.value,
                            }))
                          }
                          className="w-full border rounded px-3 py-2 text-sm"
                        >
                          <option value="" disabled>
                            Select reason
                          </option>
                          {REASONS.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-3">
                        <label className="text-sm text-gray-700 block mb-1">
                          Note (optional)
                        </label>
                        <input
                          value={commentByIdx[String(idx)] || ""}
                          onChange={(e) =>
                            setCommentByIdx((prev) => ({
                              ...prev,
                              [String(idx)]: e.target.value,
                            }))
                          }
                          placeholder="Short description..."
                          className="w-full border rounded px-3 py-2 text-sm"
                        />
                      </div>

                      <div className="mt-3">
                        <label className="text-sm text-gray-700 block mb-1">
                          Upload photo (max 3)
                        </label>

                        <input
                          ref={(el) => (fileRefs.current[idx] = el)}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) =>
                            handlePhotoChange(idx, e.target.files)
                          }
                        />

                        {files.length < 3 && (
                          <button
                            type="button"
                            onClick={() => handlePickImages(idx)}
                            className="w-20 h-20 rounded-lg border bg-white text-sm text-gray-500 hover:bg-gray-100"
                          >
                            + Add
                          </button>
                        )}

                        {files.length > 0 && (
                          <div className="mt-2 flex gap-2 flex-wrap">
                            {files.map((file, i) => (
                              <div key={i} className="relative">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt="proof"
                                  className="w-16 h-16 object-cover rounded border"
                                  crossOrigin="anonymous"
                                  referrerPolicy="no-referrer"
                                />
                                <button
                                  type="button"
                                  onClick={() => removePhoto(idx, i)}
                                  className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => navigate(`/accounts/order-detail/${orderId}`)}
          className="px-5 py-2 rounded-lg border"
        >
          Back
        </button>

        <button
          onClick={handleSubmit}
          disabled={selectedCount === 0}
          className="px-5 py-2 rounded-lg bg-[#1C3753] text-white disabled:opacity-50"
        >
          Submit Return Request ({selectedCount})
        </button>
      </div>
    </div>
  );
};

export default UserReturnPage;
