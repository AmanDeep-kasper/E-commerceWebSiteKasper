import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import { Link } from "react-router-dom";
// import faqsImage from "../assets/Faqs.png";

const faqs = [
  {
    question: "1.What products does Happy Art Supplies offer?",
    answer:
      "We provide a wide range of resin art materials, including epoxy resin, hardeners, pigments, molds, mica powders, dried flowers, tools, and accessories. Everything you need to create beautiful resin art.",
  },
  {
    question: "2. Do you ship across India?",
    answer:
      "Yes, we offer Pan India shipping. Orders are delivered through reliable courier partners to ensure safe and timely delivery.",
  },
  {
    question: "3. How long does delivery take?",
    answer:
      "Orders are usually processed within 1–2 business days. Delivery typically takes 3–7 working days, depending on your location.",
  },
  {
    question: "4.  How can I track my order?",
    answer:
      "Once your order is shipped, you will receive a tracking link via email or SMS to monitor your delivery status.",
  },
  {
    question: "5.Can I cancel my order?",
    answer:
      "Yes, you can cancel your order before it is shipped. Once dispatched, cancellation is not possible.",
  },
  {
    question: "6. What is your return policy?",
    answer:
      "We accept returns only for damaged, defective, or incorrect products, reported within 48 hours of delivery. Items must be unused and in original packaging.",
  },
  {
    question: "7.Do you offer refunds?",
    answer:
      "Yes. Once the returned product is verified, refunds are processed within 5–7 business days to your original payment method or via bank transfer (for COD).",
  },
  {
    question: "8. Are your materials safe to use?",
    answer:
      "Our materials are artist-approved, but we recommend using proper safety measures like gloves, masks, and working in a ventilated area.",
  },
];

function Faqs() {
  return (
    <>
      <Navbar />
      <Link
        className="flex gap-2 items-center py-[30px] border-t border-t-[#EBEBEB]"
        to={"/"}
      >
        <ArrowLeft size={18} strokeWidth={1} />
        <p className="text-[#565656]">FAQS</p>
      </Link>

      <section className="lg:px-80 md:px-[60px] px-4 flex flex-col gap-8 py-[23px] justify-center">
        {/* FAQ Content */}
        <div className=" w-full mx-auto">
          <h1 className="text-3xl md:text-4xl font-[400] mb-6">
            Frequently Asked Questions (FAQs)
          </h1>
          
          <span>At Happy Art Supplies, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit or make a purchase from our website.</span>
          <div className="flex flex-col gap-6 mt-5">
            {faqs.map((faq) => (
              <div key={faq.question} className="flex flex-col gap-2">
                <h2 className="text-[18px] md:text-[20px] text-black font-[400]">
                  {faq.question}
                </h2>
                <p className="text-[15px] md:text-[17px] text-[#515151]">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact + Newsletter */}
        <div>
          {/* Still Have Questions */}
          <div className="h-auto bg-[#F0EEFF] flex flex-col items-center py-6 px-4 gap-2 rounded-md">
            <h1 className="text-lg sm:text-xl text-gray-800 md:text-[20px] font-medium">
              Do you still have any questions?
            </h1>
            <p className="text-[#1C1C1C] text-center text-sm md:text-base max-w-lg">
              Can’t find the answer you’re looking for? Please chat to our
              friendly team.
            </p>
            <button className="py-2 px-6 flex items-center gap-2 bg-[#1800AC] text-white  rounded-md mt-4">
              Contact Us  <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Newsletter Section */}
          {/* <div className="flex flex-col lg:flex-row justify-between items-center gap-8 my-10">
            <div className="flex flex-col justify-center items-center text-center lg:text-left flex-1">
              <h1 className="text-lg sm:text-xl text-gray-800 font-medium">
                Sign up for our Newsletter
              </h1>
              <p className="text-[14px] text-[#828282]">
                Stay updated on new arrivals, exclusive deals, and product
                releases.
              </p>

              <div>
                <div className="flex flex-col sm:flex-row gap-2 mt-6">
                  <input
                    type="text"
                    className="outline-none border border-[#EBB100] placeholder-[#EBB100] py-2 px-4 rounded-md w-full sm:w-auto"
                    placeholder="Enter Your Gmail"
                  />
                  <button className="px-6 py-2 bg-[#EBB100] rounded-md w-full sm:w-auto">
                    Subscribe
                  </button>
                </div>
                <p className="text-[12px] md:text-[14px] text-[#828282] mt-2">
                  We care about your data in our{" "}
                  <span className="text-[#EBB100] underline">
                    Privacy policy
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-[#FFC10733] flex-1 flex justify-center rounded-md">
              <img
                className="h-[220px] md:h-[355px] w-auto object-contain"
                src={faqsImage}
                alt="FAQs"
              />
            </div>
          </div> */}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Faqs;
