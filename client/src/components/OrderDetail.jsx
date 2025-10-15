import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
// import orders from "../data/orders.json";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const generateInvoice = (order) => {
  const doc = new jsPDF();

  // === HEADER ===
  doc.setFontSize(22);
  doc.setTextColor(40);
  doc.text("LaserCut Metal Art", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("www.lasercut.com", 14, 26);
  doc.text("support@lasercut.com", 14, 31);
  doc.text("GSTIN: 27ABCDE1234F1Z5", 14, 36); // fake GST for demo

  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.text("INVOICE", 170, 20);

  // === ORDER DETAILS ===
  doc.setFontSize(12);
  doc.setTextColor(80);
  doc.text(`Order ID: ${order.orderId}`, 14, 50);
  doc.text(`Order Date: ${new Date(order.orderDate).toDateString()}`, 14, 56);
  doc.text(`Delivery Date: ${order.deliveryDate}`, 14, 62);
  doc.text(`Tracking ID: ${order.trackingId}`, 14, 68);

  // === CUSTOMER DETAILS ===
  const addr = order.deliveryAddress;
  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text("BILL TO:", 14, 80);

  doc.setFontSize(11);
  doc.setTextColor(80);
  doc.text(addr.fullName, 14, 86);
  doc.text(addr.mobile, 14, 92);
  doc.text(addr.email || "", 14, 98);
  doc.text(`${addr.street}`, 14, 104);
  doc.text(`${addr.city}, ${addr.state} - ${addr.pincode}`, 14, 110);

  // === PAYMENT INFO ===
  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text("PAYMENT:", 120, 80);

  doc.setFontSize(11);
  doc.setTextColor(80);
  doc.text(`Method: ${order.paymentMethod.toUpperCase()}`, 120, 86);
  doc.text(`Status: ${order.paymentStatus}`, 120, 92);

  // === ITEMS TABLE ===
  const tableData = order.items.map((item, i) => [
    i + 1,
    item.name,
    item.quantity,
    `${item.price.toLocaleString()}`,
    `${(item.quantity * item.price).toLocaleString()}`,
  ]);

  autoTable(doc, {
    head: [["#", "Item", "Qty", "Price", "Total"]],
    body: tableData,
    startY: 125,
    styles: { fontSize: 11, cellPadding: 3 },
    headStyles: { fillColor: [235, 177, 0] }, // amber
  });

  // === TOTAL ===
  const finalY = doc.lastAutoTable.finalY || 125;
  doc.setFontSize(13);
  doc.setTextColor(0);
  doc.text(
    `Total Price: ${order.totalAmount.toLocaleString()}`,
    190,
    finalY + 10,
    { align: "right" }
  );

  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`All values are in INR`, 190, finalY + 15, { align: "right" });

  // === FOOTER ===
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text("Thank you for shopping with LaserCut Metal Art!", 14, finalY + 30);
  doc.text(
    "This is a computer-generated invoice and does not require a signature.",
    14,
    finalY + 36
  );

  // SAVE
  doc.save(`Invoice_${order.orderId}.pdf`);
};

