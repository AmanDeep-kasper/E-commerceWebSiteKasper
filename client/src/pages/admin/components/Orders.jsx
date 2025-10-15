// const InfoRow = ({ label, value }) => (
//   <div className="flex flex-col gap-0.5">
//     <span className="text-[13px] font-medium text-gray-700">{label}</span>
//     <span className="text-sm text-gray-900">{value}</span>
//   </div>
// );

// const Section = ({ children }) => (
//   <div className="grid grid-cols-2 gap-x-12 gap-y-5 py-4">{children}</div>
// );

// const Divider = () => <hr className="border-gray-200 my-2" />;

// function Orders({ customer }) {
//   return (
//     <div className="col-span-7 bg-gray-50 text-gray-900">
//       <div className="min-w-full">
//         <div className="bg-white border rounded-xl shadow-sm p-5 w-full">
//           <h2 className="text-sm font-semibold text-gray-900 mb-1">
//             Order Insights
//           </h2>

//           <Section>
//             <InfoRow label="Total Orders:" value={customer?.total_orders || "working"} />
//             <InfoRow
//               label="First Order Date:"
//               value={customer?.firstDate || "24 Aug"}
//             />
//             <InfoRow label="Total Spend:" value={customer.total_spent} />
//             <InfoRow
//               label="Last Order Date:"
//               value={customer.last_order_date}
//             />
//             <InfoRow
//               label="Avg. Order Value:"
//               value={customer?.avgValue || "24"}
//             />
//             <InfoRow
//               label="Most Purchased Product:"
//               value={customer?.mostProduct || "later"}
//             />
//             <InfoRow
//               label="Top Category Purchased:"
//               value={customer?.topCategory || "later"}
//             />
//           </Section>

//           <Divider />

//           <Section>
//             <InfoRow
//               label="Failed Payment Attempts:"
//               value={customer?.failedPayments || "fixed"}
//             />
//             <InfoRow
//               label="Discount Code Usage:"
//               value={customer?.discountUsage || "fixed"}
//             />
//             <InfoRow
//               label="Delivery Success Rate:"
//               value={customer?.deliveryRate || "fixed"}
//             />
//             <InfoRow label="Shipping Location(s):" value={customer.address} />
//             <InfoRow
//               label="Cart Abandonment Rate:"
//               value={customer?.cartAbandon || "fixed"}
//             />
//           </Section>

//           <Divider />

//           <Section>
//             <InfoRow
//               label="Preferred Payment Method:"
//               value={customer.preferred_payment_method}
//             />
//             <InfoRow label="Order Frequency:" value={customer.freq || "Most"} />
//             <InfoRow
//               label="Last Order Value:"
//               value={customer.lastValue || "20k"}
//             />
//             <InfoRow
//               label="Cancelled Orders:"
//               value={String(customer.cancelled || "4").padStart(2, "0")}
//             />
//           </Section>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Orders;

