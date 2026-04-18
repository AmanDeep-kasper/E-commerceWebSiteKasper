import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";

function ShippingPolicy() {
  const data = [
    {
      title: "Delivery Time",
      points: [
        "Standard delivery time: 3–7 business days",
        "Delivery timelines may vary based on location, courier availability, and external factors",
      ],
    },
    {
      title: "Shipping Charges",
      text: "Shipping charges are calculated at checkout based on:",
      points: [
        "Order weight",
        "Delivery Loctaion"
      ],
      textL: "We may offer free shipping on selected orders or promotions"
    },
    {
      title: "Order Tracking",
      text: "Once your order is shipped, you will receive a tracking link via email or SMS, allowing you to track your shipment in real-time."
    },
    {
      title: "Packaging & Handling",
      points: [
        "All products are securely packed to prevent leakage, damage, or breakage",
        "Special care is taken for resin, liquids, and fragile items",
      ],
    },
    {
      title: "Damage or Missing items",
      text: "If you receive a damaged or incomplete order:",
      points: [
        "Report within 48 hours of delivery",
        "Share Clear Photo/Video for verification ",
      ],
      textL: "We will arrange a replacement or resulation as per our policy."
    },
  ];
  return (
    <>
      <Navbar></Navbar>
      <section className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-[240px] py-10 sm:py-12 md:py-16 lg:py-20 mt-10 flex flex-col items-center">
        <div className="flex flex-col gap-5">
          {/* <p className="text-[#E5B800] text-sm sm:text-base">
            Current as of 20 Sep 2024
          </p> */}
          <div className="flex flex-col gap-5">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
              Shipping Policy
            </h1>
            <p className="text-[#1C1C1C] text-sm sm:text-base max-w-4xl">
              At Happy Art Supplies, we ensure safe, reliable, and timely delivery of your resin art materials across India.
            </p>
          </div>

          <div className="flex flex-col gap-5 text-[#1c1c1c]">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-medium">
              Shipping Coverage
            </h1>
            <p>
              We offer Pan India shipping, delivering to most locations through trusted courier partners.
            </p>
          </div>

          <div className="flex flex-col gap-5 text-[#1c1c1c]">

            <h1 className="text-xl sm:text-2xl md:text-3xl font-medium">
              Order Processing Time
            </h1>
            <p>
              • Orders are processed within 1 - 2 business days after confirmation
              <p>
                • Orders placed on weekends or public holidays are processed on the next working day</p>
            </p>
          </div>
          {data.map((item, idx) => (
            <div
              key={idx}
              className="text-[#1c1c1c] flex flex-col gap-2 text-sm sm:text-base leading-relaxed max-w-4xl"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl text-[#1C1C1C] font-medium">
                {item.title}
              </h2>

              <div className="flex flex-col gap-2">
                {!item.points && item.text && (
                  <span>{item.text}</span>
                )}

                {/* If points exist */}
                {item.points && (
                  <>
                    {item.text && <span>{item.text}</span>}

                    {item.points.map((point, i) => (
                      <span key={i}>• {point}</span>
                    ))}

                    {item.textL && <span>{item.textL}</span>}
                  </>
                )}

              </div>
            </div>
          ))}
        </div>

        {/* Generic Section */}
        {/* <div className="flex flex-col items-center">
        </div> */}

        {/* Reusable Section Pattern */}

      </section>
      <Footer></Footer>
    </>
  );
}

export default ShippingPolicy;
