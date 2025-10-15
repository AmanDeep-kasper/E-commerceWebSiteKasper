import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAddresses,
  editAddress,
  removeAddress,
} from "../redux/cart/addressSlice";
import AddressForm from "../components/forms/AddressForm";
import { toast } from "react-toastify";
import { Edit, Plus, Trash2, Phone, MapPin } from "lucide-react";
import EmptyState from "../components/EmptyState";

function Address() {
  const [open, setOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const { addresses } = useSelector((state) => state.address);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  return (
    <div className="flex-1 font-inter">
      {/* Header */}
      <div className="md:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg shadow-sm ">
        <h1 className="text-lg sm:text-xl font-medium text-gray-800 font-inter">
          Saved Addresses ({addresses?.length || 0})
        </h1>
      </div>

      {/* Address List */}
      <div>
        {addresses?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {addresses.map((add) => (
              <div
                key={add._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full"
              >
                <div className="p-5 flex-grow">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-medium text-gray-900 capitalize">
                        {add.name}
                      </h2>
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {add.tag}
                      </span>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex items-center gap-2 text-gray-600 mb-5">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">{add.phone}</span>
                  </div>

                  {/* Address */}
                  <div className="text-gray-700 space-y-2 text-sm">
                    <p>{add.street}</p>
                    <p>
                      {add.city}, {add.state} - {add.zip}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex rounded-lg bg-gray-50 p-1">
                  <button
                    type="button"
                    disabled={add.isDefault}
                    onClick={() => {
                      if (!add.isDefault) {
                        dispatch(
                          editAddress({
                            id: add._id,
                            data: { ...add, isDefault: true },
                          })
                        );
                        toast.success("Default address updated");
                      }
                    }}
                    className={`flex-1 text-sm ${
                      add.isDefault
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    {add.isDefault ? "Default" : "Make Default"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingAddress(add);
                      setOpen(true);
                    }}
                    className="flex-1 text-sm text-gray-700 hover:text-gray-900"
                  >
                    <Edit size={16} /> Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => dispatch(removeAddress(add._id))}
                    className="flex-1 text-sm text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Add New Address */}
            <div
              className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400"
              onClick={() => setOpen(true)}
            >
              <Plus size={24} className="text-gray-500 mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">
                Add New Address
              </h3>
              <p className="text-sm text-gray-500 text-center">
                Click to add a new delivery address
              </p>
            </div>
          </div>
        ) : (
          <EmptyState
            heading="No Addresses Saved"
            description="You haven’t added any delivery addresses yet."
            icon={MapPin}
            ctaLabel="Add Address"
            onClick={() => setOpen(true)}
          />
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
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
