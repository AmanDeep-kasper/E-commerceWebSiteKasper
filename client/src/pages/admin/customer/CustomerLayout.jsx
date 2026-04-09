import React, { useMemo } from "react";
import { useParams, Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import customers from "../data/customer.json";
import ProfileCard from "../components/ProfileCard";
import ProfileSidebar from "../components/ProfileSidebar";
import { ChevronLeft } from "lucide-react";

function CustomerLayout() {
  const { id } = useParams();
  const location = useLocation();

  const customer = useMemo(
    () => customers.find((c) => String(c.id) === String(id)),
    [id],
  );

  const isEditPage = location.pathname.endsWith("/edit");

  if (!customer) return <div>Customer not found</div>;
  const navigate = useNavigate();

  const [form, setForm] = React.useState({
    fullName: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    gender: customer?.gender || "NA",
    dob: customer?.dob || "NA",
  });

  const [addressUpdate, setAddressUpdate] = React.useState({
    fullName: customer?.name || "",
    phoneNumber: customer?.phone || "",
    address: customer?.address || "",
    pinCode: customer?.zip_code || "",
    landMark: customer?.landMark || "",
    city: customer?.city || "",
    state: customer?.state || "",
    addressType: customer?.addressType || "",
  });

  const handleSave = (e) => {
    e.preventDefault();

    const payload = {
      personal: form,
      address: addressUpdate,
    };

    console.log("SAVE DATA 👉", payload);

    // ✅ RESET FORM
    setForm({
      fullName: "",
      email: "",
      phone: "",
      gender: "NA",
      dob: "NA",
    });

    setAddressUpdate({
      fullName: "",
      phoneNumber: "",
      address: "",
      pinCode: "",
      landMark: "",
      city: "",
      state: "",
      addressType: "",
    });

    // ✅ REDIRECT
    navigate("/admin/customers/");
  };

  return (
    <div className="p-6 bg-[#F6F8F9] min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link to={"/admin/customers"}>
            <ChevronLeft className="cursor-pointer" />
          </Link>
          <h1 className="text-xl font-semibold">Customer Details</h1>
        </div>

        {!isEditPage ? (
          <Link to="edit">
            <button className="border px-4 py-2 rounded-lg text-sm">
              Edit Customer
            </button>
          </Link>
        ) : (
          <div className="flex gap-2">
            <Link to="customer-info">
              <button className="px-4 py-2 border rounded-lg text-sm">
                Cancel
              </button>
            </Link>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#1C3753] text-white rounded-lg text-sm">
              Save
            </button>
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="flex gap-6 items-start">
        {/* LEFT */}
        <div className="w-[320px] shrink-0 space-y-4">
          <ProfileCard customer={customer} />
        </div>

        {/* RIGHT */}
        <div className="flex-1 space-y-4">
          <ProfileSidebar isEditPage={isEditPage} customer={customer} />
          <Outlet
            context={{
              customer,
              form,
              setForm,
              addressUpdate,
              setAddressUpdate,
              handleSave,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CustomerLayout;
