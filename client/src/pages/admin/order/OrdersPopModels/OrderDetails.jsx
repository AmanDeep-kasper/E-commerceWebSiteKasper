import {
  Box,
  ClipboardClock,
  Download,
  Truck,
  WalletCards,
  X,
} from "lucide-react";

const OrderDetails = ({ data, setSelectedOrderId }) => {
  // //////////////////////////////////
  const items = data?.items || [];

  const itemSubtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const discount = data.discount ?? 0;
  const shippingCost = data.shippingCost ?? 0;

  const totalAmount = itemSubtotal - discount + shippingCost;

  return (
    <div className="bg-[#FFFFFF] w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 w-full flex-nowrap">
        <span className="text-[18px]">Order Details</span>
        <button
          className="border-[1px] border-black rounded-full shrink-0"
          onClick={setSelectedOrderId}>
          <X size={18} />
        </button>
      </div>

      {/* Order ID */}
      <div className="flex items-start border-b-[0.5px] w-full">
        <div className="flex mb-3 w-full justify-start flex-nowrap md:gap-4">
          <div className="min-w-0">
            <span className="text-sm font-medium">
              Order ID #{data.orderId}
            </span>
            <div className="text-[#686868] text-sm">
              <span>{data.orderDate}</span>.<span>{data.orderTime}</span>
            </div>
          </div>
          <div>
            <span
              className={`px-3 py-1 rounded-md text-xs font-medium shrink-0
          ${
            data.orderStatus === "Delivered"
              ? "bg-green-100 text-green-600"
              : data.orderStatus === "Cancelled"
                ? "bg-[#EFEFEF] text-[#686868]"
                : data.orderStatus === "Pending"
                  ? "bg-[#FFF9E0] text-[#F8A14A]"
                  : data.orderStatus === "Processing"
                    ? "bg-[#E6D3FF] text-[#8A38F5]"
                    : data.orderStatus === "Shipped"
                      ? "bg-[#D5E5F5] text-[#1C3753]"
                      : ""
          }`}>
              {data.orderStatus}
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
                {data.quantity}
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
                {data.paymentType}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Details */}
      <div className="mt-2">
        <p className="text-sm mt-3 mb-2">Customer Details</p>
        <div className="w-full p-3 text-sm text-gray-600 border rounded-md">
          <div className="flex items-center gap-2 mb-3 w-full flex-nowrap">
            <div className="w-[40px] h-[40px] rounded-full bg-gray-500 flex items-center justify-center overflow-hidden">
              {data?.deliveryAddress?.profileImage ? (
                <img
                  src={data.deliveryAddress.profileImage}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : (
                <span className="text-white font-semibold text-lg">
                  {data?.deliveryAddress?.name?.charAt(0)?.toUpperCase() || "?"}
                </span>
              )}
            </div>

            <div className=" flex flex-col min-w-0">
              <span className="text-black">{data.deliveryAddress.name}</span>
              <span>{data.customerId ?? "N/A"} </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between w-full flex-nowrap">
              <span>Phone Number</span>
              <span className="text-black font-medium shrink-0">
                {data.deliveryAddress.mobile ?? "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between w-full flex-nowrap">
              <span>Email</span>
              <span className="text-black font-medium shrink-0">
                {data.deliveryAddress.email ?? "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between w-full flex-nowrap">
              <span>Address</span>
              <span className="text-black font-medium shrink-0">
                {data.deliveryAddress.addressLine1 ?? "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mt-2">
        <span className="text-sm mt-3 mb-3">Items</span>
        <div className="w-full flex flex-col gap-3 p-3 text-sm text-gray-600 border rounded-md">
          {[1, 2].map((_, i) => (
            <div key={i}>
              <div className="flex items-center justify-between border-b pb-3 w-full flex-nowrap">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    width={42}
                    height={42}
                    className="rounded-md shrink-0"
                    src="https://plus.unsplash.com/premium_photo-1675896084254-dcb626387e1e"
                    alt=""
                  />
                  <div className="flex flex-col text-[16px] space-y-2 min-w-0">
                    <span>
                      {"Flower Mandela Laser Cut Metal Wall Art"
                        .split(" ")
                        .slice(0, 4)
                        .join(" ") + "..."}
                    </span>
                    <div className="flex gap-2 text-[12px]">
                      <span className="border px-2 rounded-lg">Red</span>
                      <span className="border px-2 rounded-lg">25X12</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end text-[12px] space-y-1 shrink-0">
                  <span>SKU ID #SK-FLV1-391</span>
                  <div className="text-sm p-1 bg-[#EFEFEF] text-[#686868] rounded-lg font-medium">
                    Quantity 1
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
          <button className="flex items-center gap-2 text-[#2C87E2] shrink-0">
            Download Invoice <Download size={18} />
          </button>
        </div>

        <div className="w-full p-3 text-sm text-gray-600 border rounded-md">
          <div className="space-y-2">
            <div className="flex items-center justify-between w-full flex-nowrap">
              <span>Item Subtotal</span>
              <span className="text-black font-medium shrink-0">
                {" "}
                ₹{itemSubtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center justify-between w-full flex-nowrap">
              <span>Discount</span>
              <span className="text-black font-medium shrink-0">
                ₹{discount.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center justify-between w-full flex-nowrap">
              <span>Shipping Cost</span>
              <span className="text-black font-medium shrink-0">
                ₹{shippingCost.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center justify-between border-t py-2 w-full flex-nowrap">
              <span>Total</span>
              <span className="text-black font-medium shrink-0">
                ₹{totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
