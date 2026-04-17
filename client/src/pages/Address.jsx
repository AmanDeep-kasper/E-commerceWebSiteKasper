import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAddresses,
  editAddress,
  removeAddress,
  setDefaultAddress,
} from "../redux/cart/addressSlice";
import AddressForm from "../components/forms/AddressForm";
import { toast } from "react-toastify";
import {
  Edit,
  Plus,
  Trash2,
  Phone,
  MapPin,
  Loader2,
  Home,
  Building,
  Star,
} from "lucide-react";
import EmptyState from "../components/EmptyState";

// Address Card Skeleton Loader
const AddressCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
    <div className="p-5 flex-grow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-5 w-28 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
    <div className="flex rounded-lg justify-between bg-gray-50 px-3 py-2">
      <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>
);

function Address() {
  const [open, setOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [updatingDefaultId, setUpdatingDefaultId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const { addresses, loading } = useSelector((state) => state.address);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  // const handleMakeDefault = async (addressId) => {
  //   await dispatch(setDefaultAddress(addressId));
  //   await dispatch(fetchAddresses());
  // if (addressId.isDefault || updatingDefaultId) return;

  // setUpdatingDefaultId(addressId._id);
  // try {
  //   const updatedAddress = { ...addressId, isDefault: true };
  //   const result = dispatch(
  //     editAddress({ id: addressId._id, data: updatedAddress })
  //   );
  //   if (!result.error) {
  //     toast.success("Default address updated");
  //   }
  // } finally {
  //   setUpdatingDefaultId(null);
  // }
  // };
  
  const handleMakeDefault = async (addressId) => {
    if (updatingDefaultId) return;

    setUpdatingDefaultId(addressId);

    try {
      const result = await dispatch(setDefaultAddress(addressId));

      if (!result.error) {
        toast.success("Default address updated");
      }
    } finally {
      setUpdatingDefaultId(null);
    }
  };

  const handleRemoveAddress = async (addressId) => {
    if (removingId) return;

    setRemovingId(addressId);
    try {
      const result = await dispatch(removeAddress(addressId));
      if (!result.error) {
        toast.success("Address removed successfully");
      }
    } finally {
      setRemovingId(null);
    }
  };

  const getAddressTypeIcon = (type) => {
    return type === "home" ? <Home size={14} /> : <Building size={14} />;
  };

  // Get addresses array safely
  const addressesList =
    addresses?.data?.addresses || addresses?.addresses || [];

  // Show loading overlay while fetching addresses
  if (loading) {
    return (
      <>
        <div className="flex-1 font-inter">
          <div className="md:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
            <div className="h-7 w-40 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[addressesList].map((i) => (
              <AddressCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex-1 font-inter mt-5">
      {/* Header */}
      <div className="md:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 font-inter">
            Saved Addresses
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your delivery locations
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1800AC] text-white rounded-lg hover:bg-[#1C3753]/90 transition-all shadow-sm"
        >
          <Plus size={18} />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Address List */}
      <div>
        {addressesList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {addressesList.map((add) => (
              <div
                key={add._id}
                className={`group relative bg-white rounded-xl shadow-sm border transition-all duration-300 overflow-hidden flex flex-col h-full ${
                  add.isDefault
                    ? "border-[#1C3753] shadow-md ring-1 ring-[#1C3753]/20"
                    : "border-gray-200 hover:shadow-md hover:border-gray-300"
                }`}
              >
                {/* Default Badge */}
                {add.isDefault && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-[#1800AC] text-white text-xs font-medium px-3 py-1 rounded-bl-lg flex items-center gap-1">
                      <Star size={12} className="fill-current" />
                      Default
                    </div>
                  </div>
                )}

                <div className="p-5 flex-grow">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-semibold text-gray-900">
                        {add?.fullName}
                      </h2>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-[#1C3753] border border-blue-100 capitalize">
                        {getAddressTypeIcon(add.addressType)}
                        {add.addressType}
                      </span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2 text-gray-600 mb-3 pb-3 border-b border-gray-100">
                    <Phone size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{add?.phone}</span>
                  </div>

                  {/* Address Details */}
                  <div className="space-y-1.5">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {add?.address || add?.street}
                    </p>
                    <p className="text-sm text-gray-600">
                      {add?.city}, {add?.state}
                    </p>
                    <p className="text-sm text-gray-600">
                      PIN Code: {add?.pinCode}
                    </p>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      {add?.country}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between bg-gray-50/80 px-4 py-2.5 border-t border-gray-100">
                  {/* Make Default */}
                  {!add.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleMakeDefault(add._id)}
                      disabled={updatingDefaultId === add._id}
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-[#1C3753] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updatingDefaultId === add._id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Star size={14} />
                      )}
                      Make Default
                    </button>
                  )}

                  {add.isDefault && (
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Star
                        size={12}
                        className="fill-[#1C3753] text-[#1C3753]"
                      />
                      Default Address
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAddress(add);
                        setOpen(true);
                      }}
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Edit size={14} />
                      Edit
                    </button>

                    <div className="w-px h-4 bg-gray-300"></div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => handleRemoveAddress(add._id)}
                      disabled={removingId === add._id}
                      className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {removingId === add._id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Address Card */}
            <div
              className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#1C3753] hover:bg-gray-50 transition-all duration-200 min-h-[280px] group"
              onClick={() => setOpen(true)}
            >
              <div className="p-3 bg-gray-100 rounded-full group-hover:bg-[#F0EEFF] transition-colors duration-200">
                <Plus
                  size={28}
                  className="text-gray-500 group-hover:text-[#1C3753]"
                />
              </div>
              <h3 className="font-medium text-gray-700 mb-1 mt-3 group-hover:text-[#1C3753]">
                Add New Address
              </h3>
              <p className="text-xs text-gray-400 text-center">
                Click to add a new delivery address
              </p>
            </div>
          </div>
        ) : (
          <EmptyState
            heading="No Addresses Saved"
            description="You haven't added any delivery addresses yet. Add your first address to get started."
            icon={MapPin}
            ctaLabel="Add New Address"
            onClick={() => setOpen(true)}
          />
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <AddressForm
            onClose={() => {
              setOpen(false);
              setEditingAddress(null);
            }}
            initialData={editingAddress}
          />
        </div>
      )}
    </div>
  );
}

export default Address;
