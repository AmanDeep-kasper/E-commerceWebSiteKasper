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
    const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isEditPage = location.pathname.endsWith("/edit");

  const [form, setForm] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "NA",
    dob: "NA",
  });


  // Fetch customer and addresses from API
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        
        // Fetch user details
        const userResponse = await axiosInstance.get(`/user/admin/detail/${id}`);
        // console.log("Fetched user:", userResponse.data);
        const userData = userResponse.data?.user || userResponse.data?.data || userResponse.data;
        
        // Fetch user's addresses using admin endpoint
        try {
          const addressResponse = await axiosInstance.get(`/address/admin/all-addresses/${id}`);
          // console.log("Fetched addresses:", addressResponse.data);
          const addressesData = addressResponse.data?.data?.addresses || addressResponse.data?.addresses || [];
          setAddresses(addressesData);
        } catch (addressErr) {
          // console.log("No addresses found:", addressErr);
          setAddresses([]);
        }
        
        setCustomer(userData);
        setError(null);
      } catch (err) {
        // console.error("Error fetching customer:", err);
        setError(err.response?.data?.message || "Failed to load customer");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomerData();
    }
  }, [id]);

  const defaultAddress = addresses.find(addr => addr.isDefault === true) || addresses[0] || null;
// Merge customer and address data for display
const mergedCustomerData = {
    ...customer,
    // Address fields from default address
    addressFullName: defaultAddress?.fullName,
    addressPhone: defaultAddress?.phone,
    addressLine: defaultAddress?.address,
    city: defaultAddress?.city,
    state: defaultAddress?.state,
    pinCode: defaultAddress?.pinCode,
    country: defaultAddress?.country,
    addressType: defaultAddress?.addressType,
    isDefaultAddress: defaultAddress?.isDefault || false,
    allAddresses: addresses,
  };

  // console.log("Merged customer data:", mergedCustomerData);


    // Update forms when customer data loads
  useEffect(() => {
    if (customer) {
      setForm({
        fullName: customer?.name || "",
        email: customer?.email || "",
        phone: customer?.phoneNumber || "",
        gender: customer?.gender || "NA",
        dob: customer?.dateOfBirth || "NA",
      });
    }
  }, [customer]);



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

        {/* {!isEditPage ? (
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
        )} */}
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
              customer: mergedCustomerData,
              originalCustomer: customer,
              addresses: addresses,
              defaultAddress: defaultAddress,
              form,
              setForm,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CustomerLayout;
