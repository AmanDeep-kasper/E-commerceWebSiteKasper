import React, { use, useMemo } from "react";
import { useParams } from "react-router";
import orders from "../../../data/orders.json";
import AdminSidebar from "../components/AdminSidebar";
import Header from "../components/Header";
import {
  Package,
  User,
  ShoppingCart,
  CreditCard,
  Calendar,
  Truck,
  MapPin,
  FileText,
  IndianRupee,
  Hash,
  Edit3,
  Trash2,
} from "lucide-react";

function OrderInformation() {
  //   const order = {
  //     name: "Adiyogi Shiva Metal Wall Art",
  //     category: "Spiritual & Religious",
  //     subcategory: "Lord Shiva",
  //     sku: "ASM65UF",
  //     tags: "Bestseller",
  //     size: "60L x 60W cm",
  //     material: "Metal",
  //     color: "Black",
  //     amazonPrice: "₹2,500",
  //     basePrice: "₹2,030",
  //     discount: "66%",
  //     stockStatus: "In stock",
  //     stockQty: "100",
  //     returnPolicy: "14 Days",
  //     weight: "300 gm",
  //     type: "Unframed",
  //   };

  const { orderId } = useParams();

  const order = useMemo(
    () => orders.find((p) => p.orderId == orderId),
    [orderId]
  );
  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">
      {/* Header with icon */}
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Order Information</h2>
      </div>

      {/* Customer Info */}
      <div className="flex items-center gap-4 mb-6">
        {order.image ? (
          <img
            src={order.image}
            alt={order.deliveryAddress.name}
            className="w-14 h-14 rounded object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded bg-blue-500 flex items-center justify-center text-xl font-bold text-white">
            {order.deliveryAddress?.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-gray-500">
            <User className="w-4 h-4" />
            <span className="text-sm">Customer Name</span>
          </div>
          <h3 className="text-sm font-medium">{order.deliveryAddress.name}</h3>
        </div>
      </div>

      {/* Product Info */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="w-5 h-5" />
          <h2 className="text-sm font-semibold">Products</h2>
        </div>

        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.productId}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-gray-500">
                  <Hash className="w-4 h-4" />
                  <span>Quantity</span>
                </div>
                <p className="font-medium">{item.quantity}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-gray-500">
                  <IndianRupee className="w-4 h-4" />
                  <span>Price (₹)</span>
                </div>
                <p className="font-medium">
                  ₹{item.price.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-gray-500">
                  <IndianRupee className="w-4 h-4" />
                  <span>Subtotal (₹)</span>
                </div>
                <p className="font-medium">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="my-6 border-gray-200" />

      {/* Order Specs */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5" />
          <h2 className="text-sm font-semibold">Order Details</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <Hash className="w-4 h-4" />
              <span>Order ID</span>
            </div>
            <p className="font-medium">{order.orderId}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <IndianRupee className="w-4 h-4" />
              <span>Total Amount (₹)</span>
            </div>
            <p className="font-medium">
              ₹{order.totalAmount.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <CreditCard className="w-4 h-4" />
              <span>Payment Method</span>
            </div>
            <p className="font-medium">{order.paymentMethod}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <CreditCard className="w-4 h-4" />
              <span>Payment Status</span>
            </div>
            <p className="font-medium">{order.paymentStatus}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <Package className="w-4 h-4" />
              <span>Order Status</span>
            </div>
            <p className="font-medium">{order.orderStatus}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Order Date</span>
            </div>
            <p className="font-medium">
              {new Date(order.orderDate).toLocaleDateString()}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Delivery Date</span>
            </div>
            <p className="font-medium">
              {new Date(order.deliveryDate).toLocaleDateString()}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <Truck className="w-4 h-4" />
              <span>Tracking ID</span>
            </div>
            <p className="font-medium">{order.trackingId}</p>
          </div>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5" />
          <h2 className="text-sm font-semibold">Delivery Address</h2>
        </div>

        <div className="text-sm p-4 border rounded-lg bg-gray-50">
          <div className="space-y-2">
            <p className="font-medium">{order.deliveryAddress.name}</p>
            <p>{order.deliveryAddress.mobile}</p>
            <p>{order.deliveryAddress.addressLine1}</p>
            {order.deliveryAddress.addressLine2 && (
              <p>{order.deliveryAddress.addressLine2}</p>
            )}
            <p>
              {order.deliveryAddress.city}, {order.deliveryAddress.state} -{" "}
              {order.deliveryAddress.pincode}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-8 flex items-center justify-end gap-2">
        <button className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">
          <Edit3 className="w-4 h-4" />
          Edit
        </button>
        <button className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm bg-amber-500 text-white hover:bg-amber-600">
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
}

export default OrderInformation;
