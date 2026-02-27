import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { cancelOrder, updateOrderStatus } from "../redux/cart/orderSlice";
import { Link, useNavigate, useParams } from "react-router";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { div } from "framer-motion/m";
import { ChevronLeft } from "lucide-react";
import { toWords } from "number-to-words";
import logo from "../assets/IconsUsed/HomeMainLogo.png";

// Helpers

const safeText = (v, fallback = "--") => {
  if (v === null || v === undefined) return fallback;
  const s = String(v);
  return s.trim() ? s : fallback;
};

const formatDate = (dateLike) => {
  if (!dateLike) return "--";
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return "--";
  return d.toLocaleDateString("en-GB"); // dd/mm/yyyy
};

const drawBox = (doc, x, y, w, h) => {
  doc.setDrawColor(220);
  doc.setLineWidth(0.2);
  doc.rect(x, y, w, h);
};

const drawTitle = (doc, title, x, y) => {
  doc.setFontSize(9.5);
  doc.setTextColor(70);
  doc.setFont("helvetica", "bold");
  doc.text(title, x, y);
  doc.setFont("helvetica", "normal");
};

const printLines = (doc, lines, x, y, maxWidth, lineHeight = 5) => {
  let cursorY = y;
  lines.forEach((line) => {
    const wrapped = doc.splitTextToSize(line, maxWidth);
    doc.text(wrapped, x, cursorY);
    cursorY += wrapped.length * lineHeight;
  });
  return cursorY;
};

const countWrappedLines = (doc, lines, maxWidth) => {
  return lines.reduce((sum, line) => {
    const wrapped = doc.splitTextToSize(line, maxWidth);
    return sum + wrapped.length;
  }, 0);
};

const money = (n) => {
  const val = Number(n || 0);
  return `Rs. ${val.toLocaleString("en-IN")}`;
};

