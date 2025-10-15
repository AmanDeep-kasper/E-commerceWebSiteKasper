import React from "react";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import { Link } from "react-router";
import faqsImage from "../assets/Faqs.png";

const faqs = [
  {
    question: "1. What material is the wall art made of?",
    answer:
      "Our art is made from high-quality, rust-resistant metal with a durable finish that’s built to last.",
  },
  {
    question: "2. Can I customize a design?",
    answer:
      "Yes! We offer custom design services. You can share your idea, name, or reference, and we’ll bring it to life in metal.",
  },
  {
    question: "3. Is it easy to hang on the wall?",
    answer:
      "Absolutely. All our pieces come with mounting instructions and necessary hardware (hooks, screws, or double-sided tape — based on size).",
  },
  {
    question: "4. Will the artwork rust over time?",
    answer:
      "No. Our wall art is crafted using powder-coated or weather-resistant metal, so it stays beautiful indoors and out.",
  },
  {
    question: "5. Do you offer cash on delivery (COD)?",
    answer:
      "Yes, we provide COD in most pin codes across India. You’ll see the option at checkout.",
  },
  {
    question: "6. How long will it take to receive my order?",
    answer:
      "Orders are usually shipped within 2–4 business days. Delivery time depends on your location but typically ranges from 5–8 working days.",
  },
  {
    question: "7. Is this suitable for outdoor walls or balconies?",
    answer:
      "Yes! Our metal art is coated to withstand moderate weather conditions — perfect for outdoor decor too.",
  },
  {
    question: "8. What if I receive a damaged product?",
    answer:
      "No worries! Just contact us within 48 hours of delivery with photos, and we’ll replace it or issue a refund.",
  },
  {
    question: "9. Can I return or exchange my order?",
    answer:
      "Yes, we accept returns for damaged or incorrect items. Custom orders, however, are not returnable unless there’s a quality issue.",
  },
  {
    question: "10. Do you ship internationally?",
    answer:
      "Currently, we ship only within India. But international delivery is coming soon — stay tuned!",
  },
];

function Faqs() {
  return (
    <>
      <Navbar />
      <Link
        className="lg:px-20 md:px-[60px] px-4 flex gap-2 items-center py-[30px] border-t border-t-[#EBEBEB]"
        to={"/"}
      >
        <ArrowLeft size={18} strokeWidth={1} />
        <p className="text-[#565656]">FAQS</p>
      </Link>

      <section className="lg:px-20 md:px-[60px] px-4 flex flex-col gap-8 py-[23px]">
        {/* FAQ Content */}
        <div className="max-w-screen-lg w-full mx-auto">
          <h1 className="text-3xl md:text-4xl font-[400] mb-6">
            Frequently Asked Questions (FAQs)
          </h1>
          <div className="flex flex-col gap-6">
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
          <div className="h-auto bg-[#FFC10733] flex flex-col items-center py-6 px-4 gap-2 rounded-md">
            <h1 className="text-lg sm:text-xl text-gray-800 md:text-[20px] font-medium">
              Still have questions?
            </h1>
            <p className="text-[#828282] text-center text-sm md:text-base max-w-lg">
              Can’t find the answer you’re looking for? Please chat to our
              friendly team.
            </p>
            <button className="py-2 px-6 bg-[#EBB100] rounded-md mt-4">
              Contact Us
            </button>
          </div>

          {/* Newsletter Section */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 my-10">
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
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Faqs;
