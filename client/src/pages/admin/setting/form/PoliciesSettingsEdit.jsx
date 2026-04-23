import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Link } from "react-router-dom";

import axiosInstance from "../../../../api//axiosInstance";

const PoliciesSettingsEdit = () => {
  const [refundValue, setRefundValue] = useState("");
  const [shippingValue, setShippingValue] = useState("");
  const [termsValue, setTermsValue] = useState("");
  const [faqValue, setFaqValue] = useState("");
  const [aboutValue, setAboutValue] = useState("");
  const [privacyValue, setPrivacyValue] = useState("");

  const saveChanges = async () => {
    try {
      const payload = {
        policies: [
          {
            type: "return_refund",
            title: "Refund & Cancellation Policy",
            content: refundValue,
          },
          {
            type: "shipping",
            title: "Shipping Policy",
            content: shippingValue,
          },
          {
            type: "terms",
            title: "Terms & Conditions",
            content: termsValue,
          },
          {
            type: "about",
            title: "About Us",
            content: aboutValue,
          },
          {
            type: "privacy",
            title: "Privacy Policy",
            content: privacyValue,
          },
        ],
      };

      await axiosInstance.post("/api/upsert-policies", payload);

      alert("Saved successfully");
    } catch (error) {
      console.error("Error saving policy changes:", error);
      alert("Save failed");
    }
  };


useEffect(() => {
  const fetchPolicies = async () => {
    try {
      const res = await axiosInstance.get("/api/get-policy");

      res.data.policy.forEach((p) => {
        if (p.type === "return_refund") setRefundValue(p.content);
        if (p.type === "shipping") setShippingValue(p.content);
        if (p.type === "terms") setTermsValue(p.content);
        if (p.type === "about") setAboutValue(p.content);
        if (p.type === "privacy") setPrivacyValue(p.content);
      });

    } catch (err) {
      console.error(err);
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

        <div className="flex items-center gap-2">
          <Link to={"/admin/settings/Policies"}>
            <button className="border border-[#1F3B5B] text-[#1F3B5B] bg-white text-[12px] font-medium px-3 py-1.5 rounded-[4px]">
              Cancel
            </button>
          </Link>
          <button
            className="bg-[#1F3B5B] text-white text-[12px] font-medium px-3 py-1.5 rounded-[4px]"
            onClick={saveChanges}
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <div>
          <h2 className="text-[18px] font-semibold text-[#1F2937] mb-4">
            Refund & Cancellation Policy
          </h2>
          <div className=" border-[#D1D5DB] rounded-md bg-white p-4">
            <ReactQuill
              theme="snow"
              value={refundValue}
              onChange={setRefundValue}
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
              value={termsValue}
              onChange={setTermsValue}
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
              value={faqValue}
              onChange={setFaqValue}
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
              value={aboutValue}
              onChange={setAboutValue}
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
              value={privacyValue}
              onChange={setPrivacyValue}
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

export default PoliciesSettingsEdit;
