import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import axiosInstance from "../api/axiosInstance";
import "react-quill-new/dist/quill.snow.css";

const TermsConditions = () => {
  const [termsData, setTermsData] = useState(null);

  useEffect(() => {
    const fetchTermsPolicy = async () => {
      try {
        const res = await axiosInstance.get("/dashboard/policy/get-policy");
        const policy = res.data.policy.find((p) => p.type === "terms");
        setTermsData(policy);
      } catch (err) {
        console.error("Error fetching terms policy:", err);
      }
    };

    fetchTermsPolicy();
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <section className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 py-10 sm:py-12 md:py-16 lg:py-20 mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6">
              {termsData?.title || "Terms & Conditions"}
            </h1>
          </div>

          <div
            className="ql-editor p-0 text-[#1C1C1C] text-sm sm:text-base leading-relaxed w-full overflow-hidden [&_p]:!mb-6 [&_ul]:!mb-6 [&_ol]:!mb-6 [&_li]:!mb-2"
            dangerouslySetInnerHTML={{
              __html: termsData?.content || "<p>Welcome to Happy Art Supplies. By accessing our website and placing an order, you agree to comply with the following Terms & Conditions. Please read them carefully before making a purchase.</p>",
            }}
          />
        </div>
      </section>
      <Footer></Footer>
    </>
  );
};

export default TermsConditions;
