import React, { useEffect, useState } from "react";
import { X, House, Building2, MapPin } from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createAddress, editAddress } from "../../redux/cart/addressSlice";

const initialFormState = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  pinCode: "",
  state: "",
  city: "",
  addressType: "home",
  isDefault: false,
};

const AddressForm = ({ initialData = null, onClose, inline = false }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setFormData(initialData || initialFormState);
    setErrors({});
  }, [initialData]);

  const validateInputs = () => {
    const newErrors = {};
    const { fullName, phone, email, pinCode, address, city, state } = formData;

    if (!fullName.trim()) newErrors.fullName = "Full name is required";

    if (!phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(phone))
      newErrors.phone = "Phone must be 10 digits";

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email address";

    if (!pinCode.trim()) newErrors.pinCode = "Pincode is required";
    else if (!/^\d{6}$/.test(pinCode))
      newErrors.pinCode = "Pincode must be 6 digits";

    if (!address.trim()) newErrors.address = "Address is required";

    if (!city.trim()) newErrors.city = "City is required";
    else if (!/^[A-Za-z ]+$/.test(city))
      newErrors.city = "City should contain only alphabets";

    if (!state.trim()) newErrors.state = "State is required";
    else if (!/^[A-Za-z ]+$/.test(state))
      newErrors.state = "State should contain only alphabets";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleNumberChange = (name, value, maxLength) => {
    const onlyNumbers = value.replace(/[^0-9]/g, "").slice(0, maxLength);

    setFormData((prev) => ({
      ...prev,
      [name]: onlyNumbers,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
      errors[field] ? "border-red-500" : "border-gray-300"
    }`;

  const ErrorText = ({ name }) =>
    errors[name] ? (
      <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
    ) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    setIsSubmitting(true);

    try {
      if (initialData?._id) {
        const res = await dispatch(
          editAddress({ id: initialData._id, data: formData }),
        ).unwrap();

        toast.success(res?.message || "Address updated successfully");
        // ✅ Pass true to indicate that address was updated
        onClose(true);
      } else {
        const res = await dispatch(createAddress(formData)).unwrap();

        toast.success(res?.message || "Address added successfully");
        // ✅ Pass true to indicate that address was created
        onClose(true);
      }

      setFormData(initialFormState);
      setErrors({});
    } catch (err) {
      toast.error(err || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Handle cancel/close without refresh
  const handleClose = () => {
    onClose(false); // Pass false to indicate no changes were made
  };

  return (
    <div
      className={`${
        inline
          ? "bg-white rounded-lg p-6 shadow-sm"
          : "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      }`}
    >
      <div
        className={`${
          inline
            ? "w-full"
            : "bg-white rounded-xl w-full max-w-md lg:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        }`}
      >
        {!inline && (
          <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
            <h1 className="text-lg sm:text-xl font-semibold font-marcellus text-[#1800AC]">
              {initialData ? "Edit Address" : "Add New Address"}
            </h1>
            <button
              type="button"
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        )}

        <form
          noValidate
          className={`${inline ? "" : "p-6"} flex flex-col gap-6`}
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name <span className="text-[#D53B35]">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={inputClass("fullName")}
              />
              <ErrorText name="fullName" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Phone Number <span className="text-[#D53B35]">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) =>
                  handleNumberChange("phone", e.target.value, 10)
                }
                className={inputClass("phone")}
              />
              <ErrorText name="phone" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Email <span className="text-[#D53B35]">*</span>
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass("email")}
              />
              <ErrorText name="email" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Pincode <span className="text-[#D53B35]">*</span>
              </label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={(e) =>
                  handleNumberChange("pinCode", e.target.value, 6)
                }
                className={inputClass("pinCode")}
              />
              <ErrorText name="pinCode" />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Address <span className="text-[#D53B35]">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                placeholder="House no, Building, Street, Area"
                className={`${inputClass("address")} resize-none`}
              />
              <ErrorText name="address" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                City <span className="text-[#D53B35]">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={inputClass("city")}
              />
              <ErrorText name="city" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                State <span className="text-[#D53B35]">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={inputClass("state")}
              />
              <ErrorText name="state" />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Address Type</p>
            <div className="flex flex-wrap gap-3">
              {[
                { value: "home", icon: <House size={16} /> },
                { value: "work", icon: <Building2 size={16} /> },
                { value: "other", icon: <MapPin size={16} /> },
              ].map((type) => (
                <button
                  type="button"
                  key={type.value}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      addressType: type.value,
                    }))
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    formData.addressType === type.value
                      ? "border-[#1800AC] bg-white text-[#1800AC]"
                      : "border-gray-300 hover:border-gray-400 text-gray-700"
                  }`}
                >
                  {type.icon}
                  {type.value}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="w-5 h-5 text-blue-500 rounded focus:ring-blue-400"
            />
            <label htmlFor="isDefault" className="text-gray-700">
              Make this my default address
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {!inline && (
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border border-[#0C0057] rounded-lg text-[#1C3753] font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-[#1800AC] text-white font-medium rounded-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {initialData ? "Updating..." : "Saving..."}
                </>
              ) : initialData ? (
                "Update Address"
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