import {
  Package,
  Calendar,
  CreditCard,
  TrendingUp,
  ShoppingCart,
  Truck,
  XCircle,
  Star,
  MapPin,
  DollarSign,
} from "lucide-react";
import { Link, useOutletContext } from "react-router";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const InfoRow = ({ label, value, icon: Icon, trend, className = "" }) => (
  <div className={`flex flex-col gap-1 p-3 bg-gray-50 rounded-lg ${className}`}>
    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{label}</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-900">{value}</span>
      {trend && (
        <span
          className={`text-xs px-1.5 py-0.5 rounded-full ${
            trend.value > 0
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {trend.value > 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
        </span>
      )}
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mb-6 last:mb-0">
    {title && (
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide border-b pb-2 mb-4">
        {title}
      </h3>
    )}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

function Orders() {
  // Format currency values
  const { customer } = useOutletContext();
  const formatCurrency = (amount) => {
    if (!amount) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format percentages
  const formatPercent = (value) => {
    if (!value) return "0%";
    return `${value}%`;
  };

  return (
    <div className="col-span-7">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Insights
          </h2>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {customer?.total_orders || 0} Orders
          </span>
        </div>

        {/* Order Summary Section */}
        <Section title="Order Summary">
          <InfoRow
            label="Total Orders"
            value={customer?.total_orders || "0"}
            icon={Package}
            trend={{ value: 12 }}
          />
          <InfoRow
            label="Total Spend"
            value={formatCurrency(customer.total_spent)}
            icon={DollarSign}
            trend={{ value: 8 }}
          />
          <InfoRow
            label="Avg. Order Value"
            value={formatCurrency(customer?.avgValue || 0)}
            icon={TrendingUp}
          />
          <InfoRow
            label="Last Order Value"
            value={formatCurrency(customer.lastValue || 0)}
            icon={DollarSign}
          />
        </Section>

        {/* Order Timeline Section */}
        <Section title="Order Timeline">
          <InfoRow
            label="First Order Date"
            value={customer?.firstDate || "24 Aug 2023"}
            icon={Calendar}
          />
          <InfoRow
            label="Last Order Date"
            value={customer.last_order_date || "Recent"}
            icon={Calendar}
          />
          <InfoRow
            label="Order Frequency"
            value={customer.freq || "Every 2 weeks"}
            icon={Calendar}
          />
          <InfoRow
            label="Cancelled Orders"
            value={String(customer.cancelled || "0").padStart(2, "0")}
            icon={XCircle}
            className={customer.cancelled > 0 ? "bg-red-50" : ""}
          />
        </Section>

        {/* Product Insights Section */}
        <Section title="Product Insights">
          <InfoRow
            label="Most Purchased Product"
            value={customer?.mostProduct || "Classic T-Shirt"}
            icon={Star}
          />
          <InfoRow
            label="Top Category Purchased"
            value={customer?.topCategory || "Clothing"}
            icon={Package}
          />
          <InfoRow
            label="Cart Abandonment Rate"
            value={formatPercent(customer?.cartAbandon || "15")}
            icon={ShoppingCart}
            trend={{ value: -5 }}
          />
          <InfoRow
            label="Discount Code Usage"
            value={formatPercent(customer?.discountUsage || "25")}
            icon={CreditCard}
          />
        </Section>

        {/* Payment & Delivery Section */}
        <Section title="Payment & Delivery">
          <InfoRow
            label="Preferred Payment Method"
            value={customer.preferred_payment_method || "Credit Card"}
            icon={CreditCard}
          />
          <InfoRow
            label="Failed Payment Attempts"
            value={customer?.failedPayments || "2"}
            icon={XCircle}
            className={customer?.failedPayments > 0 ? "bg-red-50" : ""}
          />
          <InfoRow
            label="Delivery Success Rate"
            value={formatPercent(customer?.deliveryRate || "98")}
            icon={Truck}
            trend={{ value: 2 }}
          />
          <InfoRow
            label="Shipping Location(s)"
            value={customer.address || "Primary address"}
            icon={MapPin}
          />
        </Section>

        {/* Performance Metrics */}
        {/* <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
            Performance Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-700">
                {customer?.total_orders || 0}
              </div>
              <div className="text-xs text-gray-600">Total Orders</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-700">
                {formatCurrency(customer.total_spent)}
              </div>
              <div className="text-xs text-gray-600">Total Value</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <div className="text-xl font-bold text-amber-700">
                {formatPercent(customer?.deliveryRate || "98")}
              </div>
              <div className="text-xs text-gray-600">Success Rate</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-700">
                {formatPercent(customer?.cartAbandon || "15")}
              </div>
              <div className="text-xs text-gray-600">Abandon Rate</div>
            </div>
          </div>
        </div> */}
      </Card>
      <div className="flex items-center gap-2 justify-end mt-6">
        <Link to={'/admin/insight-form'} className="inline-flex items-center gap-2 border rounded-md px-3 py-1.5 text-sm hover:bg-gray-50">
          Edit
        </Link>
        <button className="inline-flex items-center gap-2 border rounded-md px-3 py-1.5 text-sm hover:bg-gray-50">
          Cancel
        </button>
        <button className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm bg-amber-500 text-white hover:bg-amber-600">
          Delete
        </button>
      </div>
    </div>
  );
}

export default Orders;
