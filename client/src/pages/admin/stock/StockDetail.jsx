import {
  Package,
  Tag,
  Box,
  IndianRupee,
  Database,
  RefreshCw,
  Edit3,
  Trash2,
} from "lucide-react";
import { Link, useParams } from "react-router";
import products from "../../../data/products.json"

function StockDetail() {
//   const stock = {
//     product: "Adiyogi Shiva",
//     category: "Spiritual & Religious",
//     sku: "SHIV001",
//     addQty: 15,
//     unitPrice: "₹2,030",
//     status: "In Stock",
//     updated: "15 Jun 2025",
//     units: 12,
//     reorder: 15,
//   };

  const {uuid} = useParams();

  const stock = products.find((p) => p.uuid === uuid)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 w-full">
        <div className="bg-white border rounded-xl shadow-sm p-6">
          {/* Header with icon */}
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Stock Information</h2>
          </div>

          {/* Product Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded bg-gray-200 flex items-center justify-center">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium">{stock.title}</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-gray-500">
                <Tag className="w-4 h-4" />
                <span>Product Name</span>
              </div>
              <p className="font-medium">{stock.title}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-gray-500">
                <Tag className="w-4 h-4" />
                <span>Category Name</span>
              </div>
              <p className="font-medium">{stock.category}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-gray-500">
                <Database className="w-4 h-4" />
                <span>SKU Code</span>
              </div>
              <p className="font-medium">{stock.SKU}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-gray-500">
                <Database className="w-4 h-4" />
                <span>Units in Stock</span>
              </div>
              <p className="font-medium">{stock.stockQuantity}</p>
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Stock Details */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Box className="w-5 h-5" />
              <h2 className="text-sm font-semibold">Stock Details</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-gray-500">
                  <Box className="w-4 h-4" />
                  <span>Add Quantity</span>
                </div>
                <p className="font-medium">{stock.stockQuantity}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-gray-500">
                  <IndianRupee className="w-4 h-4" />
                  <span>Unit Price</span>
                </div>
                <p className="font-medium">{stock.basePrice}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-gray-500">
                  <Database className="w-4 h-4" />
                  <span>Status</span>
                </div>
                <p className="font-medium">{stock.stockQuantity > 10 ? "In Stock": "Low Stock"}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-gray-500">
                  <Database className="w-4 h-4" />
                  <span>Reorder Level</span>
                </div>
                <p className="font-medium">{stock.stockQuantity}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-gray-500">
                  <RefreshCw className="w-4 h-4" />
                  <span>Last Updated</span>
                </div>
                <p className="font-medium">{stock?.updated || "today"}</p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex items-center justify-end gap-2">
            <Link
              to={"/admin/stock-form"}
              className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </Link>
            <button className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm bg-amber-500 text-white hover:bg-amber-600">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
    </div>
  );
}

export default StockDetail