import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import axiosInstance from "../api/axiosInstance";
import "react-quill-new/dist/quill.snow.css";

const ReturnRefundPolicy = () => {
  const [refundData, setRefundData] = useState(null);

  useEffect(() => {
    const fetchRefundPolicy = async () => {
      try {
        const res = await axiosInstance.get("/dashboard/policy/get-policy");
        const policy = res.data.policy.find((p) => p.type === "return_refund");
        setRefundData(policy);
      } catch (err) {
        console.error("Error fetching refund policy:", err);
      }
    };

    fetchRefundPolicy();
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <section className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 py-10 sm:py-12 md:py-16 lg:py-20 mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col justify-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6">
                {refundData?.title || "Return & Refund Policy"}
              </h1>
            </div>
          </div>

          <div
            className="ql-editor p-0 text-[#1C1C1C] text-sm sm:text-base leading-relaxed w-full overflow-hidden [&_p]:!mb-6 [&_ul]:!mb-6 [&_ol]:!mb-6 [&_li]:!mb-2"
            dangerouslySetInnerHTML={{
              __html: refundData?.content || "<p>At Happy Art Supplies, we strive to provide high-quality resin art materials and supplies. Due to the nature of our products, we maintain a strict policy of no returns, no exchanges, and no cancellations once an order has been placed.</p>",
            }}
          />
        </div>
      </section>
      <Footer></Footer>
    </>
  );
};

export default ReturnRefundPolicy;
