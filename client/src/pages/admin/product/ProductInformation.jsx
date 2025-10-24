import React, { use, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
// import products from "../../../data/products.json";
import AdminSidebar from "../components/AdminSidebar";
import Header from "../components/Header";
import {
  Package,
  Tag,
  Box,
  IndianRupee,
  Percent,
  Palette,
  Database,
  RefreshCw,
  Scale,
  Type,
  Edit3,
  Trash2,
  ArrowLeft,
} from "lucide-react";

function ProductInformation() {
  // const { uuid } = useParams();
  const { sku } = useParams();

  // const product = useMemo(() => products.find((p) => p.sku == sku), [sku]);

  /////////////////////////
  const [variants, setVariants] = useState([
    { name: "Color", value: "Black", quantity: 20, reorder: 10 },
    { name: "Color", value: "Green", quantity: 20, reorder: 10 },
    { name: "Dimension", value: "60L x 80W cm", quantity: 20, reorder: 10 },
    { name: "Dimension", value: "55L x 35W cm", quantity: 20, reorder: 10 },
  ]);

  const [reviews, setReviews] = useState([
    {
      name: "Rajesh Sharma",
      rating: 5,
      comment: "Beautiful craftsmanship",
      date: "2 days ago",
    },
    {
      name: "Priya Kumari",
      rating: 4,
      comment: "Perfect for living room",
      date: "5 days ago",
    },
  ]);
  return (
    <div className="min-h-screen  bg-gray-50">
      {/* Header */}
      <div className="h-16 bg-white rounded-lg flex items-center justify-between gap-3 px-4">
        <Link to="/admin/products" className="flex items-center gap-2">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
          <h1 className="text-black text-xl font-semibold">Demo... Product</h1>
        </Link>
        <button className="bg-[#F8F8F8] px-5 py-1.5 border text-base rounded-lg">
          Edit
        </button>
      </div>

      {/* Product Info Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mt-4">
        {/* Left Section */}
        <div className="bg-white rounded-2xl border p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <h2 className="flex items-center gap-2 text-lg font-medium">
              <Package className="w-6 h-6 text-gray-700" />
              Basic Information
            </h2>
            <span className="bg-purple-100 px-3 py-1 rounded-full text-purple-700 text-sm font-medium">
              Framed
            </span>
          </div>

          <p className="text-[#797979] font-medium text-base"> Description</p>
          <p className="text-[#2C2C2C] font-medium text-base">
            Elegant laser-cut Lord Ganesha design symbolizing blessings and
            prosperity.
          </p>
          <div>
            <label className="block text-black text-sm font-medium mb-2">
              Product Image
            </label>
            <img
              src="https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=578"
              alt="Product"
              className="w-40 h-auto object-cover rounded-lg border border-neutral-200"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-white rounded-2xl border p-6 flex flex-col gap-4">
          <h2 className="text-black text-lg font-medium mb-2">
            Product Details
          </h2>

          <div className="grid grid-cols-3 gap-4">

            <div className="flex flex-wrap items-center justify-evenly">
              <div>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Variants Section */}
      <div className="mt-6 bg-white rounded-xl p-4">
        <h2 className="text-lg font-medium mb-2">Variants</h2>
        <table className="w-full border border-gray-200 rounded">
          <thead className="bg-gray-100">
            <tr>
              {["Name", "Value", "Quantity", "Reorder Limit"].map((col) => (
                <th key={col} className="text-left p-2">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {variants.map((variant, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{variant.name}</td>
                <td className="p-2">{variant.value}</td>
                <td className="p-2">{variant.quantity}</td>
                <td className="p-2">{variant.reorder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Reviews */}
      <div className="mt-6 bg-white rounded-xl p-4">
        <h2 className="text-lg font-medium mb-2">Customer Reviews</h2>
        {reviews.map((review, idx) => (
          <div key={idx} className="border-b border-gray-200 py-2">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">{review.name}</span>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>
            <div className="flex items-center gap-1 mb-1">
              {Array.from({ length: review.rating }).map((_, i) => (
                <div key={i} className="w-3 h-3 bg-yellow-400 rounded-sm" />
              ))}
            </div>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductInformation;
