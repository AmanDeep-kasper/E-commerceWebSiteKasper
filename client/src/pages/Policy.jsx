import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";

function Policy() {
  return (
    <>
      <Navbar></Navbar>
      <section className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-[240px] py-10 sm:py-12 md:py-16 lg:py-20 mt-10">
        <div className="flex flex-col items-center gap-4">
          {/* <p className="text-[#E5B800] text-sm sm:text-base">
            Current as of 20 Sep 2024
          </p> */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
            Privacy Policy
          </h1>
          <p className="text-[#828282] text-sm sm:text-base max-w-4xl">
            At Happy Art Supplies, we value your privacy and are committed to
            protecting your personal information. This Privacy Policy explains
            how we collect, use, and safeguard your data when you visit or make
            a purchase from our website.
          </p>
        </div>

        {/* Generic Section */}
        {/* <div className="text-[#828282] flex flex-col  gap-6 my-12 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto">
          <p>
            Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
            suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum
            quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris
            posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At
            feugiat sapien varius id.
          </p>
          <p>
            Eget quis mi enim, leo lacinia pharetra, semper. Eget in volutpat
            mollis at volutpat lectus velit, sed auctor. Porttitor fames arcu
            quis fusce augue enim. Quis at habitant diam at. Suscipit tristique
            risus, at donec. In turpis vel et quam imperdiet. Ipsum molestie
            aliquet sodales id est ac volutpat.
          </p>
        </div> */}

        {/* Reusable Section Pattern */}
        {[
          "Information We Collect",
          "How We Use Your Information",
          "Cookies & Tracking",
          "Data Protection",
          "Third-Party Services",
          "Your Rights",
          "Changes to This Policy",
        ].map((title, idx) => (
          <div
            key={idx}
            className="text-[#1C1C1C] flex flex-col gap-6 my-12 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl text-[#3D3D3D] font-medium">
              {title}
            </h2>
            <p>
              We may collect the following types of information:
              <br /> Personal
              Information: <br /> Full name<br /> Email address <br />Phone number <br />Shipping and
              billing address<br /> Payment details (processed securely via payment
              gateways)<br /> Technical Information:<br /> Browser type and device
              information<br /> IP address<br /> Website usage data (through cookies and
              analytics tools)
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

export default Policy;