const OrderDetail = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const orders = useSelector((state) => state.order.list);
  const order = orders?.find((val) => val.orderId.slice(1) === orderId);

  if (!order) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading order details...
      </div>
    );
  }

  return (
    <div className="w-full p-6 sm:p-10 bg-white shadow rounded-lg font-inter">
      {/* Header */}
      <div className="border-b pb-4 mb-6">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
          Order {order.orderId}
        </h1>
        <p className="text-gray-600 mt-1">
          Placed on{" "}
          <span className="font-medium">{formatDate(order.orderDate)}</span> •{" "}
          <span
            className={`font-medium ${
              order.orderStatus === "Delivered"
                ? "text-green-600"
                : order.orderStatus === "Shipped"
                ? "text-blue-600"
                : "text-yellow-600"
            }`}
          >
            {order.orderStatus}
          </span>
        </p>
      </div>

      {/* Customer & Shipping */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="font-semibold text-lg mb-3">Customer Information</h2>
          <p className="text-gray-800">{order.deliveryAddress.name}</p>
          <p className="text-gray-800">{order.deliveryAddress.email}</p>
          <p className="text-gray-600">{order.deliveryAddress.phone}</p>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-3">Delivery Address</h2>
          <p className="text-gray-800">{order.deliveryAddress.street}</p>
          <p className="text-gray-600">
            {order.deliveryAddress.city}, {order.deliveryAddress.state} -{" "}
            {order.deliveryAddress.zip}
          </p>
          {order.deliveryAddress.landmark && (
            <p className="text-gray-500">
              Landmark: {order.deliveryAddress.landmark}
            </p>
          )}
        </div>
      </div>

      {/* Payment */}
      <div className="mb-8">
        <h2 className="font-semibold text-lg mb-3">Payment Information</h2>
        <p>Method: {order.paymentMethod.toUpperCase()}</p>
        <p>Status: {order.paymentStatus}</p>
      </div>

      {/* Items */}
      <div className="mb-8">
        <h2 className="font-semibold text-lg mb-4">Items Ordered</h2>
        <div className="space-y-4">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 border p-4 rounded-lg"
            >
              <img
                src={item.img[0]}
                alt={item.name}
                className="w-20 h-20 object-cover rounded border"
              />
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-gray-600 text-sm">
                  Quantity: {item.quantity}
                </p>
                <p className="text-gray-600 text-sm">
                  Price: ₹{item.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <div className="border-t pt-4">
        <p className="text-gray-700">Total Amount</p>
        <p className="text-xl font-semibold text-gray-900">
          ₹{order.totalAmount.toLocaleString()}
        </p>
      </div>

      {/* Status Tracker */}
      <div className="mt-8">
        <h2 className="font-semibold text-lg mb-4">Order Status</h2>
        {/* Example tracker: Placed → Processing → Shipped → Delivered */}
        <div className="flex items-center gap-4 text-sm">
          {["Placed", "Processing", "Shipped", "Delivered"].map((status, i) => (
            <div key={i} className="flex items-center">
              <span
                className={`w-4 h-4 rounded-full mr-2 ${
                  order.orderStatus === status ||
                  (order.orderStatus === "Delivered" &&
                    ["Placed", "Processing", "Shipped"].includes(status))
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
              ></span>
              <span
                className={`${
                  order.orderStatus === status
                    ? "font-medium text-gray-900"
                    : "text-gray-500"
                }`}
              >
                {status}
              </span>
              {i < 3 && <span className="mx-3 text-gray-400">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Tracking Info */}
      {order.orderStatus !== "Delivered" && (
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <p className="text-gray-600 text-sm">
            Tracking ID: <span className="font-medium">{order.trackingId}</span>
          </p>
          <p className="text-gray-600 text-sm">
            Expected Delivery:{" "}
            <span className="font-medium">{order.deliveryDate}</span>
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-4 mt-6">
        {/* When Processing */}
        {order.orderStatus === "Processing" && (
          <>
            <button className="bg-red-500 text-white px-6 py-2 rounded-full text-sm hover:bg-red-600 transition-colors">
              Cancel Order
            </button>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm hover:bg-blue-700 transition-colors"
              onClick={() =>
                navigate(`/order-history/${order.orderId.slice(1)}`)
              }
            >
              Track Order
            </button>
          </>
        )}

        {/* When Shipped */}
        {order.orderStatus === "Shipped" && (
          <>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm hover:bg-blue-700 transition-colors"
              onClick={() =>
                navigate(`/order-history/${order.orderId.slice(1)}`)
              }
            >
              Track Order
            </button>
            <button className="bg-gray-800 text-white px-6 py-2 rounded-full text-sm hover:bg-gray-900 transition-colors">
              Download Invoice
            </button>
          </>
        )}

        {/* When Delivered */}
        {order.orderStatus === "Delivered" && (
          <>
            <Link
              to={`/accounts/order-detail/${order.orderId}/return`}
              className="bg-red-500 text-white px-6 py-2 rounded-full text-sm hover:bg-red-600 transition-colors"
            >
              Return / Replace
            </Link>
            <button
              onClick={() => generateInvoice(order1)}
              className="bg-gray-800 text-white px-6 py-2 rounded-full text-sm hover:bg-gray-900 transition-colors"
            >
              Download Invoice
            </button>
          </>
        )}
      </div>

      {/* Extra Info when Delivered */}
      {order.orderStatus === "Delivered" && (
        <div className="mt-6 text-sm text-gray-600">
          <p>
            Delivered on{" "}
            <span className="font-medium">{order.deliveryDate}</span>
          </p>
          <p>
            Return eligible until{" "}
            <span className="font-medium">{order.returnEligibleDate}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
