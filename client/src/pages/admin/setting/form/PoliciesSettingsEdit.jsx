import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Link } from "react-router-dom";

const PoliciesSettingsEdit = () => {
  const [value, setValue] = useState(`
    <p><strong>Example:</strong></p>
    <p>Returns are accepted within {{return_window}} days of delivery.</p>
    <p>Products must be unused, in original condition, and with all packaging intact.</p>
    <p>Refunds will be processed to the {{refund_method}} after the return is approved.</p>
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

        <div className="flex items-center gap-2">
            <Link to={"/admin/settings/Policies"}>
          <button className="border border-[#1F3B5B] text-[#1F3B5B] bg-white text-[12px] font-medium px-3 py-1.5 rounded-[4px]">
            Cancel
          </button>
          </Link>
          <button className="bg-[#1F3B5B] text-white text-[12px] font-medium px-3 py-1.5 rounded-[4px]">
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <div>
          <h2 className="text-[18px] font-semibold text-[#1F2937] mb-4">
            Return & Refund Policy
          </h2>
          <div className=" border-[#D1D5DB] rounded-md bg-white p-4">
            <ReactQuill
              theme="snow"
              value={value}
              onChange={setValue}
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
              value={value}
              onChange={setValue}
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
              value={value}
              onChange={setValue}
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
            Frequently Asked Question (FAQs)
          </h2>
          <div className=" border-[#D1D5DB] rounded-md bg-white p-4">
            <ReactQuill
              theme="snow"
              value={value}
              onChange={setValue}
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
           About Us
          </h2>
          <div className=" border-[#D1D5DB] rounded-md bg-white p-4">
            <ReactQuill
              theme="snow"
              value={value}
              onChange={setValue}
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
              value={value}
              onChange={setValue}
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
