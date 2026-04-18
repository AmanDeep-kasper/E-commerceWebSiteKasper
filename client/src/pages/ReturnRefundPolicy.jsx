import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";

const ReturnRefundPolicy = () => {
  return (
    <>
      <Navbar></Navbar>
      {/* <section className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-[240px] py-10 sm:py-12 md:py-16 lg:py-20 mt-10">
        <div className="flex flex-col items-center gap-4 justify-center">
          <p className="text-[#E5B800] text-sm sm:text-base">
            Current as of 20 Sep 2024
          </p> 
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
            Return & Refund Policy
          </h1>
          <p className="text-[#828282] text-sm sm:text-base max-w-4xl">
            At LAZERCUT, we stand behind the quality of our products. If
            something is not right, we are committed to resolving it fairly and
            professionally.
          </p>
        </div>

        <div className="text-[#828282] flex flex-col  gap-6 my-12 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl text-[#3D3D3D] font-medium">
            Order Processing
          </h1>
          <p>
            Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
            suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum
            quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris
            posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At
            feugiat sapien varius id.
          </p>
          <h1 className="text-xl sm:text-2xl md:text-3xl text-[#3D3D3D] font-medium">
            Shipping Timeline
          </h1>
          <p>
            Eget quis mi enim, leo lacinia pharetra, semper. Eget in volutpat
            mollis at volutpat lectus velit, sed auctor. Porttitor fames arcu
            quis fusce augue enim. Quis at habitant diam at. Suscipit tristique
            risus, at donec. In turpis vel et quam imperdiet. Ipsum molestie
            aliquet sodales id est ac volutpat.
          </p>
        </div>

        {[
          "Eligibility for Returns",
          "Damaged or Incorrect Products",
          "Refund Process",
          "Replacement Policy",
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
      </section> */}


      { /* <===============------------- Return policy ---------------===================> */}
      <div className="mt-px-4 sm:px-8 md:px-16 lg:px-32 xl:px-[240px] py-10 sm:py-12 md:py-16 lg:py-20 mt-10">
        <div className="flex flex-col justify-center">
          <div className="flex flex-col gap-2">
            <span className="text-[28px] font-medium text-[#1C1C1C]">Return & Refund Policy</span>
            <span className="text-[16px] text-[#1C1C1C] font-regular">At Happy Art Supplies, we strive to provide high-quality resin art materials and supplies. Due to the nature of our products, we maintain a strict policy of no returns, no exchanges, and no cancellations once an order has been placed.</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-5">
          <span className="text-[#1C1C1C] text-[22px] font-medium">Damaged or Incorrect Items</span>
          <div className="flex flex-col gap-2 mt-3">
            <span>We understand that the issues can occure during transit. if you recive:</span>
            <span>• A incorrect item</span>
            <span>• A damage product</span>
            <span>Please contact with us within  24 hours delivery with:</span>
            <span>•
              Clear photos/videos of the product
            </span>
            <span>• Order details (Order ID, invoice)</span>
            <span>
              After verification, we will:</span>
            <span>• Offer a replacement, or</span>
            <span>•
              Provide a refund, depending on the situation</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-5">
          <span className="text-[#1C1C1C] text-[22px] font-medium">Refund Process</span>
          <div className="flex flex-col gap-2 mt-3">
            <span>If a return Approved:</span>
            <span>• it will processed within 5-7 bussiness days</span>
            <span>• The amount will be credited to your original payment method</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-5">
          <span className="text-[#1C1C1C] text-[22px] font-medium">Non-Refundable Situations</span>
          <div className="flex flex-col gap-2 mt-3">
            <span>Refunds will not be applicable in the following cases:</span>
            <span>• Change of mind after purchase</span>
            <span>• Incorrect usage of product</span>
            <span>• Delay in reporting issues (after 24 hours of delivery)</span>
            <span>• Minor variations in color/texture (common in art materials)</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-5">
          <span className="text-[#1C1C1C] text-[22px] font-medium">Non-Refundable Situations</span>
          <div className="flex flex-col gap-2 mt-3">
            <span>• Orders cannot be cancelled once placed</span>
            <span>• Please review your order carefully before confirming purchase</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-5">
          <span className="text-[#1C1C1C] text-[22px] font-medium">Non-Refundable Situations</span>
          <div className="flex flex-col gap-2 mt-3">
            <span>For any issues or queries, reach out to our support team:</span>
            <span>• Email: happyartsupplies@gmail.com</span>
            <span>• Phone: +91 98868 94723</span>
          </div>
        </div>

      </div>
      <Footer></Footer>
    </>
  );
};

export default ReturnRefundPolicy;
