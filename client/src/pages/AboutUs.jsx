import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import axiosInstance from "../api/axiosInstance";
import "react-quill-new/dist/quill.snow.css";

function AboutUs() {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axiosInstance.get("/dashboard/policy/get-policy");
        const about = res.data.policy.find((p) => p.type === "about");
        setAboutData(about);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAbout();
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
            className="ql-editor p-0 text-[#1C1C1C] text-sm sm:text-base leading-relaxed w-full overflow-hidden break-words [&_p]:!mb-6 [&_ul]:!mb-6 [&_ol]:!mb-6 [&_li]:!mb-2"
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
