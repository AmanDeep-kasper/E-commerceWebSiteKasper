import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Toggle = ({ checked, onChange }) => (
  <label className="inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only"
      checked={checked}
      onChange={onChange}
    />
    <div className="w-10 h-5 bg-gray-200 rounded-full relative transition">
      <div
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition ${
          checked ? "translate-x-5 bg-amber-500" : ""
        }`}
      />
    </div>
  </label>
);

function PaymentSettings() {
  const [form, setForm] = useState({
    onlinePayments: false,
    razorpay: false,
    creditCard: false,
    emi: false,
    cod: false,
  });

  const update = (k) => setForm((f) => ({ ...f, [k]: !f[k] }));

  const [toogleBtn, setToogleBtn] = useState(false);
  const [toogleBtn2, setToogleBtn2] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-[20px] mb-3">Payments</h1>
          <span className="text-[#686868] text-[14px]">
            Controls how payments are accepted, settled, and recorded
          </span>
        </div>
        <div>
          <Link
            to={"/admin/settings/payment-form"}
            className="inline-flex items-center bg-[#1C3753] text-white gap-2 rounded-md border px-5 py-1.5 text-sm hover:text-gray-50"
          >
            Edit
          </Link>
        </div>
      </div>
      <h1 className="font-semibold text-[16px] mb-3 mt-4">Payment Gateway</h1>
      <div className="bg-white p-4 rounded-lg space-y-5">

  <div className="flex items-start justify-between">

    {/* Left Section */}
    <div className="flex flex-col space-y-2">
      <h1 className="text-[18px] font-semibold">Razorpay</h1>

      <div className="flex flex-col text-[14px] text-[#686868]">
        <span>Key ID</span>
        <span>Secret Key</span>
      </div>
    </div>

    {/* Right Section */}
    <div className="flex flex-col space-y-3 items-end">

      {/* Connected Status */}
      <div className="px-3 py-1 bg-[#E0F4DE] text-[#00A63E] flex items-center gap-2 rounded-lg text-sm">
        <span className="text-[18px]">●</span>
        <span>Connected</span>
      </div>

      {/* Key ID */}
      <div className="flex items-center gap-3">
        <span className="text-[14px] font-medium">
          {toogleBtn ? "rzp_live_ABCD123A9F" : "rzp_live_****A9F"}
        </span>

        <button onClick={() => setToogleBtn(prev => !prev)}>
          {toogleBtn ? <EyeOff size={18}/> : <Eye size={18}/>}
        </button>
      </div>

      {/* Secret Key */}
      <div className="flex items-center gap-3">
        <span className="text-[14px] font-medium">
          {toogleBtn2 ? "hQ9XK7ZB6N2s5A4E8Y" : "***************"}
        </span>

        <button onClick={() => setToogleBtn2(prev => !prev)}>
          {toogleBtn2 ? <EyeOff size={18}/> : <Eye size={18}/>}
        </button>
      </div>

    </div>

  </div>

</div>

      <h1 className="font-semibold mt-4">Bank Account Details</h1>
      <div className="bg-[#FFFFFF] p-4 rounded-lg space-y-5 mt-2">
        <div className="flex items-start justify-between  border-b">
          <div className="mb-2">
            <h1>Account Holder Name</h1>
            <span className="text-[#686868] text-[14px]">
              Name as per bank records.
            </span>
          </div>
          <div className="font-semibold">Prateek Lamba</div>
        </div>
        <div className="flex items-start justify-between  border-b">
          <div className="mb-2">
            <h1>Bank Name</h1>
            <span className="text-[#686868] text-[14px]">
              Name of the bank where payments are settled.
            </span>
          </div>
          <div className="font-semibold">
            Kotak Mahindra Bank
          </div>
        </div>
        <div className="flex items-start justify-between  border-b">
          <div className="mb-2">
            <h1>Account Number</h1>
            <span className="text-[#686868] text-[14px]">
              Bank account number used for settlement..
            </span>
          </div>
          <div className="font-semibold">
            **********7897
          </div>
        </div>
        <div className="flex items-start justify-between  border-b">
          <div className="mb-2">
            <h1>IFSC Code</h1>
            <span>Used to identify your bank branch.</span>
          </div>
          <div className="font-semibold">KKBK0005035</div>
        </div>
      </div>
    </>
  );
}

export default PaymentSettings;
