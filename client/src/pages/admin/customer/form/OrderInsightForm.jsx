import React, { useState } from "react";
import { ChevronDown, Calendar } from "lucide-react";

const Label = ({ children }) => (
  <label className="text-[13px] font-medium text-gray-700">{children}</label>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 ${className}`}
    {...props}
  />
);

const Select = ({ options, value, onChange, placeholder }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className="w-full h-9 appearance-none rounded-md border border-gray-300 bg-white px-3 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
  </div>
);

const DateInput = ({ value, onChange }) => (
  <div className="relative">
    <Input type="text" value={value} onChange={onChange} />
    <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
  </div>
);

function OrderInsightForm() {
  const [form, setForm] = useState({
    totalOrders: "12",
    totalSpend: "₹18,450",
    avgOrderValue: "₹1,537.50",
    refundCount: "02",
    failedPayments: "0",
    discountUsage: "5 times",
    deliveryRate: "92%",
    shipping: "Delhi, Noida",
    paymentMethod: "UPI (Razorpay)",
    orderFrequency: "Every 35 days",
    lastOrderValue: "₹2,030",
    cancelledOrders: "01",
    firstOrderDate: "12 Feb 2025",
    lastOrderDate: "14 Jul 2025",
    mostProduct: "Adiyogi Shiva 60×60 cm",
    topCategory: "Spiritual & Religious",
    cartAbandon: "1 in 6 sessions",
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="p-4 lg:p-6">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Total Orders</Label>
          <Input
            value={form.totalOrders}
            onChange={(e) => update("totalOrders", e.target.value)}
          />
        </div>
        <div>
          <Label>First Order Date</Label>
          <DateInput
            value={form.firstOrderDate}
            onChange={(e) => update("firstOrderDate", e.target.value)}
          />
        </div>
        <div>
          <Label>Last Order Date</Label>
          <DateInput
            value={form.lastOrderDate}
            onChange={(e) => update("lastOrderDate", e.target.value)}
          />
        </div>

        <div>
          <Label>Total Spend ( ₹ )</Label>
          <Input
            value={form.totalSpend}
            onChange={(e) => update("totalSpend", e.target.value)}
          />
        </div>
        <div>
          <Label>Avg. Order Value</Label>
          <Input
            value={form.avgOrderValue}
            onChange={(e) => update("avgOrderValue", e.target.value)}
          />
        </div>
        <div>
          <Label>Order Frequency</Label>
          <Input
            value={form.orderFrequency}
            onChange={(e) => update("orderFrequency", e.target.value)}
          />
        </div>

        <div>
          <Label>Most Purchased Product</Label>
          <Select
            value={form.mostProduct}
            onChange={(e) => update("mostProduct", e.target.value)}
            options={[
              "Adiyogi Shiva 60×60 cm",
              "Tree of Life",
              "Custom Name Plate",
            ]}
          />
        </div>
        <div>
          <Label>Top Category Purchased</Label>
          <Select
            value={form.topCategory}
            onChange={(e) => update("topCategory", e.target.value)}
            options={[
              "Spiritual & Religious",
              "Nature & Wildlife",
              "Typography & Quotes",
            ]}
          />
        </div>
      </div>

      <hr className="my-5 border-gray-200" />

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Refund / Return Count</Label>
          <Input
            value={form.refundCount}
            onChange={(e) => update("refundCount", e.target.value)}
          />
        </div>
        <div>
          <Label>Failed Payment Attempts</Label>
          <Input
            value={form.failedPayments}
            onChange={(e) => update("failedPayments", e.target.value)}
          />
        </div>
        <div>
          <Label>Discount Code Usage</Label>
          <Input
            value={form.discountUsage}
            onChange={(e) => update("discountUsage", e.target.value)}
          />
        </div>

        <div>
          <Label>Delivery Success Rate</Label>
          <Input
            value={form.deliveryRate}
            onChange={(e) => update("deliveryRate", e.target.value)}
          />
        </div>
        <div>
          <Label>Shipping Location(s)</Label>
          <Input
            value={form.shipping}
            onChange={(e) => update("shipping", e.target.value)}
          />
        </div>
        <div>
          <Label>Cart Abandonment Rate</Label>
          <Input
            value={form.cartAbandon}
            onChange={(e) => update("cartAbandon", e.target.value)}
          />
        </div>

        <div>
          <Label>Preferred Payment Method</Label>
          <Select
            value={form.paymentMethod}
            onChange={(e) => update("paymentMethod", e.target.value)}
            options={["UPI (Razorpay)", "Credit Card", "PayPal"]}
          />
        </div>
        <div>
          <Label>Cancelled Orders</Label>
          <Input
            value={form.cancelledOrders}
            onChange={(e) => update("cancelledOrders", e.target.value)}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-end gap-2">
        <button className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-3 py-1.5 text-sm text-white hover:bg-amber-600">
          Save
        </button>
        <button className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">
          Reset Form
        </button>
      </div>
    </div>
  );
}

export default OrderInsightForm;