// ======================
// PDF Generator
// ======================
export const generateInvoice = (order) => {
  const doc = new jsPDF("p", "mm", "a4");

  const pageW = doc.internal.pageSize.getWidth(); // ~210
  const pageH = doc.internal.pageSize.getHeight(); // ~297

  const left = 10;
  const right = pageW - 10;
  const contentW = right - left;

  // =========================
  // 1) HEADER
  // =========================
  drawBox(doc, left, 10, contentW, 18);

  doc.setFont("helvetica", "bold");
  // doc.setFontSize(14);
  // doc.setTextColor(25);
  // doc.text("LAZERCUT", left + 10, 22);
  doc.addImage(logo, "PNG", left + 5, 16, 37, 9);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("TAX INVOICE", right - 2, 22, { align: "right" });

  // =========================
  // 2) SOLD BY + INVOICE DETAILS BOX
  // =========================
  const box1Y = 30;
  const box1H = 50;
  drawBox(doc, left, box1Y, contentW, box1H);

  const midBox1 = left + contentW / 2;
  doc.setDrawColor(230);
  doc.line(midBox1, box1Y, midBox1, box1Y + box1H);

  drawTitle(doc, "Sold by", left + 2, box1Y + 8);
  drawTitle(doc, "Invoice Details", midBox1 + 2, box1Y + 8);

  doc.setFontSize(9);
  doc.setTextColor(40);

  // Sold by (left)
  let y = box1Y + 15;
  const soldX = left + 2;

  doc.text("Name: LAZERCUT Pvt. Ltd", soldX, y);
  y += 5;
  doc.text("Address: 123, Business Park,", soldX, y);
  y += 4.5;
  doc.text("Sector-18, Gurugram,", soldX, y);
  y += 4.5;
  doc.text("Haryana - 122015", soldX, y);
  y += 5;
  doc.text("Phone No.: +91 5637573656", soldX, y);
  y += 5;
  doc.text("Email: support@lasercut.com", soldX, y);
  y += 5;
  doc.text("GSTIN: 06AAAAA0000A1Z5", soldX, y);

  // Invoice details (right)
  const invX = midBox1 + 2;
  let y2 = box1Y + 15;

  const invoiceNo =
    order?.invoiceNo ||
    `INV-${formatDate(order?.orderDate).replaceAll("/", "-")}-${safeText(
      order?.orderId,
      "0000",
    )}`.slice(0, 20);

  doc.text(`Invoice No.: ${safeText(invoiceNo)}`, invX, y2);
  y2 += 5;
  doc.text(
    `Invoice Date: ${formatDate(order?.invoiceDate || order?.orderDate)}`,
    invX,
    y2,
  );
  y2 += 5;
  doc.text(`Order ID: ${safeText(order?.orderId)}`, invX, y2);
  y2 += 5;
  doc.text(`Order Date: ${formatDate(order?.orderDate)}`, invX, y2);
  y2 += 5;
  doc.text(
    `Payment Status: ${safeText(order?.paymentStatus, "Paid")}`,
    invX,
    y2,
  );

  // =========================
  // 3) BILLING + SHIPPING BOX (AUTO HEIGHT)
  // =========================
  const box2Y = box1Y + box1H + 5;
  const midX = left + contentW / 2;

  const col1X = left + 2;
  const col2X = midX + 2;
  const colW = contentW / 2 - 6;

  const billing = order?.billingAddress || order?.deliveryAddress || {};
  const shipping = order?.deliveryAddress || {};

  const buildAddrLines = (a) => {
    const name = safeText(a.fullName || a.name);
    const street = safeText(a.street || a.addressLine1 || a.address);
    const city = safeText(a.city);
    const state = safeText(a.state);
    const zip = safeText(a.zip ?? a.pincode);
    const country = safeText(a.country, "");
    const phone = safeText(a.mobile || a.phone);

    return [
      `Name: ${name}`,
      `Address: ${street}${country ? `, ${country}` : ""}`,
      `${city}, ${state} - ${zip}`,
      `Phone No.: ${phone}`,
    ];
  };

  const billLines = buildAddrLines(billing);
  const shipLines = buildAddrLines(shipping);

  doc.setFontSize(9);
  const billCount = countWrappedLines(doc, billLines, colW);
  const shipCount = countWrappedLines(doc, shipLines, colW);
  const maxLines = Math.max(billCount, shipCount);

  const box2H = 15 + maxLines * 5 + 6;
  drawBox(doc, left, box2Y, contentW, box2H);
  doc.setDrawColor(230);
  doc.line(midX, box2Y, midX, box2Y + box2H);

  drawTitle(doc, "Billing Address", left + 2, box2Y + 8);
  drawTitle(doc, "Shipping Address", midX + 2, box2Y + 8);

  printLines(doc, billLines, col1X, box2Y + 15, colW);
  printLines(doc, shipLines, col2X, box2Y + 15, colW);

  // =========================
  // 4) ITEMS TABLE (AUTO-FIT: NO WIDTH ERROR)
  // =========================
  const tableY = box2Y + box2H + 5;

  const CGST_RATE = Number(order?.taxRates?.cgst ?? 9);
  const SGST_RATE = Number(order?.taxRates?.sgst ?? 9);

  const items = order?.items || [];

  const rows = items.map((it, i) => {
    const qty = Number(it.quantity ?? it.Quantity ?? 1);
    const unit = Number(it.price ?? it.unitPrice ?? 0);
    const net = qty * unit;

    const cgstAmt = (net * CGST_RATE) / 100;
    const sgstAmt = (net * SGST_RATE) / 100;
    const taxAmt = cgstAmt + sgstAmt;
    const total = net + taxAmt;

    return [
      i + 1,
      safeText(it.name),
      money(unit),
      qty,
      money(net),
      `${CGST_RATE + SGST_RATE}%`,
      "CGST+SGST",
      money(Math.round(taxAmt)),
      money(Math.round(total)),
    ];
  });

  autoTable(doc, {
    startY: tableY,
    margin: { left, right: left }, // ✅ keep inside page
    tableWidth: "auto", // ✅ auto-fit

    head: [
      [
        "S. No.",
        "Product Description",
        "Unit Price",
        "QTY",
        "Net Amount",
        "Tax Rate",
        "Tax Type",
        "Tax Amount",
        "Total",
      ],
    ],
    body: rows,

    styles: {
      fontSize: 7.5,
      cellPadding: 1.5,
      overflow: "linebreak",
      cellWidth: "wrap",
      lineColor: 230,
      lineWidth: 0.2,
      textColor: 40,
    },

    headStyles: {
      fillColor: [245, 245, 245],
      textColor: 40,
      fontStyle: "bold",
    },

    columnStyles: {
      0: { halign: "center" },
      3: { halign: "center" },
    },
  });

  // =========================
  // 5) TOTALS + WORDS + SIGNATURE
  // =========================
  const endY = doc.lastAutoTable.finalY + 6;

  // If table is too near bottom, move to new page
  const footerBlockH = 42; // box + footer spacing
  if (endY + footerBlockH > pageH - 10) {
    doc.addPage();
  }

  const finalY = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 6 : 20;

  drawBox(doc, left, finalY, contentW, 40);

  const netTotal = items.reduce((sum, it) => {
    const qty = Number(it.quantity ?? it.Quantity ?? 1);
    const unit = Number(it.price ?? it.unitPrice ?? 0);
    return sum + qty * unit;
  }, 0);

  const cgstTotal = (netTotal * CGST_RATE) / 100;
  const sgstTotal = (netTotal * SGST_RATE) / 100;
  const taxTotal = cgstTotal + sgstTotal;
  const grandTotal = Math.round(netTotal + taxTotal);

  // Left: words
  doc.setFontSize(9);
  doc.setTextColor(40);

  doc.setFont("helvetica", "bold");
  doc.text("Amount in words:", left + 2, finalY + 10);
  doc.setFont("helvetica", "normal");

  const words =
    order?.amountInWords && String(order.amountInWords).trim()
      ? String(order.amountInWords).trim()
      : `${toWords(grandTotal)} rupees only`;

  const wordsWrapped = doc.splitTextToSize(
    words.charAt(0).toUpperCase() + words.slice(1),
    contentW - 85, // leave room for right block
  );

  doc.text(wordsWrapped, left + 2, finalY + 16);

  // Right: GST totals
  const rightBlockX = right - 72 - 2;

  doc.setFont("helvetica", "normal");
  doc.text(`CGST: ${money(Math.round(cgstTotal))}`, rightBlockX, finalY + 10);
  doc.text(`SGST: ${money(Math.round(sgstTotal))}`, rightBlockX, finalY + 15);
  doc.text(
    `Total GST: ${money(Math.round(taxTotal))}`,
    rightBlockX,
    finalY + 20,
  );

  doc.setFont("helvetica", "bold");
  doc.text(`Grand Total: ${money(grandTotal)}`, rightBlockX, finalY + 26);

  // Signature: right aligned
  const signRight = right - 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("For LAZERCUT Pvt. Ltd", signRight, finalY + 34, { align: "right" });

  doc.setDrawColor(120);
  doc.line(signRight - 65, finalY + 39, signRight, finalY + 39);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text("Authorized Signatory", signRight, finalY + 44, { align: "right" });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text("Terms & Conditions", pageW / 2, finalY + 48, { align: "center" });

  doc.save(`Invoice_${safeText(order?.orderId, "order")}.pdf`);
};

