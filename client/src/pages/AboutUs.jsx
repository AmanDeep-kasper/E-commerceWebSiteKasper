import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";

function AboutUs() {
  return (
    <>
      <Navbar></Navbar>
      <section className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-[240px] py-10 sm:py-12 md:py-16 lg:py-20">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
            About Us
          </h1>
          <p className="text-[#828282] text-sm sm:text-base max-w-4xl">
            LAZERCUT was established with a simple belief — precision creates
            perfection. We are an online platform dedicated to delivering
            premium laser-cut decor and design products for individuals who
            appreciate detail, craftsmanship, and modern aesthetics
          </p>
        </div>

        {/* Generic Section */}
        <div className="text-[#828282] flex flex-col  gap-6 my-12 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto">
          <p>
            We proudly offer “Made in India” laser-cut creations including metal
            wall art, customized nameplates, intricate decorative panels, modern
            clocks, and bespoke design elements. Every product is crafted with
            high-grade materials, tested for durability, and finished with care
            to ensure it elevates your space effortlessly. <br /> <br /> Design
            is not just decoration — it is identity. At LAZERCUT, we focus on
            blending technology with artistry to create pieces that bring
            character, balance, and personality into your home or workspace. Our
            collections are thoughtfully curated to suit different moods,
            themes, and interior styles without compromising on quality or
            value.
          </p>
        </div>

        {/* Reusable Section Pattern */}
        {[
          "Our Vision and Mission",
          "Our Team",
          "Quality Policy",
          "Why Choose LAZERCUT?",
        ].map((title, idx) => (
          <div
            key={idx}
            className="text-[#828282] flex flex-col gap-6 my-12 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl text-[#3D3D3D] font-medium">
              {title}
            </h2>
            <p>
              Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum,
              nulla odio nisl vitae. In aliquet pellentesque aenean hac
              vestibulum turpis mi bibendum diam. Tempor integer aliquam in
              vitae malesuada fringilla.
            </p>
            <p>
              Elit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet
              commodo consectetur convallis risus. Sed condimentum enim
              dignissim adipiscing faucibus consequat, urna. Viverra purus et
              erat auctor aliquam. Risus, volutpat vulputate posuere purus sit
              congue convallis aliquet. Arcu id augue ut feugiat donec porttitor
              neque.
            </p>
            <p>
              Ipsum sit mattis nulla quam nulla. Gravida id gravida ac enim
              mauris id. Non pellentesque congue eget consectetur turpis.
              Sapien, dictum molestie sem tempor. Diam elit, orci, tincidunt
              aenean tempus. Quis velit eget ut tortor tellus. Sed vel, congue
              felis elit erat nam nibh orci.
            </p>
          </div>
        ))}
      </section>
      <Footer></Footer>
    </>
  );
}

export default AboutUs;
