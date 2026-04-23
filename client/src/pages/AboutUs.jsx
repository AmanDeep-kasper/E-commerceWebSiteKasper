import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import axiosInstance from "../api/axiosInstance";

function AboutUs() {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await axiosInstance.get("/api/get-policy");
        const privacy = res.data.policy.find((p) => p.type === "privacy");
        setPrivacyData(privacy);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPolicy();
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <section className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 py-10 sm:py-12 md:py-16 lg:py-20 mt-16">
  <div className="max-w-5xl mx-auto">

    {/* TITLE */}
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6">
      {aboutData?.title || "About Us"}
    </h1>

    {/* CONTENT FROM ADMIN */}
    <div
      className="text-[#828282] text-sm sm:text-base leading-relaxed max-w-4xl"
      dangerouslySetInnerHTML={{
        __html: aboutData?.content || "<p>No content available</p>",
      }}
    />

  </div>
</section>
      <Footer></Footer>
    </>
  );
}

export default AboutUs;
