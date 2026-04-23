import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Link } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";

const PoliciesSettings = () => {
  const [refundCancellationValue, setRefundCancellationValue] = useState("");
  const [shippingValue, setShippingValue] = useState("");
  const [termsConditionsValue, setTermsConditionsValue] = useState("");
  const [aboutUsValue, setAboutUsValue] = useState("");
  const [privacyPolicyValue, setPrivacyPolicyValue] = useState("");

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await axiosInstance.get("/dashboard/policy/get-policy");

        res.data.policy.forEach((p) => {
          if (p.type === "return_refund") setRefundCancellationValue(p.content);
          if (p.type === "shipping") setShippingValue(p.content);
          if (p.type === "terms") setTermsConditionsValue(p.content);
          if (p.type === "about") setAboutUsValue(p.content);
          if (p.type === "privacy") setPrivacyPolicyValue(p.content);
        });
      } catch (err) {
        console.error("Error fetching policies:", err);
      }
    };

    fetchPolicies();
  }, []);



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
