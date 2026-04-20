import React, { useMemo, useState, useEffect } from "react";
import { useParams, Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import customers from "../data/customer.json";
import ProfileCard from "../components/ProfileCard";
import ProfileSidebar from "../components/ProfileSidebar";
import { ChevronLeft } from "lucide-react";
import axiosInstance from "../../../api/axiosInstance";

function CustomerLayout() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // const customer = useMemo(
  //   () => customers.find((c) => String(c.id) === String(id)),
  //   [id],
  // );

  const isEditPage = location.pathname.endsWith("/edit");

  const [form, setForm] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "NA",
    dob: "NA",
  });

  const [addressUpdate, setAddressUpdate] = React.useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    pinCode: "",
    landMark: "",
    city: "",
    state: "",
    addressType: "",
  });


   // Fetch customer from API
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/user/admin/detail/${id}`);
        console.log("Fetched customer:", response.data);
        
        // Adjust based on your API response structure
        const customerData = response.data?.user || response.data?.data || response.data;
        setCustomer(customerData);
        setError(null);
      } catch (err) {
        console.error("Error fetching customer:", err);
        setError(err.response?.data?.message || "Failed to load customer");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomer();
    }
  }, [id]);

  // if (!customer) return <div>Customer not found</div>;

  // const [form, setForm] = React.useState({
  //   fullName: customer?.name || "",
  //   email: customer?.email || "",
  //   phone: customer?.phone || "",
  //   gender: customer?.gender || "NA",
  //   dob: customer?.dob || "NA",
  // });

  // const [addressUpdate, setAddressUpdate] = React.useState({
  //   fullName: customer?.name || "",
  //   phoneNumber: customer?.phone || "",
  //   address: customer?.address || "",
  //   pinCode: customer?.zip_code || "",
  //   landMark: customer?.landMark || "",
  //   city: customer?.city || "",
  //   state: customer?.state || "",
  //   addressType: customer?.addressType || "",
  // });


    // Update forms when customer data loads
  useEffect(() => {
    if (customer) {
      setForm({
        fullName: customer?.name || "",
        email: customer?.email || "",
        phone: customer?.phoneNumber ||customer?.phone || "",
        gender: customer?.gender || "NA",
        dob: customer?.dateOfBirth || customer?.dob || "NA",
      });

 setAddressUpdate({
        fullName: customer?.name || "",
        phoneNumber: customer?.phoneNumber || customer?.phone || "",
        address: customer?.address || "",
        pinCode: customer?.zip_code || "",
        landMark: customer?.landMark || "",
        city: customer?.city || "",
        state: customer?.state || "",
        addressType: customer?.addressType || "",
      });
    }
  }, [customer]);


  const handleSave = async(e) => {
    e.preventDefault();

    const payload = {
      personal: form,
      address: addressUpdate,
    };

    console.log("SAVE DATA 👉", payload);

    try {
      // Send update to API
     const response = await axiosInstance.patch(`/user/admin/status/${id}`, payload);
      console.log("Update response:", response.data);
      
      // Redirect after successful save
      navigate("/admin/customers");
    } catch (err) {
      console.error("Error updating customer:", err);
      alert("Failed to update customer");
    }
  };

    if (loading) {
    return (
      <div className="p-6 bg-[#F6F8F9] min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C3753] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customer details...</p>
        </div>
      </div>
    );
  }

    if (error || !customer) {
    return (
      <div className="p-6 bg-[#F6F8F9] min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p>Error: {error || "Customer not found"}</p>
          <Link to="/admin/customers" className="text-blue-600 hover:underline mt-2 inline-block">
            Back to Customers
          </Link>
        </div>
      </div>
    );
  }

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
