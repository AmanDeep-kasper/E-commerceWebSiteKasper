import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import axiosInstance from "../api/axiosInstance";

function Policy() {


  return (
    <>
      <Navbar></Navbar>
      {/* <section className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-[240px] py-10 sm:py-12 md:py-16 lg:py-20 mt-10">
        <div className="flex flex-col items-center gap-4">
          <p className="text-[#E5B800] text-sm sm:text-base">
            Current as of 20 Sep 2024
          </p>
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

        Generic Section
        <div className="text-[#828282] flex flex-col  gap-6 my-12 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto">
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
        </div>

        Reusable Section Pattern
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
      </section> */}
      <div className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-[240px] py-10 sm:py-12 md:py-16 lg:py-20 mt-10">
        <div className="flex flex-col justify-center">
          <div className="flex flex-col gap-2">
            <span className="text-[28px] font-medium text-[#1C1C1C]">Privacy Policy</span>
            <span className="text-[16px] text-[#1C1C1C] font-regular">At Happy Art Supplies, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit or make a purchase from our website.</span>
          </div>
        </div>
        <div className="mt-5">
          <div>
            <span className="text-[#1C1C1C] text-[22px] font-medium">Information We Collected</span>
          </div>
          <div className="mt-5 text-[16px]">
            <span>We may collect the following types of information:</span>
          </div>
          <div className="mt-4 text-[16px] text-[1C1C1C]">
            <div className="flex flex-col gap-1">
              <span className="">Pesonal Information:</span>
              <span className="px-10">• Full Name</span>
              <span className="px-10">• Email Address</span>
              <span className="px-10">• Phone Number</span>
              <span className="px-10">• Shipping & billing Address</span>
              <span className="px-10">• Payment Details (Proceessed Securly By Payment Gateway)</span>
            </div>
            <div className="mt-5">
              <div className="flex flex-col gap-1">
                <span className="">Technical Information</span>
                <span className="px-10">• Browser Type & Device Information</span>
                <span className="px-10">• IP Address</span>
                <span className="px-10">• Website Uses Data (through cookies && data analist Tools)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <span className="text-[28px] font-medium text-[#1C1C1C]">How we Use Your Information</span>
          <div className="mt-5">
            <span className="text-[16px] text-[#1C1C1C] font-regular">Your information is used strictly for legitimate business purposes, including:</span>
            <div className="flex flex-col gap-1 mt-5">
              <span className="px-10">• Processing and fulfilling orders</span>
              <span className="px-10">• Providing customer support</span>
              <span className="px-10">• Sending order confirmations and shipping updates</span>
              <span className="px-10">• Improving website functionality and user experience</span>
              <span className="px-10">• Informing you about promotions or updates (only if you opt-in)</span>
            </div>
            <div className="text-[16px] text-[#1C1C1C] font-regular mt-5">We do not sell, rent, or trade your personal data to third parties.</div>
          </div>
        </div>
        <div className="mt-5">
          <span className="text-[28px] font-medium text-[#1C1C1C]">Cookies & Tracking</span>
          <div className="mt-5">
            <div className="flex flex-col gap-1 mt-5">
              <span className="px-10">• Our website may use cookies to enhance browsing experience and analyze website traffic.</span>
              <span className="px-10">• Cookies help us understand user behavior and improve performance.</span>
              <span className="px-10">• You can disable cookies through your browser settings if you prefer.</span>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <span className="text-[28px] font-medium text-[#1C1C1C]">Data Protection</span>
          <div className="mt-5">
            <span className="text-[16px] text-[#1C1C1C] font-regular">We implement appropriate technical and organizational measures to safeguard your data from:</span>
            <div className="flex flex-col gap-1 mt-5">
              <span className="px-10">• Unauthorized access</span>
              <span className="px-10">• Data misuse</span>
              <span className="px-10">• Loss or alteration</span>
            </div>
            <div className="text-[16px] text-[#1C1C1C] font-regular mt-5">However, no online platform can guarantee absolute security. Users are advised to protect their login credentials and personal information.</div>
          </div>
        </div>
        <div className="mt-5">
          <span className="text-[28px] font-medium text-[#1C1C1C]">Third-Party Services</span>
          <div className="mt-5">
            <span className="text-[16px] text-[#1C1C1C] font-regular">We may share limited information with trusted third parties such as:</span>
            <div className="flex flex-col gap-1 mt-5">
              <span className="px-10">• Courier partners for delivery</span>
              <span className="px-10">• Payment gateway providers</span>
              <span className="px-10">• Analytics tools</span>
            </div>
            <div className="text-[16px] text-[#1C1C1C] font-regular mt-5">These partners are obligated to handle your information responsibly and securely.</div>
          </div>
        </div>
        <div className="mt-5">
          <span className="text-[28px] font-medium text-[#1C1C1C]">Your Rights</span>
          <div className="mt-5">
            <span className="text-[16px] text-[#1C1C1C] font-regular">You have the right to:</span>
            <div className="flex flex-col gap-1 mt-5">
              <span className="px-10">• Request access to your personal data</span>
              <span className="px-10">• Request correction of inaccurate information</span>
              <span className="px-10">• Opt-out of promotional communications</span>
              <span className="px-10">• Request deletion of your data (subject to legal requirements)</span>
            </div>
            <div className="text-[16px] text-[#1C1C1C] font-regular mt-5">For any such requests, you may contact our support team.</div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default Policy;
