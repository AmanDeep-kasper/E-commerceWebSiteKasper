import React, { useState } from "react";
import { Eye, EyeOff, Plus } from "lucide-react";

const PaymentSettingsForm = () => {
  const [showRazorpayKey, setShowRazorpayKey] = useState(false);
  const [showStripeKey, setShowStripeKey] = useState(false);

  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "Prateek Lamba",
    bankName: "Kotak Mahindra Bank",
    accountNumber: "62462424127897",
    ifscCode: "KKBK0005035",
  });

  const handleInputChange = (field, value) => {
    setBankDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const maskedRazorpayKey = "***************";
  const maskedStripeKey = "***************";

  const inputClass =
    "w-full h-[38px] rounded-[6px] border border-[#D1D5DB] bg-[#F9FAFB] px-3 text-[13px] text-[#222222] outline-none focus:border-[#2563EB]";

  return (
    <div className="w-full bg-[#F8FAFC] p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-[28px] font-semibold text-[#222222] leading-none">
            Payments
          </h1>
          <p className="text-[13px] text-[#7B7B7B] mt-1">
            Controls how payments are accepted, settled, and recorded
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="border border-[#1F3B5B] text-[#1F3B5B] bg-white text-[12px] font-medium px-3 py-1.5 rounded-[4px]">
            Cancel
          </button>
          <button className="bg-[#1F3B5B] text-white text-[12px] font-medium px-3 py-1.5 rounded-[4px]">
            Save Changes
          </button>
        </div>
      </div>

      {/* Payment Gateway Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[16px] font-medium text-[#222222]">
          Payment Gateway
        </h2>

        <button className="flex items-center gap-2 bg-[#1F3B5B] text-white text-[12px] font-medium px-3 py-2 rounded-[6px]">
          <Plus size={14} />
          Add New Gateway
        </button>
      </div>

      {/* Razorpay Card */}
      <div className="bg-white rounded-[12px] p-4 mb-3 border border-[#EEF2F6]">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-[18px] font-medium text-[#222222]">Razorpay</h3>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 bg-[#E7F8EC] text-[#16A34A] text-[12px] font-medium px-2.5 py-1 rounded-[6px]">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              Connected
            </span>

            <button className="bg-[#1F3B5B] text-white text-[12px] font-medium px-3 py-1.5 rounded-[6px]">
              Disconnect
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-[14px] font-medium text-[#222222]">Key ID</h4>
            </div>

            <div className="text-right text-[14px] text-[#222222] font-medium">
              rzp_live_****A9F
            </div>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-[14px] font-medium text-[#222222]">
                Secret Key
              </h4>
            </div>

            <div className="flex items-center gap-2 text-right">
              <span className="text-[14px] text-[#222222] font-medium">
                {showRazorpayKey ? "rzp_secret_demo_key" : maskedRazorpayKey}
              </span>
              <button onClick={() => setShowRazorpayKey((prev) => !prev)}>
                {showRazorpayKey ? (
                  <Eye size={16} className="text-[#222222]" />
                ) : (
                  <EyeOff size={16} className="text-[#222222]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Card */}
      <div className="bg-white rounded-[12px] p-4 mb-5 border border-[#EEF2F6]">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-[18px] font-medium text-[#222222]">Stripe</h3>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 bg-[#F3F4F6] text-[#6B7280] text-[12px] font-medium px-2.5 py-1 rounded-[6px]">
              <span className="w-2 h-2 rounded-full bg-[#9CA3AF]" />
              Disconnected
            </span>

            <button className="bg-[#1F3B5B] text-white text-[12px] font-medium px-3 py-1.5 rounded-[6px]">
              Connect
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-[14px] font-medium text-[#222222]">Key ID</h4>
            </div>

            <div className="text-right text-[14px] text-[#222222] font-medium">
              str_live_****A9F
            </div>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-[14px] font-medium text-[#222222]">
                Secret Key
              </h4>
            </div>

            <div className="flex items-center gap-2 text-right">
              <span className="text-[14px] text-[#222222] font-medium">
                {showStripeKey ? "str_secret_demo_key" : maskedStripeKey}
              </span>
              <button onClick={() => setShowStripeKey((prev) => !prev)}>
                {showStripeKey ? (
                  <Eye size={16} className="text-[#222222]" />
                ) : (
                  <EyeOff size={16} className="text-[#222222]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Account Details */}
      <div>
        <h2 className="text-[16px] font-medium text-[#222222] mb-3">
          Bank Account Details
        </h2>

        <div className="bg-white rounded-[12px] border border-[#EEF2F6] overflow-hidden">
          <div className="flex items-start justify-between gap-6 px-4 py-4 border-b border-[#E5E7EB]">
            <div className="min-w-[220px]">
              <h3 className="text-[14px] font-medium text-[#222222]">
                Account Holder Name
              </h3>
              <p className="text-[11px] text-[#8A8A8A] mt-1">
                Name as per bank records.
              </p>
            </div>

            <div className="w-full max-w-[260px]">
              <input
                type="text"
                value={bankDetails.accountHolderName}
                onChange={(e) =>
                  handleInputChange("accountHolderName", e.target.value)
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex items-start justify-between gap-6 px-4 py-4 border-b border-[#E5E7EB]">
            <div className="min-w-[220px]">
              <h3 className="text-[14px] font-medium text-[#222222]">
                Bank Name
              </h3>
              <p className="text-[11px] text-[#8A8A8A] mt-1">
                Name of the bank where payments are settled.
              </p>
            </div>

            <div className="w-full max-w-[260px]">
              <input
                type="text"
                value={bankDetails.bankName}
                onChange={(e) => handleInputChange("bankName", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex items-start justify-between gap-6 px-4 py-4 border-b border-[#E5E7EB]">
            <div className="min-w-[220px]">
              <h3 className="text-[14px] font-medium text-[#222222]">
                Account Number
              </h3>
              <p className="text-[11px] text-[#8A8A8A] mt-1">
                Bank account number used for settlement.
              </p>
            </div>

            <div className="w-full max-w-[260px]">
              <input
                type="text"
                value={bankDetails.accountNumber}
                onChange={(e) =>
                  handleInputChange("accountNumber", e.target.value)
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex items-start justify-between gap-6 px-4 py-4">
            <div className="min-w-[220px]">
              <h3 className="text-[14px] font-medium text-[#222222]">
                IFSC Code
              </h3>
              <p className="text-[11px] text-[#8A8A8A] mt-1">
                Used to identify your bank branch.
              </p>
            </div>

            <div className="w-full max-w-[260px]">
              <input
                type="text"
                value={bankDetails.ifscCode}
                onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettingsForm;