import { X } from "lucide-react";
import React from "react";
import OrderDetails from "../../order/OrdersPopModels/OrderDetails";

const ReturnRequestedModule = ({
  data,
  setSelectedOrderId,
  setopenCancelModule,
  handleAcceptedOrders,
}) => {
  const isExchange = data?.type === "Exchange";
  // condition for exchange
  const returnedItem = data.item;
  const exchangedItem = isExchange ? data.exchangeDetails.exchangedItem : null;
  const shippingCost = isExchange ? data.exchangeDetails.shippingCost : 0;
  const exchangedPrice = isExchange ? data.exchangeDetails.newPrice : 0;
  const totalRefund = isExchange
    ? exchangedPrice + shippingCost
    : returnedItem.price;

  // const [selectedOrderId, setSelectedOrderId] = useState(null);
  // const selectOrder = data.find((orders) => orders.orderId === selectedOrderId);
  // {
  //   /* Order Detail */
  // }
  // {
  //   selectOrder && (
  //     <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
  //       <div
  //         className="
  //           bg-[#FFFFFF]
  //           w-[500px]
  //           max-w-[90vw]
  //           max-h-[90vh]
  //           p-[24px]
  //           rounded-xl
  //           relative
  //           md:w-[500px]
  //           overflow-y-auto
  //           overscroll-contain
  //           scrollbar-hide
  //         ">
  //         <OrderDetails
  //           data={selectOrder}
  //           setSelectedOrderId={() => setSelectedOrderId(null)}
  //         />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <span className="text-[18px]">
            {" "}
            {isExchange ? "Exchange Details" : "Return Details"}
          </span>
          <button className="bg-[#E6D3FF] text-[#8A38F5] font-medium px-5 py-0.5 text-sm rounded">
            {isExchange ? "Exchange" : "Return"}
          </button>
        </div>
        <button
          className="border border-black rounded-full shrink-0"
          onClick={setSelectedOrderId}>
          <X size={18} />
        </button>
      </div>

      <div className="flex w-full gap-4 border-t pt-2 border-b pb-2">
        {/* left side */}
        <div className="min-w-0 ">
          <div>
            {/* Order ID */}

            <div className="flex mb-3 w-full md:gap-4">
              <div className="min-w-0">
                <span className="text-sm font-medium">
                  {isExchange ? "Exchange ID" : "Return ID"} #{data.returnId}
                </span>
                <div className="text-[#686868] text-sm flex items-start gap-1">
                  <span>
                    <span>
                      {new Date(data.requestedAt).toLocaleDateString()}
                    </span>
                  </span>
                  <i className="text-[#DEDEDE]">●</i>
                  <span>{new Date(data.requestedAt).toLocaleTimeString()}</span>
                </div>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-md text-xs font-medium shrink-0 ${data.status === "Pending" ? "bg-[#D5E5F5] text-[#1C3753]" : data.status === "Approved" ? "bg-[#E6FFED] text-[#027A48]" : data.status === "Rejected" ? "bg-[#FFEAEA] text-[#D53B35]" : data.status === "Return to Origin" ? "bg-[#DEDEDE] text-[#686868]" : data.status === "No Refund" ? "bg-[#EFEFEF] text-[#686868]" : data.status === "Exchanged" ? "bg-[#C7FCFF] text-[#008D94]" : data.status === "Exchange Initiated" ? "bg-[#D5E5F5] text-[#1C3753]" : data.status === "Refunded" ? "bg-[#E6D3FF] text-[#8A38F5]" : data.status === "Refund Initiated" ? "bg-[#FBDBF7] text-[#E91DD1]" : ""}`}>
                  {data.status}
                </span>
              </div>
            </div>

            <div>
              <span className="text-sm font-medium mb-2">
                {" "}
                {returnedItem.quantity} Item{returnedItem.quantity > 1 && "s"}{" "}
                out of {returnedItem.quantity}
              </span>
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-[90px] w-[120px] rounded overflow-hidden">
                  <img
                    className="h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D"
                    alt={data.item.productName}
                  />
                </div>
                <div className="space-y-3 min-w-0 w-full">
                  <div className="flex flex-col">
                    <span className="text-base">{data.item.productName}</span>
                    <span className="text-xs text-[#686868]">
                      SKU ID #{data.item.sku}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-6 ">
                    <div className="flex items-center justify-center gap-2 text-[#495F75]">
                      {" "}
                      <span className="border border-[#495F75]  px-2 rounded text-xs">
                        {/* {returnedItem.variant.split("|")[1]?.trim() ||
                          returnedItem.variant} */}
                        Red
                      </span>
                      <span className="border border-[#495F75]  px-2 rounded text-xs">
                        25X12
                      </span>
                    </div>

                    <div>
                      <span className="bg-[#EFEFEF] text-[#686868] py-1 px-3 rounded-md text-sm ">
                        Quantity{" "}
                        <span className="text-black">
                          {" "}
                          {data.item.quantity}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col text-sm space-y-2 p-[12px] border rounded-md border-[#D5E5F5] mt-6 bg-[#F5F8FA]">
              <span className=" font-medium">
                {" "}
                {isExchange ? "Exchange Reason" : "Return Reason"}
              </span>
              <span className="text-[#1C1C1C] border-l-2 border-[#686868] pl-2">
                {data.returnReason}
              </span>
            </div>

            {data.type === "Exchange" ? (
              <div className="w-full mt-6">
                <h3 className="text-base font-medium mb-2">Exchange Details</h3>
                <div className="flex items-start justify-between">
                  <div className="flex flex-col items-start justify-between space-y-3 text-[#686868] text-sm "></div>
                  <div className="flex items-center gap-3  w-full">
                    <div className="h-[90px] w-[90px] rounded overflow-hidden">
                      <img
                        className="h-full w-full object-cover"
                        src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D"
                        alt={data.item.productName}
                      />
                    </div>
                    <div className="space-y-3 min-w-0">
                      <div className="flex flex-col">
                        <span className="text-base">
                          {data.item.productName}
                        </span>
                        <span className="text-xs text-[#686868]">
                          SKU ID #{data.item.sku}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center justify-center gap-2 text-[#495F75]">
                          {" "}
                          <span className="border border-[#495F75]  px-2 rounded text-xs">
                            Red
                          </span>
                          <span className="border border-[#495F75]  px-2 rounded text-xs">
                            25X12
                          </span>
                        </div>

                        <div>
                          <span className="bg-[#EFEFEF] text-[#686868] py-1 px-3 rounded-md text-sm ">
                            Quantity{" "}
                            <span className="text-black">
                              {" "}
                              {data.item.quantity}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex flex-col items-start justify-between space-y-3 text-[#686868] text-sm ">
                      <p>New Order ID</p>
                      <p>Order Status</p>
                      <p>Payment Status</p>
                      <p>Order Date</p>
                      <p>Total Amount</p>
                    </div>
                    <div className="flex flex-col items-start justify-between space-y-3 text-[#1C1C1C] text-sm font-medium">
                      <span>#{data.exchangeDetails.newOrderId}</span>
                      <span>
                        {data.exchangeDetails.newOrderStatus || "Pending"}
                      </span>
                      <span>
                        {data.exchangeDetails.paymentStatus || "Pending"}
                      </span>
                      <span>
                        {data.exchangeDetails.orderDate || "2026-01-10"}
                      </span>
                      <span>₹{data.exchangeDetails.newPrice}</span>
                    </div>
                  </div>
                  <button className="hover:underline font-medium text-[#1C3753] mt-2">
                    View Order
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full mt-6">
                <h3 className="text-base font-medium mb-2">Return Proof</h3>

                <div
                  className="flex gap-3 overflow-x-auto scrollbar-hide w-full min-w-0 scroll-smooth
">
                  <div className="min-w-[140px] h-[100px] rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60"
                      alt="proof"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-[140px] h-[100px] rounded-lg overflow-hidden bg-gray-100 relative">
                    <video
                      muted
                      playsInline
                      src="https://www.pexels.com/video/assembly-line-852388/"
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white text-sm">
                        ▶
                      </div>
                    </div>
                  </div>

                  <div className="min-w-[140px] h-[100px] rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src="https://plus.unsplash.com/premium_photo-1679913792906-13ccc5c84d44?w=500&auto=format&fit=crop&q=60"
                      alt="proof"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-[140px] h-[100px] rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src="https://plus.unsplash.com/premium_photo-1679913792906-13ccc5c84d44?w=500&auto=format&fit=crop&q=60"
                      alt="proof"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* <div className="mt-2 h-1 w-24 bg-gray-300 rounded-full"></div> */}
              </div>
            )}

            <div>
              <div className="border-t pt-3 border-[#D5E5F5] mt-4">
                <div className="flex items-center gap-2 shrink-0 text-sm font-medium mb-2">
                  <span>Payment Summary</span>
                </div>
                <div className="w-full p-3 text-sm text-gray-600 border rounded-md space-y-2">
                  {/* Returned Item cost */}
                  <div className="flex items-center justify-between">
                    <span>Returned Item cost</span>
                    <span className="text-[#1C1C1C] font-medium">
                      ₹{data.item.price}
                    </span>
                  </div>

                  {/* Returned Shipping Cost */}
                  <div className="flex items-center justify-between">
                    <span>Shipping Cost</span>
                    <span className="text-[#1C1C1C] font-medium">
                      ₹{data.shippingCost || 0}
                    </span>
                  </div>

                  {/* Exchanged Item cost (if Exchange) */}
                  {data.type === "Exchange" && (
                    <>
                      <div className="flex items-center justify-between border-t pt-2">
                        <span>Exchanged Item cost</span>
                        <span className="text-[#1C1C1C] font-medium">
                          ₹{data.exchangeDetails.newPrice}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Shipping Cost</span>
                        <span className="text-[#1C1C1C] font-medium">
                          ₹{data.exchangeDetails.shippingCost || 0}
                        </span>
                      </div>
                    </>
                  )}

                  {/* Total refundable amount */}
                  <div className="flex items-center justify-between border-t pt-2">
                    <span>Total refundable amount</span>
                    <span className="text-[#1C1C1C] font-medium">
                      {data.type === "Exchange"
                        ? `₹${data.item.price + (data.shippingCost || 0) + data.exchangeDetails.newPrice + (data.exchangeDetails.shippingCost || 0)}`
                        : `₹${data.item.price + (data.shippingCost || 0)}`}
                    </span>
                  </div>
                </div>

                {/* Note for refund */}
                {data.type === "Return" || data.type === "Exchange" ? (
                  <div className="text-xs mt-1">
                    <span className="text-[#D53B35] text-sm">*</span>{" "}
                    <span>
                      Refund will be processed to the original payment method.
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className="w-[330px] shrink-0 border-l pl-6 space-y-4">
          <div className="space-y-2">
            <p className="">Order Details</p>
            <div className="flex items-start justify-between gap-6">
              <div className="flex flex-col items-start justify-between space-y-3 text-[#686868] text-sm ">
                <p>Order ID</p>
                <p>Order Status</p>
                <p>Payment Status</p>
                <p>Order Date</p>
                <p>Total Amount</p>
              </div>
              <div className="flex flex-col items-start justify-between space-y-3 text-[#1C1C1C] text-sm font-medium">
                <span>#{data.orderDetails.orderId}</span>
                <span>{data.orderDetails.orderStatus}</span>
                <span>{data.orderDetails.paymentStatus}</span>
                <span>{data.orderDetails.orderDate}</span>
                <span>₹{data.orderDetails.totalAmount}</span>
              </div>
            </div>
            <button className="hover:underline font-medium text-[#1C3753] mt-2">
              View Order
            </button>
          </div>

          {/* Customer Details */}
          <div className="space-y-2 border-t pt-2">
            <span className="text-sm font-medium">Customer Details</span>
            <div>
              <div className="flex items-center gap-4">
                <div className="w-[34px] h-[34px] overflow-hidden rounded-full">
                  <img
                    src="https://plus.unsplash.com/premium_photo-1675896084254-dcb626387e1e?w=500&auto=format&fit=crop&q=60"
                    alt="customer"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="flex flex-col text-sm">
                  <span className="font-medium">
                    {" "}
                    {data.customerDetails.name}
                  </span>
                  <span className="text-[#686868]">
                    {data.customerDetails.customerId}
                  </span>
                </div>
              </div>
              <div className="flex items-start justify-evenly gap-8 mt-3">
                <div className="flex flex-col items-start justify-between space-y-3 text-[#686868] text-sm w-full">
                  <span>Phone Number</span>
                  <span>Email</span>
                  <span>Address</span>
                </div>
                <div className="flex flex-col items-start justify-between space-y-3 text-[#1C1C1C] text-sm font-medium">
                  <span>{data.customerDetails.phone}</span>
                  <span>{data.customerDetails.email}</span>
                  <span>{data.customerDetails.address}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Shipping Details (Only after approval) */}
          {data.status === "Approved" && data.shippingDetails && (
            <div className="space-y-2 border-t pt-3">
              <span className="text-sm font-medium">Shipping Details</span>

              <div className="flex items-start justify-between gap-6">
                <div className="flex flex-col space-y-2 text-[#686868] text-sm">
                  <p>Courier</p>
                  <p>Tracking ID</p>
                  <p>Pickup Date</p>
                  <p>Estimated Delivery</p>
                  {/* <p>Status</p> */}
                </div>

                <div className="flex flex-col space-y-2 text-[#1C1C1C] text-sm font-medium">
                  <span>{data.shippingDetails.shippingPartner}</span>
                  <span>{data.shippingDetails.trackingId}</span>
                  <span>{data.shippingDetails.shippingStatus}</span>
                  <span>{data.shippingDetails.expectedDate}</span>
                  {/* <span className="text-[#1C3753]">
                    {data.shippingDetails.deliveryStatus}
                  </span> */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* button */}
      <div className="flex items-end justify-end pt-4 gap-3">
        {data.status !== "Approved" ? (
          <>
            <button
              onClick={() => setopenCancelModule(data.returnId)}
              className="px-4 py-1 rounded-md flex items-center justify-center text-[#1C3753] bg-white border border-[#1C3753]">
              Reject
            </button>
            <button
              onClick={() => (
                handleAcceptedOrders(data.returnId),
                setSelectedOrderId(null)
              )}
              className="px-4 py-1 rounded-md flex items-center justify-center text-white bg-[#1C3753]">
              {isExchange ? "Approve Exchange" : "Approve Return"}
            </button>
          </>
        ) : (
          <span className="px-4 py-1 rounded-md bg-green-100 text-green-600 text-sm font-medium">
            Approved
          </span>
        )}
      </div>
    </div>
  );
};

export default ReturnRequestedModule;