const OrderDetail = () => {
  const dispatch = useDispatch();

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
  const [openCancelModal, setOpenCancelModal] = useState(false);

  // status in admin
  const paidStatuses = ["paid", "success", "completed"];
  const isPaid = paidStatuses.includes(
    String(order.paymentStatus || "").toLowerCase(),
  );

  const isCOD = String(order.paymentMethod || "").toLowerCase() === "cod";

  // item/order cancelled?
  const hasAnyCancelledItem = (order.items || []).some(
    (it) => Number(it.cancelledQty || 0) > 0 || it.itemStatus === "Cancelled",
  );

  const isOrderCancelled =
    String(order.orderStatus || "").toLowerCase() === "cancelled";

  return (
    <div className="w-full p-6 sm:p-10 bg-white shadow rounded-lg font-inter">
      {/* model */}
      {openCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[92%] max-w-md rounded-xl bg-white p-5 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900">
              Cancel Order?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to cancel this order? This action can’t be
              undone.
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setOpenCancelModal(false)}
                className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
              >
                No, Keep Order
              </button>

              <button
                onClick={() => {
                  // dispatch(cancelOrder(order.orderId));
                  setOpenCancelModal(false);
                  navigate(`/accounts/order-detail/${orderId}/cancel`);
                }}
                className="px-4 py-2 rounded-lg bg-[#D53B35] text-white text-sm hover:bg-[#b92f2a]"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}

      <div className="border-b pb-4 mb-6 flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-800">
            <Link to="/accounts/order-history">
              {" "}
              <ChevronLeft className="w-8 h-8" />{" "}
            </Link>{" "}
            Order Details
          </h1>

          <div className="text-gray-600 mt-1 flex gap-2">
            <span>Order Placed on {formatDate(order.orderDate)}</span>
            <span>|</span>
            <span>Order {order.orderId}</span>
          </div>
        </div>
        <button
          onClick={() => generateInvoice(order)}
          className=" text-[#1C3753] px-6 py-2 border border-[#1C3753] rounded-lg text-sm hover:bg-[#1C3753] hover:text-white transition-colors"
        >
          Download Invoice
        </button>
      </div>

      {/* just change the status  */}
      <div className="my-4 p-3 border rounded-lg bg-gray-50 flex items-center gap-3">
        <p className="text-sm font-medium text-gray-700">
          DEV: Change Order Status
        </p>

        <select
          value={order.orderStatus}
          onChange={(e) =>
            dispatch(
              updateOrderStatus({
                orderId: order.orderId,
                orderStatus: e.target.value,
              }),
            )
          }
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="Placed">Placed</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Customer & Shipping */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8 pb-4 border-b">
        <div>
          <h2 className="font-medium text-lg mb-3">Delivery Address</h2>
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
        {/* Payment */}
        <div className="mb-8">
          <h2 className="font-medium text-lg mb-3">Payment Information</h2>
          <p>Method: {order.paymentMethod.toUpperCase()}</p>
          <p>Status: {order.paymentStatus}</p>
        </div>

        <div>
          <h2 className="font-medium text-lg mb-3">Payment Summary </h2>
          <div className="flex items-start justify-between mb-4">
            <div>
              <ul className="space-y-2">
                <li>Items:</li>
                <li className="text-[#00A63E]">Discounts:</li>
                <li>Platform Fee:</li>
                <li>Delivery Charges:</li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2">
                <li>{order.items?.length > 0 && "--"}</li>
                <li className="text-[#00A63E]">
                  {order.discount?.length > 0 && "--"}
                </li>
                <li>{order.fee ? order.fee : "--"}</li>
                <li>{order.deliverycharges ? order.deliverycharges : "--"}</li>
              </ul>
            </div>
          </div>
          <div className="flex items-center justify-between border-t pt-3 text-[16px] font-medium">
            <p>Total Amount</p>
            <span>{order.tatalAmout ? order.tatalAmout : "--"}</span>
          </div>
        </div>
      </div>
     
      {/* Items */}
      <div className="border p-3 rounded-lg">
        <h2 className="font-medium text-lg">Order Summary</h2>
        <div className="space-y-4">
          {/* {order.items.map((item, idx) => (
            <div className="flex items-start justify-between">
              <div key={idx} className="flex items-center gap-4  rounded-lg">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded border"
                />
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-gray-600 text-sm">
                    Color: {item.color ? item.color : "--"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Size: {item.size ? item.size : "--"}
                  </p>
                </div>
              </div>
              {Number(item.cancelledQty || 0) > 0 && (
                <p className="text-[12px] text-red-600">
                  Cancelled: {Number(item.cancelledQty)}
                </p>
              )}

              {item.itemStatus && (
                <p className="text-[12px] text-gray-600">
                  Status: <span className="font-medium">{item.itemStatus}</span>
                </p>
              )}
            </div>
          ))} */}

          {order.items.map((item, idx) => {
            const qty = Number(item.quantity ?? item.Quantity ?? 0);
            const cancelled = Number(item.cancelledQty ?? 0);

            // ✅ decide status even if itemStatus is missing
            const status =
              item.itemStatus ||
              (cancelled > 0 && qty === 0
                ? "Cancelled"
                : cancelled > 0 && qty > 0
                  ? "Partially Cancelled"
                  : "Active");

            return (
              <div key={idx} className="flex items-start justify-between">
                <div className="flex items-center gap-4 rounded-lg">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-gray-600 text-sm">
                      Color: {item.color || "--"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Size: {item.size || "--"}
                    </p>
                  </div>
                </div>

                {/* ✅ Right side info */}
                <div className="text-right">
                  <p className="text-[14px]">Qty: {qty}</p>

                  {cancelled > 0 && (
                    <p className="text-[12px] text-red-600">
                      Cancelled: {cancelled}
                    </p>
                  )}

                  <p className="text-[12px] text-gray-600">
                    Status: <span className="font-medium">{status}</span>
                  </p>
                </div>

                {/* ✅ Badge */}
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    status === "Cancelled"
                      ? "bg-red-50 text-red-600"
                      : status === "Partially Cancelled"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-green-50 text-green-700"
                  }`}
                >
                  {status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Tracker */}
      <div className="mt-8">
        <h2 className="font-medium text-lg mb-4">Order Status</h2>
        {/* Example tracker: Placed → Processing → Shipped → Delivered */}
        <div className="flex items-center gap-4 text-sm">
          {["Placed", "Processing", "Shipped", "Delivered", "Cancelled"].map(
            (status, i) => (
              <div key={i} className="flex items-center">
                <span
                  className={`w-4 h-4 rounded-full mr-2 
    ${
      order.orderStatus === "Cancelled"
        ? "bg-red-600" // Cancelled → Red
        : order.orderStatus === status ||
            (order.orderStatus === "Delivered" &&
              ["Placed", "Processing", "Shipped", "Delivered"].includes(status))
          ? "bg-green-600"
          : "bg-gray-300"
    }
  `}
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
            ),
          )}
        </div>
      </div>

      {/* Tracking Info */}
      {order.orderStatus !== "Delivered" && (
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          {order.orderStatus === "Shipped" && (
            <p className="text-gray-600 text-sm">
              Tracking ID:{" "}
              <span className="font-medium text-[#1C1C1C]">
                {order.trackingId ? order.trackingId : "--"}
              </span>
            </p>
          )}

          <span className="text-gray-400 hidden sm:block">|</span>

          <p className="text-gray-600 text-sm">
            Expected Delivery:{" "}
            <span className="font-medium text-[#1C1C1C]">
              {order.deliveryDate ? order.deliveryDate : "--"}
            </span>
          </p>
        </div>
      )}
      <div className="mt-2">
         {(isOrderCancelled || hasAnyCancelledItem) && (
        <div
          className={`mb-6 rounded-lg border p-4 text-sm ${
            isPaid && !isCOD
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-yellow-50 border-yellow-200 text-yellow-800"
          }`}
        >
          {isCOD ? (
            <p>
              Cancellation confirmed. Since this is <b>COD</b>, no refund is
              required.
            </p>
          ) : isPaid ? (
            <p>
              Cancellation confirmed. Payment was already received, so a{" "}
              <b>refund will be initiated</b>. Refund usually takes{" "}
              <b>5–7 business days</b>.
            </p>
          ) : (
            <p>
              Cancellation confirmed. Payment is not completed yet, so no refund
              is required.
            </p>
          )}
        </div>
      )}
      </div>
      {/* Actions */}
      <div className="flex flex-wrap gap-4 mt-6">
        {/* When Processing */}
        {order.orderStatus === "Processing" && (
          <>
            <button
              onClick={() => setOpenCancelModal(true)}
              className="bg-white text-[#D53B35] px-6 py-2 rounded-md border border-[#D53B35] text-sm hover:bg-[#c7625e] hover:text-white transition-colors"
            >
              Cancel Order
            </button>

            <button
              className="bg-[#1C3753] text-white px-6 py-2 rounded-md text-sm hover:bg-[#15314f] transition-colors"
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
              onClick={() => generateInvoice(order)}
              className="bg-gray-800 text-white px-6 py-2 rounded-full text-sm hover:bg-gray-900 transition-colors"
            >
              Download Invoice
            </button>
          </>
        )}

        {/* When Delivered */}
        {order.orderStatus === "Delivered" && (
          <>
            <Link
              to={`/accounts/order-detail/${orderId}/return`}
              className="bg-red-400 text-white px-6 py-2 rounded-md text-sm hover:bg-red-600 transition-colors"
            >
              Return / Replace
            </Link>
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
            *Refund will be initiated within 14 days after your return is picked
            up. Once we initiate your refund, it takes up to 7 days for your
            bank to credit the refund in your account.{" "}
            <span className="font-medium">{order.returnEligibleDate}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
