import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import Breadcrumbs from "../components/Breadcrumbs";
import Filter from "../components/Filter";
import Footer from "../sections/Footer";
import Categories from "../components/Categories";
import FilterProducts from "../components/FilterProducts";
import axiosInstance from "../api/axiosInstance";
import { Skeleton } from "boneyard-js/react";

function NewProducts() {
  const [items, setItems] = useState([]);
  const [param, setParam] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const allProducts = useSelector((state) => state.products.product);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await axiosInstance.get("/product/all");
        const productData = res?.data?.data || res?.data?.products || [];

        setItems(Array.isArray(productData) ? productData : []);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const sort = (val) => {
    setItems((prev) => {
      const sorted = [...prev];
      switch (val) {
        case "high":
          return sorted.sort(
            (a, b) =>
              b.variants[0].variantSellingPrice -
              a.variants[0].variantSellingPrice,
          );

        case "low":
          return sorted.sort(
            (a, b) =>
              a.variants[0].variantSellingPrice -
              b.variants[0].variantSellingPrice,
          );

        case "atoz":
          return sorted.sort((a, b) =>
            (a.productTittle || "").localeCompare(b.productTittle || ""),
          );

        case "rating":
          return sorted.sort((a, b) => {
            const avgA =
              a.reviews?.reduce((sum, r) => sum + r.rating, 0) /
                a.reviews?.length || 0;
            const avgB =
              b.reviews?.reduce((sum, r) => sum + r.rating, 0) /
                b.reviews?.length || 0;

            return avgB - avgA;
          });

        case "latest":
          return sorted.reverse();

        default:
          return prev;
      }
    });
    // switch (val) {
    //   case "high":
    //     setItems((prev) => [...prev].sort((a, b) => b.basePrice - a.basePrice));
    //     break;
    //   case "low":
    //     setItems((prev) => [...prev].sort((a, b) => a.basePrice - b.basePrice));
    //     break;
    //   case "atoz":
    //     setItems((prev) =>
    //       [...prev].sort((a, b) => a.title.localeCompare(b.title))
    //     );
    //     break;
    //   case "rating":
    //     return setItems((prev) =>
    //       [...prev].sort((a, b) => {
    //         const avgB =
    //           b.reviews && b.reviews.length > 0
    //             ? b.reviews.reduce((sum, r) => sum + r.rating, 0) /
    //               b.reviews.length
    //             : 0;

    //         const avgA =
    //           a.reviews && a.reviews.length > 0
    //             ? a.reviews.reduce((sum, r) => sum + r.rating, 0) /
    //               a.reviews.length
    //             : 0;

    //         return avgB - avgA;
    //       })
    //     );

    //   case "latest":
    //     setItems(newProducts);
    //     break;
    //   default:
    //     break;
    // }
  };

  return (
    <>
      <Navbar />
      <Breadcrumbs title={"Best Selling Products"}></Breadcrumbs>
      <section className="lg:px-20 md:px-[60px] px-4 pb-[23px] bg-gray-50">
        <FilterProducts text={"Best Selling Products"} sort={sort} />

        <div className="flex lg:gap-6 items-start">
          <Skeleton name="product-grid" loading={loading}>
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : items.length > 0 ? (
              <Card cardData={items} />
            ) : (
              <p>No products found.</p>
            )}
          </Skeleton>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default NewProducts;
