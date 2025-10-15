import React from "react";
import clone1 from "../assets/Clone1.png";
import clone2 from "../assets/Clone2.png";
import clone3 from "../assets/Clone3.png";
import clone4 from "../assets/Clone4.png";
import Navbar from "../components/Navbar";
import Breadcrumbs from "../components/Breadcrumbs";
import Categories from "../components/Categories";
import Filter from "../components/Filter";
import FilterCard from "../components/FilterCard";
import Footer from "../sections/Footer";
import { useState } from "react";
import { useLocation } from "react-router";

const clones = [
  {title: "Crescent Moon Shape & Mosque Metal TabCouple..   ",
    price: "₹4,989",
    img: clone1,
    category: "lordkrishna",
    date: "2024-06-16",
    rating: 4.5,
    colorName: "black",
    colorCode: "bg-[#000]",
    decoreType: "Home Decore",
    discount: "₹5,999",
    discountPercent: "68% off",
    customerRated: "(30,060)",
    deliverBy: "Delivery by Tomorrow",
  },
  {
    title: "Clones",
    price: "₹5,919",
    img: clone2,
    category: "lordganesha",
    date: "2024-06-05",
    rating: 5,
    colorName: "black",
    colorCode: "bg-[#000]",
    decoreType: "Home Decore",
    discount: "₹5,999",
    discountPercent: "68% off",
    customerRated: "(30,060)",
    deliverBy: "Delivery by Tomorrow",
  },
  {
    title: "Family Portrait from Laserwall, Anniversary gift , Custom Metal..",
    price: "₹3,969",
    img: clone3,
    category: "lordshiva",
    date: "2024-06-18",
    rating: 4.7,
    colorName: "black",
    colorCode: "bg-[#000]",
    decoreType: "Home Decore",
    discount: "₹5,999",
    discountPercent: "68% off",
    customerRated: "(30,060)",
    deliverBy: "Delivery by Tomorrow",
  },
  {
    title: "Portrait From laserwall, Custom Birthday Gift For Kids, Custom..",
    price: "₹8,999",
    img: clone4,
    category: "lordhanuman",
    date: "2024-06-15",
    rating: 4.8,
    colorName: "black",
    colorCode: "bg-[#000]",
    decoreType: "Home Decore",
    discount: "₹5,999",
    discountPercent: "68% off",
    customerRated: "(30,060)",
    deliverBy: "Delivery by Tomorrow",
  },
  {
    title: "Portrait From laserwall, Custom Birthday Gift For Kids, Custom..",
    price: "₹8,999",
    img: clone4,
    category: "lordhanuman",
    date: "2024-06-15",
    rating: 4.8,
    colorName: "black",
    colorCode: "bg-[#000]",
    decoreType: "Home Decore",
    discount: "₹5,999",
    discountPercent: "68% off",
    customerRated: "(30,060)",
    deliverBy: "Delivery by Tomorrow",
  },
];

const colors = [
  {
    colorName: "golden",
    colorCode: "bg-[#D49A06]",
  },
  {
    colorName: "black",
    colorCode: "bg-[#000]",
  },
];

function Clones() {
  const [items, setItems] = useState(clones);
  const [color, setColor] = useState("");
  const [param, setParam] = useState("");
  const location = useLocation();
  const val = location?.state;

  const getNumericPrice = (str) => {
    return Number(str.replace(/[^\d]/g, ""));
  };

  const sort = (val) => {
    switch (val) {
      case "atoz":
        return setItems((prev) =>
          [...prev].sort((a, b) => a.title.localeCompare(b.title))
        );
      case "high":
        return setItems((prev) =>
          [...prev].sort(
            (a, b) => getNumericPrice(b.price) - getNumericPrice(a.price)
          )
        );
      case "low":
        return setItems((prev) =>
          [...prev].sort(
            (a, b) => getNumericPrice(a.price) - getNumericPrice(b.price)
          )
        );
      case "rating":
        return setItems((prev) =>
          [...prev].sort(
            (a, b) =>
              parseFloat(b.rating).toFixed(2) - parseFloat(a.rating).toFixed(2)
          )
        );
      case "latest":
        return setItems((prev) =>
          [...prev].sort((a, b) => new Date(b.date) - new Date(a.date))
        );
    }
  };

  const filteredClone = items.filter((val) => val.colorName.includes(color))
  return (
    <>
      <Navbar />
      <Breadcrumbs title="Clones" />
      <section className="lg:px-20 md:px-[60px] px-4 py-[23px]">
        <Filter text="Clones" sort={sort} />
        <div className=" flex lg:gap-6 items-start">
          <div className="sticky top-[75px] ">
            <Categories
              setParam={setParam}
              setColor={setColor}
              val={val}
              colors={colors}
            />
            </div>
          <FilterCard cardData={filteredClone} />
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Clones;
