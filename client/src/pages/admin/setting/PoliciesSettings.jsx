import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Link } from "react-router-dom";

const PoliciesSettings = () => {
  const [refundCancellationValue, setRefundCancellationValue] = useState(`
    <p><strong>Example:</strong></p>
    <p>Returns are accepted within {{return_window}} days of delivery.</p>
    <p>Products must be unused, in original condition, and with all packaging intact.</p>
    <p>Refunds will be processed to the {{refund_method}} after the return is approved.</p>
  `);

  const [shippingValue, setShippingValue] = useState(`
    <p><strong>Example:</strong></p>
    <p>We offer free standard shipping on all orders over $50.</p>
    <p>Orders are processed within 1-2 business days and delivered within 5-7 business days.</p>
    <p>Expedited shipping options are available at checkout for an additional fee.</p>
  `);

  const [termsConditionsValue, setTermsConditionsValue] = useState(`
    <p><strong>Example:</strong></p>
    <p>By using our website, you agree to comply with our terms and conditions.</p>
    <p>We reserve the right to modify these terms at any time without prior notice.</p>
    <p>All content on this site is for informational purposes only and is subject to change without notice.</p>
  `);

  // const [faqsValue, setFaqsValue] = useState(`
  //   <p><strong>Example:</strong></p>
  //   <p><strong>Q: What is your return policy?</strong></p>
  //   <p>A: We accept returns within {{return_window}} days of delivery. Products must be unused and in original condition.</p>
  //   <p><strong>Q: How long does shipping take?</strong></p>
  //   <p>A: Standard shipping takes 5-7 business days. Expedited options are available at checkout.</p>
  //   <p><strong>Q: Do you offer international shipping?</strong></p>
  //   <p>A: Yes, we ship to select countries. Shipping times and fees vary by location.</p>
  // `);

  const [aboutUsValue, setAboutUsValue] = useState(`
    <p><strong>Example:</strong></p>
    <p>Welcome to our store! We are passionate about providing high-quality products and exceptional customer service.</p>
    <p>Our mission is to offer a wide range of products that meet the needs of our customers while maintaining a commitment to sustainability and ethical sourcing.</p>
    <p>Thank you for choosing us for your shopping needs. We look forward to serving you!</p>
  `);

  const [privacyPolicyValue, setPrivacyPolicyValue] = useState(`
    <p><strong>Example:</strong></p>
    <p>We value your privacy and are committed to protecting your personal information.</p>
    <p>We collect only the necessary information to process your orders and provide a personalized shopping experience.</p>
    <p>Your data is stored securely and will never be shared with third parties without your consent.</p>
  `);



  return (
    <div className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-[24px] font-semibold text-[#1F2937]">Policies</h1>
          <p className="text-[14px] text-[#6B7280]">
            Manage customer-facing policies that define returns, refunds,
            cancellations, shipping, and legal terms
          </p>
        </div>

        <Link to={"/admin/settings/PoliciesSettingsEdit-form"}>
          <button className="bg-[#17324D] text-white px-5 py-2 rounded-md text-sm font-medium">
            Edit
          </button>
        </Link>
      </div>

      <div className="flex flex-col space-y-4">
        <div>
          <h2 className="text-[18px] font-semibold text-[#1F2937] mb-4">
             Refund & Cancellation Policy
          </h2>
          <div className=" border-[#D1D5DB] rounded-md bg-white p-4">
            <ReactQuill
              theme="snow"
              value={refundCancellationValue}
              onChange={setRefundCancellationValue}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  [{ align: [] }],
                  ["clean"],
                ],
              }}
              className="bg-white"
            />
          </div>
        </div>

        <div>
          <h2 className="text-[18px] font-semibold text-[#1F2937] mb-4">
            Shipping Policy
          </h2>
          <div className=" border-[#D1D5DB] rounded-md bg-white p-4">
            <ReactQuill
              theme="snow"
              value={shippingValue}
              onChange={setShippingValue}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  [{ align: [] }],
                  ["clean"],
                ],
              }}
              className="bg-white"
            />
          </div>
        </div>

        <div>
          <h2 className="text-[18px] font-semibold text-[#1F2937] mb-4">
            Terms & Conditions
          </h2>
          <div className=" border-[#D1D5DB] rounded-md bg-white p-4">
            <ReactQuill
              theme="snow"
              value={termsConditionsValue}
              onChange={setTermsConditionsValue}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  [{ align: [] }],
                  ["clean"],
                ],
              }}
              className="bg-white"
            />
          </div>
        </div>

        {/* <div>
          <h2 className="text-[18px] font-semibold text-[#1F2937] mb-4">
            Frequently Asked Question (FAQs)
          </h2>
          <div className=" border-[#D1D5DB] rounded-md bg-white p-4">
            <ReactQuill
              theme="snow"
              value={faqsValue}
              onChange={setFaqsValue}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  [{ align: [] }],
                  ["clean"],
                ],
              }}
              className="bg-white"
            />
          </div>
        </div> */}

        <div>
          <h2 className="text-[18px] font-semibold text-[#1F2937] mb-4">
            About Us
          </h2>
          <div className=" border-[#D1D5DB] rounded-md bg-white p-4">
            <ReactQuill
              theme="snow"
              value={aboutUsValue}
              onChange={setAboutUsValue}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  [{ align: [] }],
                  ["clean"],
                ],
              }}
              className="bg-white"
            />
          </div>
        </div>

        <div>
          <h2 className="text-[18px] font-semibold text-[#1F2937] mb-4">
            Privacy Policy
          </h2>
          <div className=" border-[#D1D5DB] rounded-md bg-white p-4">
            <ReactQuill
              theme="snow"
              value={privacyPolicyValue}
              onChange={setPrivacyPolicyValue}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  [{ align: [] }],
                  ["clean"],
                ],
              }}
              className="bg-white"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default PoliciesSettings;
