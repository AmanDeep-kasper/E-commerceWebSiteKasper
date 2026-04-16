import { useState, useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";

import Breadcrumbs from "../components/Breadcrumbs";
import Filter from "../components/Filter";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";

import EmptyState from "../components/EmptyState";
import { PackageOpen } from "lucide-react";
import axiosInstance from "../api/axiosInstance";

function Product() {
  const [param, setParam] = useState("");
  const [color, setColor] = useState([]);
  const [items, setItems] = useState([]);
  const [originalItems, setOriginalItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { categoryName, subcategoryName } = useParams();
  const { state } = useLocation();
  const val = state;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axiosInstance.get("/product/all");
        // console.log("Product API Response:", res.data);

        let fetchedProducts = [];

        if (res.data?.success && res.data?.data) {
          fetchedProducts = res.data.data;
        } else if (Array.isArray(res.data)) {
          fetchedProducts = res.data;
        } else if (res.data?.products) {
          fetchedProducts = res.data.products;
        }

        // console.log("Fetched products:", fetchedProducts);
        let filteredProducts = fetchedProducts;

        if (categoryName) {
          const decodedCategory =
            decodeURIComponent(categoryName).toLowerCase();
          filteredProducts = fetchedProducts.filter((p) => {
            const productCategory = (
              p.categoryName ||
              p.category?.name ||
              ""
            ).toLowerCase();
            return productCategory === decodedCategory;
          });
          // console.log(
          //   `Filtered by category "${decodedCategory}":`,
          //   filteredProducts.length,
          //   "products",
          // );
        }

        if (subcategoryName && filteredProducts.length > 0) {
          const decodedSubcategory =
            decodeURIComponent(subcategoryName).toLowerCase();
          filteredProducts = filteredProducts.filter((p) => {
            const productSubcategory = (
              p.subcategoryName ||
              p.subcategory?.name ||
              ""
            ).toLowerCase();
            return productSubcategory === decodedSubcategory;
          });
          console.log(
            `Filtered by subcategory "${decodedSubcategory}":`,
            filteredProducts.length,
            "products",
          );
        }

        setItems(filteredProducts);
        setOriginalItems(filteredProducts);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName, subcategoryName]);

  const colors = useMemo(() => {
    const uniqueColors = new Set();

    originalItems.forEach((item) => {
      if (item.variants && Array.isArray(item.variants)) {
        item.variants?.forEach((variant) => {
          if (variant.variantColor) {
            uniqueColors.add(variant.variantColor.toLowerCase());
          }
        });
      }
    });

    return [...uniqueColors].map((colorName) => ({ colorName }));
  }, [originalItems]);

  const sort = (val) => {
    let sortedItems = [...items];

    switch (val) {
      case "high":
        sortedItems.sort(
          (a, b) => (b.defaultPrice || 0) - (a.defaultPrice || 0),
        );
        break;

      case "low":
        sortedItems.sort(
          (a, b) => (a.defaultPrice || 0) - (b.defaultPrice || 0),
        );
        break;

      case "atoz":
        sortedItems.sort((a, b) =>
          (a.name || a.productTittle || "").localeCompare(
            b.name || b.productTittle || "",
          ),
        );
        break;

      // case "rating":
      //   sortedItems.sort((a, b) => {
      //     const avgA =
      //       Array.isArray(a.reviews) && a.reviews.length > 0
      //         ? a.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
      //           a.reviews.length
      //         : 0;

      //     const avgB =
      //       Array.isArray(b.reviews) && b.reviews.length > 0
      //         ? b.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
      //           b.reviews.length
      //         : 0;

      //     return avgB - avgA;
      //   });
      //   break;

      case "rating":
        sortedItems.sort((a, b) => {
          const avgA = a.stats?.averageRating || 0;
          const avgB = b.stats?.averageRating || 0;
          return avgB - avgA;
        });
        break;

      case "latest":
        sortedItems.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        break;

      default:
        sortedItems = [...originalItems];
        break;
    }

    setItems(sortedItems);
  };

  const filterArts = items.filter((p) => {
    if (!param.trim()) return true;

    const search = param.toLowerCase();

    return (
      (p.name || p.productTittle || "").toLowerCase().includes(search) ||
      (p.categoryName || p.category?.name || "")
        .toLowerCase()
        .includes(search) ||
      (p.subcategoryName || p.subcategory?.name || "")
        .toLowerCase()
        .includes(search)
    );
  });

  const filteredArts = filterArts.filter(
    (p) =>
      !color.length ||
      p.variants?.some((v) => color.includes(v.variantColor?.toLowerCase())),
  );
  // get display names for breadcrumbs
  const displayCategory = categoryName ? decodeURIComponent(categoryName) : "";
  const displaySubcategory = subcategoryName
    ? decodeURIComponent(subcategoryName)
    : "";

  return (
    <>
      <Navbar />
      <Breadcrumbs
        category={displayCategory}
        subcategory={displaySubcategory}
      />

      <div className="lg:px-20 md:px-[60px] px-4 pb-[23px] lg:flex gap-4 bg-gray-50" style={{paddingTop:'100px'}}>
        <Filter
          setParam={setParam}
          val={val}
          colors={colors}
          setColor={setColor}
          sort={sort}
        />

        <div className="flex-1 lg:gap-6 items-start">
          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredArts.length === 0 ? (
            <EmptyState
              heading="No Products Found"
              description="We couldn’t find any products matching your filters. Try adjusting your search or explore all products."
              icon={PackageOpen}
              ctaLabel="Reset Filters"
              onClick={() => {
                setParam("");
                setColor([]);
                setItems(originalItems);
              }}
            />
          ) : (
            <Card cardData={filteredArts} />
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Product;
