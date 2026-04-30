import {
  Box,
  ClipboardClock,
  Download,
  Truck,
  WalletCards,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../api/axiosInstance";

const OrderDetails = ({
  data,
  setSelectedOrderId,
  onAcceptOrder,
  onReadyToShip,
  onSaveTracking,
  // onMarkDelivered,
  setopenCancelModule,
}) => {
  // //////////////////////////////////
  const items = data || [];
  console.log(items);

  const statusMap = {
    placed: "New Orders",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  const statusStyles = {
    placed: "bg-[#D5E5F5] text-[#1C3753]",
    processing: "bg-[#E6D3FF] text-[#8A38F5]",
    shipped: "bg-[#FBDBF7] text-[#E91DD1]",
    delivered: "bg-[#E0F4DE] text-[#00A63E]",
    cancelled: "bg-[#EFEFEF] text-[#686868]",
  };

  // const itemSubtotal = items.reduce(
  //   (total, item) => total + item.price * item.quantity,
  //   0,
  // );

  // const discount = data.discount ?? 0;
  // const shippingCost = data.shippingCost ?? 0;

  // const totalAmount = itemSubtotal - discount + shippingCost;
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  useEffect(() => {
    const fetchTransporters = async () => {
      try {
        const res = await axiosInstance.get("/dashboard/transport");
        setDeliveryPartners(res?.data?.data || []);
      } catch (error) {
        console.error("Transport fetch error:", error);
      }
    };

    fetchTransporters();
  }, []);

  console.log(deliveryPartners);

  const [selectedPartner, setSelectedPartner] = useState(
    data?.deliveryPartner || "",
  );

  // const [trackingId, setTrackingId] = useState(data?.trackingId || "");
  // const [trackingUrl, setTrackingUrl] = useState(data?.trackingUrl || "");

  // // ✅ FIX: normalize status to avoid "pending", "Pending ", etc.
  const status = (data?.status || "").trim().toLowerCase();

  const isPending = status === "placed";
  const isProcessing = status === "processing";
  const isShipped = status === "shipped";

  const orderId = data?._id;
  const canAccept = isPending;

  // const showTrackingSection = isProcessing || isShipped;
  // const trackingAlreadySaved = !!data?.trackingId;

  // console.log({ isPending, selectedPartner, canAccept });

  return (
    <div className="bg-[#FFFFFF] w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 w-full flex-nowrap">
        <span className="text-[18px]">Order Details</span>
        <button
          className="border-[1px] border-black rounded-full shrink-0"
          onClick={setSelectedOrderId}
        >
          <X size={18} />
        </button>
      </div>

      {/* Order ID */}
      <div className="flex items-start border-b-[0.5px] w-full">
        <div className="flex mb-3 w-full justify-start flex-nowrap md:gap-4">
          <div className="min-w-0">
            <span className="text-sm font-medium">{data.orderNumber}</span>
            <div className="text-[#686868] text-sm flex items-start gap-1">
              <span>{new Date(data.createdAt).toLocaleDateString()}</span>
              <i className="text-[#DEDEDE]">●</i>
              <span>
                {" "}
                {new Date(data.placedAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          <div>
            <span
              className={`px-6 py-1 rounded-md text-xs font-medium ${
                statusStyles[data.status] || ""
              }`}
            >
              {statusMap[data.status] || data.status}
            </span>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="mt-2">
        <p className="text-sm mt-3 mb-2">Order Summary</p>
        <div className="w-full p-3 text-sm text-gray-600 border rounded-md">
          <div className="space-y-3">
            <div className="flex items-center justify-between w-full flex-nowrap">
              <div className="flex items-center gap-1 min-w-0">
                <Box size={15} />
                <span>Total Items</span>
              </div>
              <div className="text-black font-medium shrink-0">
                {data.items.length}
              </div>
            </div>

            {data.deliveryPartner && (
              <div className="flex items-center justify-between w-full flex-nowrap">
                <div className="flex items-center gap-1 min-w-0">
                  <Truck size={15} />
                  <span>Shipping Partner</span>
                </div>
                <div className="text-black font-medium shrink-0">
                  {data.deliveryPartner}
                </div>
              </div>
            )}

            {data.trackingId && (
              <div className="flex items-center justify-between w-full flex-nowrap">
                <div className="flex items-center gap-1 min-w-0">
                  <ClipboardClock size={15} />
                  <span>Tracking ID</span>
                </div>
                <div className="text-black font-medium shrink-0">
                  {data.trackingId}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between w-full flex-nowrap">
              <div className="flex items-center gap-1 min-w-0">
                <WalletCards size={15} />
                <span>Payment Method</span>
              </div>
              <div className="text-black font-medium shrink-0">
                {data.paymentMethod}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Summmary  
      <div className="mt-2">
        <span className="text-sm mt-3 mb-3">Delivery Summary</span>
        <div className="w-full p-3 text-sm text-gray-600 border rounded-md">
          <div className="space-y-3">
            <div className="flex items-center justify-between w-full flex-nowrap">
              <div className="flex items-center gap-1 min-w-0">
                <Box size={15} />
                <span>Delivery Type</span>
              </div>
              <div className="text-black font-medium shrink-0">
                
                {data.quantity ? data.quantity : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
      */}
      {/* Delivery Partner */}
      {status === "processing" && (
        <div className="mt-2">
          <span className="text-sm mt-3 mb-3 block">Delivery Partner</span>

          <div className="w-full p-2 text-sm text-gray-600 border rounded-md">
            <select
              value={selectedPartner}
              onChange={(e) => setSelectedPartner(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md bg-white text-black"
            >
              <option value="">Select delivery partner</option>

              {deliveryPartners.map((p) => (
                <option key={p._id} value={p.transporterName}>
                  {p.transporterName}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* traking details */}
      {/* {data.trakingDeatils && (
        <div className="mt-2 flex flex-col space-y-3">
          <span className="text-sm block">Tracking Details</span>
          <div className="w-full  text-sm text-gray-600 border rounded-md">
            <div className="flex items-center justify-between w-full flex-nowrap">
              <input
                readOnly
                type="text"
                className="p-2 w-full outline-none"
                value={selectedPartner}
                placeholder="Shipping Partner"
              />
            </div>
          </div>
          <div className="w-full  text-sm text-gray-600 border rounded-md">
            <div className="flex items-center justify-between w-full flex-nowrap">
              <input
                type="text"
                className="p-2 w-full outline-none"
                placeholder="Enter traking ID"
              />
            </div>
          </div>
          <div className="w-full  text-sm text-gray-600 border rounded-md">
            <div className="flex items-center justify-between w-full flex-nowrap">
              <input
                type="text"
                className="p-2 w-full outline-none"
                placeholder="Enter tracking URL"
              />
            </div>
          </div>
        </div>
      )} */}
      {/* {showTrackingSection && (
        <div className="mt-3">
          <p className="text-sm font-medium mb-2">Tracking Details</p>

          
          {trackingAlreadySaved ? (
            <div className="p-3 border rounded-md bg-[#F8FAFB] text-sm space-y-1">
              <div>
                <span className="text-gray-600">Partner:</span>{" "}
                {data.deliveryPartner}
              </div>
              <div>
                <span className="text-gray-600">Tracking ID:</span>{" "}
                {data.trackingId}
              </div>

              {data.trackingUrl && (
                <a
                  href={data.trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#2C87E2] underline"
                >
                  Open Tracking URL
                </a>
              )}
            </div>
          ) : (
            <> 
              {/* <input
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="w-full border rounded-md p-2 text-sm mb-2"
                placeholder="Enter Tracking ID"
              />
              <input
                value={trackingUrl}
                onChange={(e) => setTrackingUrl(e.target.value)}
                className="w-full border rounded-md p-2 text-sm"
                placeholder="Enter Tracking URL"
              /> 

              <button
                type="button"
                disabled={!trackingId}
                onClick={() =>
                  onSaveTracking({ orderId, trackingId, trackingUrl })
                }
                className={`mt-2 px-4 py-2 rounded-md text-sm
            ${trackingId ? "bg-[#1C3753] text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
              >
                Save Tracking
              </button>
            </>
          )}
        </div>
      )}*/}

      {/* Customer Details */}
      <div className="mt-2">
        <p className="text-sm mt-3 mb-2">Customer Details</p>
        <div className="w-full p-3 text-sm text-gray-600 border rounded-md">
          <div className="flex items-center gap-2 mb-3 w-full flex-nowrap">
            <div className="w-[40px] h-[40px] rounded-full bg-gray-500 flex items-center justify-center overflow-hidden">
              {data?.shippingAddress?.profileImage ? (
                <img
                  src={data?.shippingAddress.profileImage}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : (
                <span className="text-white font-semibold text-lg">
                  {data?.shippingAddress?.fullName?.charAt(0)?.toUpperCase() ||
                    "?"}
                </span>
              )}
            </div>

            <div className=" flex flex-col min-w-0">
              <span className="text-black">
                {data?.shippingAddress?.fullName}
              </span>
              <span>{data.customerId ?? "N/A"} </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between w-full flex-nowrap">
              <span>Phone Number</span>
              <span className="text-black font-medium shrink-0">
                {data.shippingAddress.phone ?? "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between w-full flex-nowrap">
              <span>Email</span>
              <span className="text-black font-medium shrink-0">
                {data.shippingAddress.email ?? "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between w-full gap-8">
              <span>Address</span>
              <span className="text-black font-medium shrink-3 overflow-hidden">
                {data?.shippingAddress.address ?? "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mt-2">
        <span className="text-sm mt-3 mb-3">Items</span>
        <div className="w-full flex flex-col gap-3 p-3 text-sm text-gray-600 border rounded-md">
          {data?.items.map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between border-b pb-3 w-full flex-nowrap">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    width={42}
                    height={42}
                    className="rounded-md shrink-0"
                    src={item?.image?.url}
                    alt=""
                  />
                  <div className="flex flex-col text-[16px] space-y-2 min-w-0">
                    <span>
                      {item.productTitle.split(" ").slice(0, 5).join(" ") +
                        "..."}
                    </span>
                    <div className="flex gap-2 text-[12px]">
                      <span className="border px-2 rounded-lg">
                        {item?.variantColor}
                      </span>
                      <span className="border px-2 rounded-lg">
                        {item?.variantName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end text-[12px] space-y-1 shrink-0">
                  <span>SKU ID- {item?.variantSkuId}</span>
                  <div className="text-sm p-1 bg-[#EFEFEF] text-[#686868] rounded-lg font-medium">
                    Quantity- {item?.quantity}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment */}
      <div className="mt-2">
        <div className="flex items-center justify-between w-full flex-nowrap">
          <p className="text-sm mt-3 mb-2">Payment</p>
          {/* <button className="flex items-center gap-2 text-[#2C87E2] shrink-0">
            Download Invoice <Download size={18} />
          </button> */}
        </div>

        <div className="w-full p-3 text-sm text-gray-600 border rounded-md">
          <div className="space-y-2">
            <div className="flex items-center justify-between w-full flex-nowrap">
              <span>Item Subtotal</span>
              <span className="text-black font-medium shrink-0">
                {" "}
                ₹{data.mrpTotal ? data.mrpTotal : "--"}
              </span>
            </div>

            <div className="flex items-center justify-between w-full flex-nowrap">
              <span>Discount</span>
              <span className="text-black font-medium shrink-0">
                ₹{data.totalDiscount ? data.totalDiscount : "--"}
              </span>
            </div>

            <div className="flex items-center justify-between w-full flex-nowrap">
              <span>Shipping Cost</span>
              <span className="text-black font-medium shrink-0">
                ₹{data?.shippingCharge}
              </span>
            </div>
            <div className="flex items-center justify-between w-full flex-nowrap">
              <span>Platform Fee</span>
              <span className="text-black font-medium shrink-0">
                ₹{data?.platformFee}
              </span>
            </div>
            <div className="flex items-center justify-between w-full flex-nowrap">
              <span>Applied Points</span>
              <span className="text-black font-medium shrink-0">
                ₹{data?.discount}
              </span>
            </div>

            <div className="flex items-center justify-between border-t py-2 w-full flex-nowrap">
              <span>Total</span>
              <span className="text-black font-medium shrink-0">
                ₹{data?.grandTotal}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 mt-4">
        {status === "placed" && (
          <>
            <button
              type="button"
              disabled={!canAccept}
              onClick={async () => {
                await onAcceptOrder(orderId);
                setSelectedOrderId();
              }}
              className={`px-6 py-1.5 rounded-md text-white
        ${canAccept ? "bg-[#1C3753]" : "bg-gray-300 cursor-not-allowed"}`}
            >
              Accept
            </button>

            {/* <button
              type="button"
              onClick={() => setopenCancelModule(orderId)}
              className="px-6 py-1.5 rounded-md text-[#1C3753] bg-white border border-[#1C3753]"
            >
              Reject
            </button> */}
          </>
        )}
        {status === "processing" && (
          <button
            type="button"
            onClick={() =>
              onReadyToShip({ orderId: data._id, carrier: selectedPartner })
            }
            className="px-6 py-1.5 rounded-md text-sm font-medium bg-[#1C3753] text-white"
          >
            Ready to Ship
          </button>
        )}
        {/* {isShipped && (
          <button
            type="button"
            onClick={() => onMarkDelivered?.({ orderId: data.orderId })}
            className="px-3 py-1.5 text-sm rounded-md text-white bg-[#1C3753]"
          >
            Mark as Delivered
          </button>
        )} */}
      </div>
    </div>
  );
};

export default OrderDetails;
