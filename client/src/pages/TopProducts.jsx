import React, { useState, useEffect } from "react";
// import products from "../data/products.json";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import Breadcrumbs from "../components/Breadcrumbs";
import Filter from "../components/Filter";
import Footer from "../sections/Footer";
import Categories from "../components/Categories";
import FilterProducts from "../components/FilterProducts";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

// const topProducts = products
//   .filter((item) => {
//     if (!item.reviews || item.reviews.length === 0) return false;

//     const avgRating =
//       item.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
//       item.reviews.length;

//     item.avgRating = avgRating; // store avg rating for sorting
//     return avgRating >= 4;
//   })
//   .sort((a, b) => b.avgRating - a.avgRating) // sort by highest avg rating

function TopProducts() {
  const [items, setItems] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [param, setParam] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all collections and their products
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/collection/get-all-collections");
        // console.log("Collections response:", response.data);

        let collectionsData = [];
        if (response.data?.success && response.data?.data?.collections) {
          collectionsData = response.data.data.collections;
        } else if (Array.isArray(response.data)) {
          collectionsData = response.data;
        } else if (response.data?.collections) {
          collectionsData = response.data.collections;
        }

        // Extract all products from all collections
        const allCollectionProducts = [];
        collectionsData.forEach(collection => {
          if (collection.products && collection.products.length > 0) {
            collection.products.forEach(product => {
              // Add collection name to product for reference
              allCollectionProducts.push({
                ...product,
                collectionName: collection.collectionName,
                collectionId: collection._id
              });
            });
          }
        });

        // Calculate average rating for each product
        const productsWithRating = allCollectionProducts.map(product => {
          let avgRating = 0;
          if (product.reviews && product.reviews.length > 0) {
            avgRating = product.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / product.reviews.length;
          }
          return { ...product, avgRating };
        });

        // Filter products with rating >= 4 (top products)
        const topRatedProducts = productsWithRating.filter(product => product.avgRating >= 0);

        // Sort by highest rating
        const sortedProducts = topRatedProducts.sort((a, b) => b.avgRating - a.avgRating);

        setAllProducts(sortedProducts);
        setItems(sortedProducts);
        setError("");
      } catch (err) {
        // console.error("Error fetching collections:", err);
        setError(err.response?.data?.message || "Failed to load products");
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const sort = (val) => {
    let sortedItems = [...items];
    switch (val) {
      case "price_high":
        sortedItems.sort((a, b) => {
          const priceA = a.variants?.[0]?.variantSellingPrice || 0;
          const priceB = b.variants?.[0]?.variantSellingPrice || 0;
          return priceB - priceA;
        });
        break;
      case "price_low":
        sortedItems.sort((a, b) => {
          const priceA = a.variants?.[0]?.variantSellingPrice || 0;
          const priceB = b.variants?.[0]?.variantSellingPrice || 0;
          return priceA - priceB;
        });
        break;
      case "atoz":
        sortedItems.sort((a, b) => (a.productTittle || "").localeCompare(b.productTittle || ""));
        break;
      case "ztoa":
        sortedItems.sort((a, b) => (b.productTittle || "").localeCompare(a.productTittle || ""));
        break;

      case "rating":
        sortedItems.sort((a, b) => b.avgRating - a.avgRating);
        break;
      case "latest":
        sortedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        sortedItems.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;

      default:
        sortedItems = [...allProducts];
        break;
    }

    setItems(sortedItems);
  };

  return (
    <>
      <Navbar />
      {/* <Breadcrumbs category={product?.category} subcategory={product?.subcategory} title={product?.productTittle}/> */}
      <section className="lg:px-20 md:px-[60px] px-4 pb-[23px] bg-gray-50" style={{ paddingTop: "200px" }}>
        {/* <FilterProducts text={"Top Products"} sort={sort} /> */}

        <div className="flex lg:gap-6 items-start">
          {/* <div className="sticky top-4">
          </div> */}
          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : items.length > 0 ? (
            <Card cardData={items} />
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

export default TopProducts;
