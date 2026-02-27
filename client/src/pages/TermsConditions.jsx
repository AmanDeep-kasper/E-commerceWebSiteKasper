import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";

const ReturnRefundPolicy = () => {
  return (
    <>
      <Navbar></Navbar>
      <section className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-[240px] py-10 sm:py-12 md:py-16 lg:py-20">
        <div className="flex flex-col items-center gap-4">
          {/* <p className="text-[#E5B800] text-sm sm:text-base">
            Current as of 20 Sep 2024
          </p> */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
            Terms & Conditions
          </h1>
          <p className="text-[#828282] text-sm sm:text-base max-w-4xl">
            Welcome to LAZERCUT. By accessing our website and placing an order,
            you agree to comply with the following Terms & Conditions. Please
            read them carefully before making a purchase.
          </p>
        </div>

        {/* Generic Section */}
        <div className="text-[#828282] flex flex-col  gap-6 my-12 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl text-[#3D3D3D] font-medium">
            General
          </h1>
          <ul>
            <li>
              These Terms & Conditions govern your use of the LAZERCUT website
              and services.
            </li>
            <li>
              By using our platform, you confirm that you are legally eligible
              to enter into binding agreements under applicable laws.
            </li>
            <li>
              LAZERCUT reserves the right to update or modify these terms at any
              time without prior notice.
            </li>
          </ul>
          <h1 className="text-xl sm:text-2xl md:text-3xl text-[#3D3D3D] font-medium">
            Product Information
          </h1>
          <ul>
            <li>
             We strive to display product descriptions, specifications, and images accurately.
            </li>
            <li>
             Minor variations in color, texture, or finish may occur due to screen settings, lighting, or manufacturing processes.
            </li>
            <li>
              All products are subject to availability. LAZERCUT reserves the right to discontinue any product without notice.
            </li>
          </ul>
        </div>

        {/* Reusable Section Pattern */}
        {[
          "Pricing & Payments",
          "Order Confirmation & Cancellation",
          "Shipping & Deliverys",
          "Returns & Refunds",
          "Intellectual Property",
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
};

export default ReturnRefundPolicy;
