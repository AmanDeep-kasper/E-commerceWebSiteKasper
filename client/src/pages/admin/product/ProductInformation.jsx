import React, { use, useMemo } from "react";
import { useParams } from "react-router";
import products from "../../../data/products.json";
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
} from "lucide-react";

function ProductInformation() {
  //   const product = {
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

  const { uuid } = useParams();

  const product = useMemo(() => products.find((p) => p.uuid == uuid), [uuid]);
  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">
      {/* Header with icon */}
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Product Information</h2>
      </div>

      {/* Product Info */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={product.image[0]}
          alt={product.title}
          className="w-14 h-14 rounded object-cover"
        />
        <div>
          <h3 className="text-sm font-medium">{product.title}</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-gray-500">
            <Tag className="w-4 h-4" />
            <span>Category</span>
          </div>
          <p className="font-medium">{product.category}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-gray-500">
            <Tag className="w-4 h-4" />
            <span>Subcategory</span>
          </div>
          <p className="font-medium">{product.subcategory}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-gray-500">
            <Database className="w-4 h-4" />
            <span>SKU</span>
          </div>
          <p className="font-medium">{product.SKU}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-gray-500">
            <Tag className="w-4 h-4" />
            <span>Tags</span>
          </div>
          <p className="font-medium">{product.tags[0]}</p>
        </div>
      </div>

      <hr className="my-6 border-gray-200" />

      {/* Product Specs */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Box className="w-5 h-5" />
          <h2 className="text-sm font-semibold">Products Specs</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <Box className="w-4 h-4" />
              <span>Product Size</span>
            </div>
            <p className="font-medium">{product.dimension}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <IndianRupee className="w-4 h-4" />
              <span>Amazon Price (₹)</span>
            </div>
            <p className="font-medium">{product.amazonPrice}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <Percent className="w-4 h-4" />
              <span>Discount (%)</span>
            </div>
            <p className="font-medium">{product.discountPercent}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <Type className="w-4 h-4" />
              <span>Material Type</span>
            </div>
            <p className="font-medium">{product.materialType[0]}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <IndianRupee className="w-4 h-4" />
              <span>Base Price (₹)</span>
            </div>
            <p className="font-medium">{product.basePrice}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <Database className="w-4 h-4" />
              <span>Stock Status</span>
            </div>
            <p className="font-medium">
              {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <Palette className="w-4 h-4" />
              <span>Color</span>
            </div>
            <p className="font-medium">{product.color[0]}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <Database className="w-4 h-4" />
              <span>Stock Quantity</span>
            </div>
            <p className="font-medium">{product.stockQuantity}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <RefreshCw className="w-4 h-4" />
              <span>Return Policy</span>
            </div>
            <p className="font-medium">{product.returnPolicy}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <Scale className="w-4 h-4" />
              <span>Weight</span>
            </div>
            <p className="font-medium">{product.weight}</p>
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

export default ProductInformation;
