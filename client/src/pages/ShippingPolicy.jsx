import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import axiosInstance from "../api/axiosInstance";
import "react-quill-new/dist/quill.snow.css";

function ShippingPolicy() {
  const [shippingData, setShippingData] = useState(null);

  const cleanHTML = (html) => {
    if (!html) return "";

    return html
      .replace(/&nbsp;/g, " ") // remove nbsp
      .replace(/&shy;/g, "") // remove soft hyphen
      .replace(/\u200B/g, "") // remove zero-width space
      .replace(/\s+/g, " "); // normalize spaces
  };

  useEffect(() => {
    const fetchShippingPolicy = async () => {
      try {
        const res = await axiosInstance.get("/dashboard/policy/get-policy");
        const policy = res.data.policy.find((p) => p.type === "shipping");
        setShippingData(policy);
      } catch (err) {
        console.error("Error fetching shipping policy:", err);
      }
    };

    fetchShippingPolicy();
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <section className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 py-10 sm:py-12 md:py-16 lg:py-20 mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col gap-5">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6">
              {shippingData?.title || "Shipping Policy"}
            </h1>
          </div>

          <div
            className="ql-editor p-0 text-[#1C1C1C] text-sm sm:text-base leading-relaxed w-full overflow-hidden whitespace-normal break-normal [&_p]:!mb-6 [&_ul]:!mb-6 [&_ol]:!mb-6 [&_li]:!mb-2"
            dangerouslySetInnerHTML={{
              __html: cleanHTML(
                shippingData?.content ||
                  "<p>At Happy Art Supplies, we ensure safe, reliable, and timely delivery of your resin art materials across India.</p>",
              ),
            }}
          />
        </div>
      </section>
      <Footer></Footer>
    </>
  );
}

export default ShippingPolicy;
