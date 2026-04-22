import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";

function AboutUs() {
  return (
    <>
      <Navbar></Navbar>
      <section className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 py-10 sm:py-12 md:py-16 lg:py-20 mt-16">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-start font-semibold">
            About Us
          </h1>
          <p className="text-[#828282] text-sm sm:text-base max-w-4xl">
            Welcome to Happy Art Supplies, your trusted destination for premium
            resin art materials in Bangalore and across India. We are passionate
            about empowering artists, hobbyists, and small business owners with
            high-quality resin supplies that inspire creativity and Original
            artistic visions to life.
          </p>
        </div>

        {/* Generic Section */}
        <div className="text-[#828282] flex flex-col  gap-6 my-12 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto">
          <p>
            Founded in 2021 with a deep love for handmade art, Happy Art
            Supplies was created to make professional resin art products easily
            accessible Pan India. From epoxy resin and hardeners to pigments,
            molds, mica powders, dried flowers, tools, and essential accessories
            we carefully curate every product to ensure quality, reliability,
            and artist satisfaction.
          </p>
          <p>
            {" "}
            Based in Bangalore, we proudly ship resin art supplies across India,
            supporting beginners starting their creative journey as well as
            experienced resin artists building their brands. Our goal is simple:
            to provide affordable, high-quality resin materials with trustworthy
            service and a personal touch. As artists ourselves, we understand
            what creators truly need - consistent results, durable materials,
            and supplies that elevate every project. Whether you're creating
            resin nameboards, jewelry, trays, home décor, or preserving wedding
            flowers, Happy Art Supplies is here to support your craft.
          </p>
          <p>
            Quality materials Pan India Shipping Artist-approved Supplies
            Trusted by Resin Art Creators Let's create something beautiful
            together
          </p>
        </div>
      </section>
      <Footer></Footer>
    </>
  );
}

export default AboutUs;
