import React, { useEffect, useState } from "react";
import { X, House, Building2, MapPin } from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createAddress, editAddress } from "../../redux/cart/addressSlice";

const initialFormState = {
  name: "",
  phone: "",
  email: "",
  zip: "",
  street: "",
  city: "",
  state: "",
  tag: "Home", // default
  isDefault: false,
};

const AddressForm = ({ initialData = null, onClose, inline = false }) => {
  const [formData, setFormData] = useState(initialFormState);
  const dispatch = useDispatch();

  // Load edit data if available
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(initialFormState);
    }
  }, [initialData]);

  const validateInputs = () => {
    const { name, phone, zip, street, city, state, email } = formData;

    if (!name || !phone || !zip || !street || !city || !state) {
      toast.error("Please fill all required fields");
      return false;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return false;
    }

    if (!/^\d{6}$/.test(zip)) {
      toast.error("Enter a valid 6-digit pincode");
      return false;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Enter a valid email address");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      if (initialData?._id) {
        // update existing
        const res = await dispatch(
          editAddress({ id: initialData._id, data: formData })
        ).unwrap();
        toast.success(res.message || "Address updated");
      } else {
        // create new
        const res = await dispatch(createAddress(formData)).unwrap();
        toast.success(res.message || "Address added");
      }

      setFormData(initialFormState);
      onClose();
    } catch (err) {
      toast.error(err || "Something went wrong");
    }
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
        {/* Header */}
        {!inline && (
          <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
              {initialData ? "Edit Address" : "Add New Address"}
            </h1>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        )}

        {/* Form */}
        <form
          className={`${inline ? "" : "p-6"} flex flex-col gap-6`}
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                maxLength={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Pincode *
              </label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                required
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Address *
              </label>
              <textarea
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
                rows={3}
                placeholder="House no, Building, Street, Area"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                pattern="[A-Za-z ]+"
                title="City can only be in alphabets"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                pattern="[A-Za-z ]+"
                title="State can only be in alphabets"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Address Type */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Address Type *</p>
            <div className="flex flex-wrap gap-3">
              {[
                { value: "Home", icon: <House size={16} /> },
                { value: "Work", icon: <Building2 size={16} /> },
                { value: "Other", icon: <MapPin size={16} /> },
              ].map((type) => (
                <button
                  type="button"
                  key={type.value}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      tag: type.value,
                    }))
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    formData.tag === type.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
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
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              {initialData ? "Update Address" : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
