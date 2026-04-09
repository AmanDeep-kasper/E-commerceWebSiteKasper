import { ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TransporterDetail = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();

  // temporary static detail data
  const transporterData = useMemo(
    () => [
      {
        uuid: "blue-dart-001",
        transporterName: "Blue Dart",
        registrationNumber: "27AADCD3196Q1ZL",
        trackingUrl: "https://www.bluedart.com/tracking",
        contactName: "Amit Iyer",
        phone: "+91 9876543210",
        email: "support@transporter.com",
        status: "Active",

        deliveryOptions: {
          forward: true,
          return: false,
          rto: true,
          fast: true,
          oneDay: false,
        },

        slaForwardDays: "7",
        slaReturnDays: "",
        slaRtoDays: "10",
        slaFastDays: "3",

        codEnabled: true,
        codFlatRate: "40",
      },
      {
        uuid: "dtdc-002",
        transporterName: "DTDC",
        registrationNumber: "09AAACT1234A1Z5",
        trackingUrl: "https://www.dtdc.in/tracking",
        contactName: "Rohit Sharma",
        phone: "+91 9999999999",
        email: "help@dtdc.com",
        status: "Paused",

        deliveryOptions: {
          forward: true,
          return: true,
          rto: true,
          fast: false,
          oneDay: false,
        },

        slaForwardDays: "5",
        slaReturnDays: "6",
        slaRtoDays: "8",
        slaFastDays: "",

        codEnabled: false,
        codFlatRate: "0",
      },
    ],
    [],
  );

  const transporter = useMemo(() => {
    if (!uuid) return transporterData[0] || null;

    return (
      transporterData.find(
        (item) => item.uuid?.toLowerCase() === uuid.toLowerCase(),
      ) || null
    );
  }, [uuid, transporterData]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    transporterName: "",
    registrationNumber: "",
    trackingUrl: "",
    contactName: "",
    phone: "",
    email: "",
    status: "Active",

    deliveryOptions: {
      forward: false,
      return: false,
      rto: false,
      fast: false,
      oneDay: false,
    },

    slaForwardDays: "",
    slaReturnDays: "",
    slaRtoDays: "",
    slaFastDays: "",

    codEnabled: false,
    codFlatRate: "",
  });

  useEffect(() => {
    if (!transporter) return;

    setFormData({
      transporterName: transporter.transporterName || "",
      registrationNumber: transporter.registrationNumber || "",
      trackingUrl: transporter.trackingUrl || "",
      contactName: transporter.contactName || "",
      phone: transporter.phone || "",
      email: transporter.email || "",
      status: transporter.status || "Active",

      deliveryOptions: {
        forward: transporter.deliveryOptions?.forward || false,
        return: transporter.deliveryOptions?.return || false,
        rto: transporter.deliveryOptions?.rto || false,
        fast: transporter.deliveryOptions?.fast || false,
        oneDay: transporter.deliveryOptions?.oneDay || false,
      },

      slaForwardDays: transporter.slaForwardDays || "",
      slaReturnDays: transporter.slaReturnDays || "",
      slaRtoDays: transporter.slaRtoDays || "",
      slaFastDays: transporter.slaFastDays || "",

      codEnabled: transporter.codEnabled || false,
      codFlatRate: transporter.codFlatRate || "",
    });
  }, [transporter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggle = (key) => {
    setFormData((prev) => ({
      ...prev,
      deliveryOptions: {
        ...prev.deliveryOptions,
        [key]: !prev.deliveryOptions[key],
      },
    }));
  };

  const handleCodToggle = () => {
    setFormData((prev) => ({
      ...prev,
      codEnabled: !prev.codEnabled,
    }));
  };

  const handleSaveChanges = () => {
    console.log("Updated Transporter Data:", formData);
    setIsEditModalOpen(false);
  };

  const renderSupportText = (isSupported) => {
    return isSupported ? (
      <span className="text-[#00A63E] font-medium">Supported</span>
    ) : (
      <span className="text-[#D53B35] font-medium">Not Supported</span>
    );
  };

  if (!transporter) {
    return (
      <div className="p-[24px] bg-[#F6F8F9] rounded-md min-h-screen">
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-[20px] font-semibold text-gray-800 mb-4">
            Transporter not found
          </h2>
          <button
            onClick={() => navigate("/transporter")}
            className="bg-[#1C3753] text-white px-4 py-2 rounded-lg"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-[24px] bg-[#F6F8F9] rounded-md min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin/transporter")}
                className="text-[#1C3753] hover:bg-gray-300 rounded-full transform ease-in-out text-sm"
              >
                <ChevronLeft />
              </button>
              <h2 className="text-[20px] font-semibold text-gray-800">
                {transporter.transporterName || "--"}
              </h2>
              <div className="">
                {/* <p className="text-[#686868] text-[14px]">Status</p> */}
                <span
                  className={`font-medium  ${
                    transporter.status === "Active"
                      ? "text-[#00A63E] bg-[#E0F4DE] py-1 px-4 rounded-lg"
                      : transporter.status === "Inactive"
                        ? "text-[#D53B35] py-1 px-4 rounded-lg"
                        : "text-[#686868] py-1 px-4 rounded-lg"
                  }`}
                >
                  {transporter.status || "--"}
                </span>
              </div>
            </div>
            

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-[#1C3753] text-white px-6 py-2 rounded-lg hover:bg-[#344558]"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Detail Cards */}
        <div className="flex items-start justify-between gap-4">
          {/* Left */}
          <div className="flex flex-col w-[60%] space-y-4">
            <div className="flex flex-col space-y-3 bg-[#FFFFFF] px-3 py-3 rounded-xl">
              <h1 className="font-medium">Basic Information</h1>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[#686868] text-[14px]">
                    Transporter Name
                  </p>
                  <span>{transporter.transporterName || "--"}</span>
                </div>

                <div>
                  <p className="text-[#686868] text-[14px]">
                    Registration Number
                  </p>
                  <span>{transporter.registrationNumber || "--"}</span>
                </div>
              </div>

              <div>
                <p className="text-[#686868] text-[14px]">Tracking ID URL</p>
                <span>{transporter.trackingUrl || "--"}</span>
              </div>

              
            </div>

            <div className="flex flex-col space-y-3 bg-[#FFFFFF] px-3 py-3 rounded-xl">
              <h1 className="font-medium">SLA Configuration</h1>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#686868] text-[14px]">
                    Expected Forward Delivery Time
                  </p>
                  <span>
                    {transporter.slaForwardDays
                      ? `${transporter.slaForwardDays} days`
                      : "--"}
                  </span>
                </div>

                <div>
                  <p className="text-[#686868] text-[14px]">
                    Expected Return Delivery Time
                  </p>
                  <span>
                    {transporter.slaReturnDays
                      ? `${transporter.slaReturnDays} days`
                      : "--"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#686868] text-[14px]">
                    Expected RTO Delivery Time
                  </p>
                  <span>
                    {transporter.slaRtoDays
                      ? `${transporter.slaRtoDays} days`
                      : "--"}
                  </span>
                </div>

                <div>
                  <p className="text-[#686868] text-[14px]">
                    Expected Fast Delivery Time
                  </p>
                  <span>
                    {transporter.slaFastDays
                      ? `${transporter.slaFastDays} days`
                      : "--"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3 bg-[#FFFFFF] px-3 py-3 rounded-xl">
              <h1 className="font-medium">COD Charges</h1>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#686868] text-[14px]">
                    Cash On Delivery (COD)
                  </p>
                  <span
                    className={
                      transporter.codEnabled
                        ? "text-[#00A63E] font-medium"
                        : "text-[#D53B35] font-medium"
                    }
                  >
                    {transporter.codEnabled ? "Supported" : "Not Supported"}
                  </span>
                </div>

                <div>
                  <p className="text-[#686868] text-[14px]">
                    COD Charge Flat Rate
                  </p>
                  <span>₹{transporter.codFlatRate || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col w-[40%] space-y-4">
            <div className="flex flex-col space-y-3 bg-[#FFFFFF] px-3 py-3 rounded-xl">
              <h1 className="font-medium">Contact Details</h1>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-[#686868] text-[14px]">
                    Contact Person Name
                  </p>
                  <span>{transporter.contactName || "--"}</span>
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-[#686868] text-[14px]">Phone Number</p>
                  <span>{transporter.phone || "--"}</span>
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-[#686868] text-[14px]">Email Address</p>
                  <span>{transporter.email || "--"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3 bg-[#FFFFFF] px-3 py-3 rounded-xl">
              <h1 className="font-medium">Delivery Type</h1>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-[#686868] text-[14px]">Forward</p>
                  {renderSupportText(transporter.deliveryOptions?.forward)}
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-[#686868] text-[14px]">Return</p>
                  {renderSupportText(transporter.deliveryOptions?.return)}
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-[#686868] text-[14px]">RTO</p>
                  {renderSupportText(transporter.deliveryOptions?.rto)}
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-[#686868] text-[14px]">Fast Delivery</p>
                  {renderSupportText(transporter.deliveryOptions?.fast)}
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-[#686868] text-[14px]">One-Day Delivery</p>
                  {renderSupportText(transporter.deliveryOptions?.oneDay)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setIsEditModalOpen(false);
            }
          }}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-lg max-h-[90vh] flex flex-col"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-[#1C1C1C]">
                Edit Transporter
              </h3>

              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4 overflow-y-auto">
              <form className="space-y-4">
                <p className="font-medium text-[14px] mb-2">
                  Basic Information
                </p>

                <div>
                  <label className="text-sm text-gray-600">
                    Transporter Name
                  </label>
                  <input
                    name="transporterName"
                    value={formData.transporterName}
                    onChange={handleInputChange}
                    placeholder="Enter transporter name"
                    className="w-full mt-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Registration Number
                  </label>
                  <input
                  readOnly
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    placeholder="Enter registration number"
                    className="w-full mt-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 text-[#686868] bg-[#DEDEDE] focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Tracking ID URL
                  </label>
                  <input
                    name="trackingUrl"
                    value={formData.trackingUrl}
                    onChange={handleInputChange}
                    placeholder="Enter tracking id url"
                    className="w-full mt-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <p className="font-medium text-[14px] mb-2">Contact Details</p>

                <div>
                  <label className="text-sm text-gray-600">
                    Contact Person Name
                  </label>
                  <input
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    placeholder="Enter contact person name"
                    className="w-full mt-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Phone Number</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full mt-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Email Address</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className="w-full mt-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full mt-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <p className="font-medium text-[14px] mb-2">Delivery Type</p>

                <div className="border p-4 rounded-lg space-y-3">
                  {[
                    { key: "forward", label: "Forward Delivery" },
                    { key: "return", label: "Return Delivery" },
                    { key: "rto", label: "RTO" },
                    { key: "fast", label: "Fast Delivery" },
                    { key: "oneDay", label: "One Day Delivery" },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0"
                    >
                      <span>{item.label}</span>
                      <button
                        type="button"
                        onClick={() => handleToggle(item.key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                          formData.deliveryOptions[item.key]
                            ? "bg-[#1C3753]"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                            formData.deliveryOptions[item.key]
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <p className="font-medium text-[14px] mb-2">
                  SLA Configuration
                </p>

                <div>
                  <label className="text-sm text-gray-600">
                    Expected Forward Delivery Time
                  </label>
                  <input
                    type="number"
                    name="slaForwardDays"
                    value={formData.slaForwardDays}
                    onChange={handleInputChange}
                    placeholder="Enter expected delivery time in days"
                    className="w-full mt-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Expected Return Delivery Time
                  </label>
                  <input
                    type="number"
                    name="slaReturnDays"
                    value={formData.slaReturnDays}
                    onChange={handleInputChange}
                    placeholder="Enter expected delivery time in days"
                    className="w-full mt-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Expected RTO Delivery Time
                  </label>
                  <input
                    type="number"
                    name="slaRtoDays"
                    value={formData.slaRtoDays}
                    onChange={handleInputChange}
                    placeholder="Enter expected delivery time in days"
                    className="w-full mt-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Expected Fast Delivery Time
                  </label>
                  <input
                    type="number"
                    name="slaFastDays"
                    value={formData.slaFastDays}
                    onChange={handleInputChange}
                    placeholder="Expected Fast Delivery Time"
                    className="w-full mt-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <p className="font-medium text-[14px] mb-2">COD Charges</p>

                <div className="border p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-gray-600 text-sm">
                      Cash On Delivery (COD)
                    </span>
                    <button
                      type="button"
                      onClick={handleCodToggle}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                        formData.codEnabled ? "bg-[#1C3753]" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                          formData.codEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">
                      COD Charge Flat Rate
                    </label>
                    <input
                      type="number"
                      name="codFlatRate"
                      value={formData.codFlatRate}
                      onChange={handleInputChange}
                      placeholder="Enter COD charge in rupees(₹)"
                      className="w-full mt-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 px-6 py-4 border-t bg-white">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-[#1C3753] text-white hover:bg-[#344558]"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransporterDetail;