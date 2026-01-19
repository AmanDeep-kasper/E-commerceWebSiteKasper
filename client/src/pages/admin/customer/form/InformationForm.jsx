import React, { useMemo, useState } from "react";
import { useParams } from "react-router";
// import customers from "../../data/customer.json";
import { useOutletContext } from "react-router";

function InformationForm() {
  const { id } = useParams();
  const { customer, form, setForm, addressUpdate, setAddressUpdate } =
    useOutletContext();

  // const  customers = useMemo(
  //   () => customer.find((c) => String(c.id) === String(id)),
  //   [id],
  // );
  // console.log(customer);

  // const [form, setForm] = useState({
  //   fullName: customer?.name || "",
  //   email: customer?.email || "",
  //   phone: customer?.phone || "",
  //   gender: customer?.gender || "NA",
  //   dob: customer?.dob || "NA",
  // });

  // const [addressUpdate, setAddressUpdate] = useState({
  //   fullName: customer?.name || "",
  //   phoneNumber: customer?.phone || "",
  //   address: customer?.address || "",
  //   pinCode: customer?.zip_code || "",
  //   landMark: customer.landMark || "",
  //   city: customer?.city || "",
  //   state: customer?.state || "",
  //   addressType: customer?.addressType || "",
  // });

  if (!customer) {
    return <div>Customer not found</div>;
  }

  const [adressEditToggle, setAdressEditToggle] = useState(false);

  return (
    <>
      {" "}
      
      <div className="bg-white rounded-xl p-6 ">
        <h2 className="text-lg font-medium mb-4">Edit Personal Details</h2>

        <form action="">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-start">
              <label className="" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                className="border p-2 rounded-md text-sm w-full bg-[#F8FBFC]"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>

            <div className="flex flex-col items-start">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                className="border p-2 rounded-md w-full text-sm bg-[#F8FBFC]"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <p className="flex items-start gap-2 text-[12px]">
                <span className="text-[#D53B35]">*</span>
                <span className="text-[#686868]">
                  Changing email will require user verification
                </span>
              </p>
            </div>
            <div className="flex flex-col items-start">
              <label htmlFor="Phone Number">Phone Number</label>
              <input
                id="Phone Number"
                className="border p-2 rounded-md w-full text-sm bg-[#F8FBFC]"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <p className="flex items-start gap-2 text-[12px]">
                <span className="text-[#D53B35]">*</span>
                <span className="text-[#686868]">
                  Changing phone number will require user verification
                </span>
              </p>
            </div>
            <div className="flex flex-col items-start">
              <label htmlFor="Gender">Gender</label>
              <input
                id="Gender"
                disabled
                className="border p-2 rounded-md w-full text-sm bg-[#DEDEDE] text-[#686868]"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              />
            </div>
            <div className="flex flex-col items-start">
              <label htmlFor="Date of Birth (DOB)">Date of Birth (DOB)</label>
              <input
                id="Date of Birth (DOB)"
                disabled
                className="border p-2 rounded-md w-full text-sm bg-[#DEDEDE] text-[#686868]"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
              />
            </div>
          </div>
        </form>
      </div>
      <div className="p-3 mt-6 bg-white rounded-xl">
        <div className="flex justify-between items-center ">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            Edit Address Details
          </h2>
        </div>

        {adressEditToggle == true ? (
          <form action="post">
            <div className="flex-1 space-y-3 gap-4 border p-2 rounded-lg mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-start">
                  <label className="" htmlFor="Full Name">
                    Full Name
                  </label>
                  <input
                    id="Full Name"
                    type="text"
                    className="border p-2 rounded-md text-sm w-full bg-[#F8FBFC]"
                    value={addressUpdate.fullName}
                    onChange={(e) =>
                      setAddressUpdate({
                        ...addressUpdate,
                        fullName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col items-start">
                  <label htmlFor="Phone Number">Phone Number</label>
                  <input
                    id="Phone Number"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    className="border p-2 rounded-md w-full text-sm bg-[#F8FBFC]"
                    value={addressUpdate.phoneNumber}
                    onChange={(e) =>
                      setAddressUpdate({
                        ...addressUpdate,
                        phoneNumber: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col items-start">
                <label htmlFor="address">
                  Address (Flat no.,Street, and Area)
                </label>
                <textarea
                  id="address"
                  rows={3}
                  className="border p-2 rounded-md w-full text-sm bg-[#F8FBFC] resize-none"
                  value={addressUpdate.address}
                  onChange={(e) =>
                    setAddressUpdate({
                      ...addressUpdate,
                      address: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email">Pin-code</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    value={addressUpdate.pinCode}
                    onChange={(e) => {
                      setAddressUpdate({
                        ...addressUpdate,
                        pinCode: e.target.value,
                      });
                    }}
                    className="border p-2 rounded-md w-full text-sm bg-[#F8FBFC]"
                  />
                </div>
                <div>
                  <label htmlFor="email">Landmark</label>
                  <input
                    type="text"
                    value={addressUpdate.landMark}
                    onChange={(e) => {
                      setAddressUpdate({
                        ...addressUpdate,
                        landMark: e.target.value,
                      });
                    }}
                    className="border p-2 rounded-md w-full text-sm bg-[#F8FBFC]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="City">City/District/Town</label>
                  <input
                    id="City"
                    type="text"
                    value={addressUpdate.city}
                    onChange={(e) => {
                      setAddressUpdate({
                        ...addressUpdate,
                        city: e.target.value,
                      });
                    }}
                    className="border p-2 rounded-md w-full text-sm bg-[#F8FBFC]"
                  />
                </div>
                <div>
                  <label htmlFor="State">State</label>
                  <input
                    id="State"
                    type="text"
                    value={addressUpdate.state}
                    onChange={(e) => {
                      setAddressUpdate({
                        ...addressUpdate,
                        state: e.target.value,
                      });
                    }}
                    className="border p-2 rounded-md w-full text-sm bg-[#F8FBFC]"
                  />
                </div>
              </div>

              <div className="flex flex-col items-start space-y-2">
                <label>Address Type</label>

                <div className="flex items-start gap-4">
                  {/* Home */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="addressType"
                      value="Home"
                      checked={addressUpdate.addressType === "Home"}
                      onChange={(e) =>
                        setAddressUpdate({
                          ...addressUpdate,
                          addressType: e.target.value,
                        })
                      }
                    />
                    <span>Home (All day delivery)</span>
                  </label>

                  {/* Work */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="addressType"
                      value="Work"
                      checked={addressUpdate.addressType === "Work"}
                      onChange={(e) =>
                        setAddressUpdate({
                          ...addressUpdate,
                          addressType: e.target.value,
                        })
                      }
                    />
                    <span>Work (Delivery between 10AM - 6PM)</span>
                  </label>

                  {/* Other */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="addressType"
                      value="Other"
                      checked={addressUpdate.addressType === "Other"}
                      onChange={(e) =>
                        setAddressUpdate({
                          ...addressUpdate,
                          addressType: e.target.value,
                        })
                      }
                    />
                    <span>Other</span>
                  </label>
                </div>
              </div>

              <div className="flex items-start gap-4">
                {/* <button className="bg-[#1C3753] text-white px-8 rounded-lg py-2">
                  Save
                </button> */}
                <button
                  onClick={() => {
                    setAdressEditToggle(false);
                  }}
                  className=" text-[#ffff] bg-[#1C3753] font-medium px-8 rounded-lg py-2">
                  Cancel
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex-1 border p-2 rounded-lg mt-2">
            <div className="flex  items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base font-medium">{customer.name}</span>
                <span className="px-1 py-0.5 rounded-md text-xs bg-[#D5E5F5] text-[#1C3753] border border-[#1C3753]">
                  Work
                </span>
              </div>
              <div>
                <span className="px-2 py-1 rounded-lg text-xs bg-[#EFEFEF] text-[#1C1C1C]">
                  Default
                </span>
              </div>
            </div>
            <div className="text-[14px] font-medium mt-1">
              <p>{`${customer.address}, ${customer.state}, ${customer.city}, ${customer.zip_code}, ${customer.country}`}</p>
              <p>Phone Number: {customer.phone}</p>
            </div>
            <button
              onClick={() => {
                setAdressEditToggle(true);
              }}
              type="button"
              className="text-sm text-[#006EE1]">
              Edit Address
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default InformationForm;
