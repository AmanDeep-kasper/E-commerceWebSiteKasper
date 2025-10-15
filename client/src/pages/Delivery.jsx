import React, { useEffect, useState } from "react";
import PriceDetails from "../components/PriceDetails";
import { Trash2, MapPin } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  selectAddress,
  removeAddress,
} from "../redux/cart/addressSlice"; 
import AddressForm from "../components/forms/AddressForm";
import EmptyState from "../components/EmptyState";

function Delivery() {
  const { cartItems, totalPrice, totalItems, totalDiscount } = useSelector(
    (s) => s.cart
  );

  const { addresses, selectedAddress } = useSelector((s) => s.address);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Select existing saved address
  const handleSelectAddress = (addr) => {
    dispatch(selectAddress(addr));
  };

  // Delete address
  const handleDeleteAddress = (addr) => {
    dispatch(removeAddress(addr._id)); // ✅ use _id
    toast.success("Address removed successfully");
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
    if (addresses.length === 1) {
      dispatch(selectAddress(addresses[0]));
    } else {
      const defaultAddr = addresses.find((a) => a.isDefault);
      if (defaultAddr) {
        dispatch(selectAddress(defaultAddr));
      }
    }
  }, [addresses, dispatch]);

  const canProceed = Boolean(selectedAddress);

  return (
    <>
      <Navbar />
      <section className="lg:px-20 md:px-[60px] md:py-4 bg-gray-50 min-h-screen">
        <div className="flex flex-col lg:flex-row justify-between md:gap-6 ">
          {/* Address Section */}
          <div className="w-full lg:w-2/3 p-4 md:p-6 md:shadow-sm bg-white md:rounded-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Delivery Address
              </h2>
              <button
                onClick={() => setOpen(true)}
                className="bg-[#212121] hover:bg-black text-white rounded-full px-6 py-2 text-sm font-medium transition-colors"
              >
                + Add New Address
              </button>
            </div>

            {/* Saved Addresses */}
            {addresses.length > 0 ? (
              <div className="space-y-3">
                {addresses.map((addr) => (
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
                            {addr.name} • {addr.phone}
                          </p>

                          {/* Address type tag */}
                          {addr.tag && (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                              {addr.tag}
                            </span>
                          )}

                          {/* Default badge */}
                          {addr.isDefault && (
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600">
                          {addr.street}, {addr.city}, {addr.state} - {addr.zip}
                        </p>
                        {addr.email && (
                          <p className="text-sm text-gray-500">{addr.email}</p>
                        )}
                      </div>

                      {/* Edit & Delete */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAddress(addr);
                            setOpen(true);
                          }}
                          className="text-gray-500 hover:text-gray-800 text-sm rounded-full p-1 hover:bg-gray-100"
                        >
                          Edit
                        </button>
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
          }}
          initialData={editingAddress}
        />
      )}

      <Footer />
    </>
  );
}

export default Delivery;
