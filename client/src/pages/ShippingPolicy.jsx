import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";

function ShippingPolicy() {
  return (
    <>
      <Navbar></Navbar>
      <section className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-[240px] py-10 sm:py-12 md:py-16 lg:py-20 mt-10">
        <div className="flex flex-col items-center gap-4">
          {/* <p className="text-[#E5B800] text-sm sm:text-base">
            Current as of 20 Sep 2024
          </p> */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
            Shipping Coverage
          </h1>
          <p className="text-[#828282] text-sm sm:text-base max-w-4xl">
            We offer Pan India shipping, delivering to most locations through
            trusted courier partners.
          </p>
        </div>

        {/* Generic Section */}
        <div className="text-[#828282] flex flex-col  gap-6 my-12 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl text-[#3D3D3D] font-medium">
            Order Processing Time
          </h1>
          <p>
            Orders are processed within 1–2 business days after confirmation
            Orders placed on weekends or public holidays are processed on the
            next working day
          </p>
          <h1 className="text-xl sm:text-2xl md:text-3xl text-[#3D3D3D] font-medium">
            Delivery Time
          </h1>
          <p>
            Standard delivery time: 3–7 business days Delivery timelines may
            vary based on location, courier availability, and external factors
          </p>
        </div>

        {/* Reusable Section Pattern */}
        {[
          "Shipping Charges",
          "Packaging",
          "Delivery Partners",
          "Delays & Exceptions",
          "Address & Contact Details",
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

export default ShippingPolicy;
