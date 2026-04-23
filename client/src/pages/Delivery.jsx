import React, { useEffect, useState } from "react";
import PriceDetails from "../components/PriceDetails";
import { Trash2, MapPin, ChevronLeft } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddressForm from "../components/forms/AddressForm";
import EmptyState from "../components/EmptyState";
import axiosInstance from "../api/axiosInstance";
import {
  fetchAddresses,
  selectAddress,
  removeAddress,
} from "../redux/cart/addressSlice";

function Delivery() {
  const { cartItems, totalPrice, totalItems, totalDiscount } = useSelector(
    (s) => s.cart,
  );

  const { addresses, selectedAddress } = useSelector((s) => s.address);
  const safeAddresses = Array.isArray(addresses) ? addresses : [];

  // console.log(safeAddresses);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addressData, setAddressData] = useState(null);

  // Select existing saved address
  const handleSelectAddress = (addr) => {
    dispatch(selectAddress(addr));
  };

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);

      const res = await axiosInstance.get("/address/all-addresses");
      console.log("Address API response:", res.data);
      setAddressData(res.data);

      const allAddresses = Array.isArray(res?.data?.data?.addresses)
        ? res.data.data.addresses
        : Array.isArray(res?.data?.addresses)
          ? res.data.addresses
          : [];

      dispatch({
        type: "address/setAddresses",
        payload: allAddresses,
      });
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      toast.error(error?.response?.data?.message || "Failed to load addresses");
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // console.log(addressData?.data?.addresses);

  // Delete address
  const handleDeleteAddress = async (addr) => {
    try {
      await axiosInstance.delete(`/address/delete-address/${addr._id}`);

      await fetchAddresses();

      toast.success("Address removed successfully");
    } catch (error) {
      console.error("Delete address error:", error);
      toast.error(error?.response?.data?.message || "Failed to delete address");
    }
  };

  // Proceed to payment
  const goToPayment = () => {
    if (!selectedAddress) {
      toast.error("Please select an address before proceeding");
      return;
    }
    navigate("/checkout/payment");
  };

  // Redirect if cart empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/bag", { replace: true });
    }
  }, [cartItems, navigate]);

  // Auto-select default address or if only one address exists
  useEffect(() => {
    if (safeAddresses.length === 1) {
      dispatch(selectAddress(safeAddresses[0]));
    } else {
      const defaultAddr = safeAddresses.find((a) => a.isDefault);
      if (defaultAddr) {
        dispatch(selectAddress(defaultAddr));
      }
    }
  }, [safeAddresses, dispatch]);

  const canProceed = Boolean(selectedAddress);

  return (
    <>
      <Navbar />
      <section className="lg:px-20 md:px-[60px] md:py-4 bg-gray-50 min-h-screen mt-20">
        <div className="flex flex-col lg:flex-row justify-between md:gap-6 ">
          {/* Address Section */}
          <div className="w-full lg:w-2/3 p-4 md:p-6 md:shadow-sm bg-white md:rounded-md">
            <div className="flex justify-between items-center mb-6">
              <div className="text-lg sm:text-xl flex gap-2 items-center font-light text-gray-800">
                <Link to="/bag">
                  <ChevronLeft className="w-8 h-8" />
                </Link>{" "}
                <span className="font-marcellus text-[#1800AC]">
                  {" "}
                  Delivery Address
                </span>
              </div>
              <button
                onClick={() => setOpen(true)}
                className="bg-[#0C0057] hover:bg-black text-white rounded-lg px-6 py-2 text-sm font-medium transition-colors"
              >
                + Add New Address
              </button>
            </div>

            {/* Saved Addresses */}
            {addressData?.data?.addresses?.length > 0 ? (
              <div className="space-y-3">
                {addressData.data?.addresses?.map((addr) => (
                  <div
                    key={addr._id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedAddress?._id === addr._id
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleSelectAddress(addr)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">
                            {addr.fullName} • {addr.phone}
                          </p>

                          {/* Address type tag */}
                          {addr.addressType && (
                            <span className="text-xs px-2 py-0.5 bg-white rounded-md border-[#1C3753] border text-[#1C3753]">
                              {addr.addressType}
                            </span>
                          )}

                          {/* Default badge */}
                          {addr.isDefault === true && (
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md border-[#1C3753] border">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600">
                          {addr.address},{addr.country}, {addr.street},{" "}
                          {addr.city}, {addr.state} - {addr.pinCode}
                        </p>
                        {addr.email && (
                          <p className="text-sm text-gray-500">{addr.email}</p>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAddress(addr);
                            setOpen(true);
                          }}
                          className="text-[#006EE1] hover:text-gray-800 text-sm rounded-full p-1 hover:bg-gray-100"
                        >
                          Edit Address
                        </button>
                      </div>

                      {/* Edit & Delete */}
                      <div className="flex gap-2">
                        {/* <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAddress(addr);
                            setOpen(true);
                          }}
                          className="text-gray-500 hover:text-gray-800 text-sm rounded-full p-1 hover:bg-gray-100"
                        >
                          Edit
                        </button> */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(addr);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm rounded-full p-1 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* <div className="flex justify-between items-start ">
                  <div className="space-y-1  w-full">
                    <p className="font-medium text-gray-900 text-lg mt-2">
                      Select a delivery type
                    </p>
                    <div className="flex flex-col items-start gap-2 border rounded-lg p-2">
                      <div className="flex gap-4">
                        <input type="radio" name="input" className="w-5" />
                        <div>
                          <p className="text-lg">Standard Delivery</p>
                          <span className="text-sm">5-8 business days</span>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <input type="radio" name="input" className="w-5" />
                        <div>
                          <p className="text-lg">Fast Delivery</p>
                          <span className="text-sm">1-3 business days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            ) : (
              <EmptyState
                heading="No Addresses Saved"
                description="You haven’t added any delivery addresses yet. Add one to make your checkout faster."
                icon={MapPin}
                ctaLabel="Add Address"
                onCtaClick={() => setOpen(true)}
              />
            )}
          </div>

          {/* Price Details Section */}
          <PriceDetails
            totalItems={totalItems}
            totalDiscount={totalDiscount}
            totalPrice={totalPrice}
            product={cartItems}
            canProceed={canProceed}
            step="delivery"
            goToPayment={goToPayment}
          />
        </div>
      </section>

      {/* Address Form Modal */}
      {open && (
        <AddressForm
          onClose={() => {
            setOpen(false);
            setEditingAddress(null);
            fetchAddresses();
          }}
          initialData={editingAddress}
        />
      )}

      <Footer />
    </>
  );
}

export default Delivery;
