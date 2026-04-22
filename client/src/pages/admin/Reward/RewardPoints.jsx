import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axiosInstance.js";
import axios from "axios";

/* <=========--------- icons --------=========> */
import { MdOutlineAdd } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import Surprisebox from "../../../assets/gift.gif";

function RewardPoints() {
  const [showReward, setShowReward] = useState(false);
  const [activeTab, setActiveTab] = useState("reward");
  const [showCard, setShowCard] = useState(false);
  const [rewardCard, setRewardCard] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    Points: "", // Added this
    PriceForPoints: "",
    minOrderValue: "",
    minOrderValueForRedeem: "",
    date: "",
  });

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const res = await axiosInstance.get("/dashboard/reward");

      console.log("API Response:", res.data);

      if (!res.data.data) {
        setRewardCard([]);
        return;
      }

      const data = res.data.data;

      if (!data) {
        setRewardCard([]);
        return;
      }

      // Handle both array and single object
      const items = Array.isArray(data) ? data : [data];

      const formatted = items.map((item) => ({
        _id: item._id,
        title: item.name || "Reward Offer",
        description: `Get ${item.earn?.rules?.points || 0} points for every ₹${item.earn?.rules?.PriceForPoints || 0} purchase.`,
        badge: item.isActive ? "Active" : "Inactive",
        deadline: item.validity || 30,
        earn: item.earn,
        minOrderValueForRedeem: item.minOrderValueForRedeem,
        pointValue: item.pointValue,
      }));

      setRewardCard(formatted);
    } catch (error) {
      console.log("FETCH ERROR:", error.response?.data || error.message);
    }
  };

  // const rewardCardData = [
  //     {
  //         title: "First Reward Points",
  //         description: "Get Points for every ₹500+ purchase.",
  //         badge: "Inactive",
  //     },
  //     {
  //         title: "Second Reward ",
  //         description: "Get Points for every ₹1000+ purchase.",
  //         badge: "Active",
  //     },
  // ]

  const toggleStatus = async () => {
    try {
      await axiosInstance.patch("/dashboard/reward/toggle-status", {});

      fetchRewards();
    } catch (error) {
      console.error("Toggle Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-[#F6F8F9] min-h-screen">
      {/* <--------------------------------------- HEADER -----------------------------------> */}
      <div className="flex justify-between items-center">
        <span className="text-[#1C1C1C] font-medium text-[16px] sm:text-[18px] lg:text-[20px]">
          Reward Points
        </span>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-[#0B3142] text-white font-semibold text-[16px] border border-[#0B3142] rounded-lg"
          onClick={() => setShowReward(true)}
        >
          <MdOutlineAdd size={20} />
          Create Reward & Points
        </button>
      </div>

      {/* <--------------------------------------- CARD GRID -----------------------------------> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {rewardCard.map((item, index) => (
          <div
            key={item._id || index}
            className="rounded-lg p-4 shadow-sm bg-gradient-to-r from-[#FFFFFF] to-[#B2FF00]/10 cursor-pointer"
            onClick={() => {
              setSelectedCard(item);
              setShowCard(true);
            }}
          >
            {/* TOP SECTION */}
            <div className="flex justify-between items-start gap-2">
              {/* LEFT */}
              <div className="flex flex-col">
                <span className="font-medium text-[16px] sm:text-[18px] lg:text-[20px] text-[#0E101A]">
                  {item.title}
                </span>

                <div className="mt-2 text-[12px] sm:text-[14px] text-[#555] font-medium leading-relaxed flex flex-col">
                  <span>{item.description}</span>
                  <span>Redeem next time.</span>
                </div>
              </div>

              {/* TOGGLE BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStatus();
                }}
                className={`px-2 py-1 text-[12px] sm:text-[13px] rounded-full whitespace-nowrap ${
                  item.badge === "Active"
                    ? "text-[#01774B] bg-[#D4F7C7]"
                    : "text-[#A80205] bg-[#F7C7C9]"
                }`}
              >
                {item.badge === "Active" ? "Active" : "Inactive"}
              </button>
            </div>

            {/* BOTTOM */}
            <div className="mt-4 flex justify-between items-center border-t border-[#E5E5E5] pt-3">
              <div className="flex items-center flex-wrap gap-1 text-[10px] sm:text-[12px]">
                <span className="text-[#1F7FFF] font-medium whitespace-nowrap cursor-pointer hover:underline">
                  Show Details
                </span>

                <span className="text-[#727681]">•</span>

                <span className="text-[#727681] font-medium whitespace-nowrap">
                  Valid for {item.deadline} days
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* <--------------------------------------- CREATE REWARD & POINTS -----------------------------------> */}
      {showReward && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-6"
          onClick={() => setShowReward(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg relative p-4 sm:p-6  overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-8 items-center">
              <span
                onClick={() => setActiveTab("reward")}
                className={`px-2 py-3 cursor-pointer text-[18px] font-medium ${
                  activeTab === "reward"
                    ? "border-b-2 border-[#1C3753] text-[#1C3753]"
                    : "text-gray-400"
                }`}
              >
                Reward Setup
              </span>

              <span
                onClick={() => setActiveTab("redeem")}
                className={`px-2 py-3 cursor-pointer text-[18px] font-medium ${
                  activeTab === "redeem"
                    ? "border-b-2 border-[#1C3753] text-[#1C3753]"
                    : "text-gray-400"
                }`}
              >
                Redeem Setup
              </span>
            </div>

            {activeTab === "reward" && (
              <div>
                <div className="mt-4">
                  <span className="text-[#1C3753] font-medium text-[18px]">
                    Set Up Your Reward System.
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex flex-col gap-1 mt-3">
                    <div className="flex gap-1">
                      <label className="text-[#1C1C1C] font-normal text-[14px] ">
                        Offer Name
                      </label>
                      {/* <span className="text-[#DC2626] text-[14px]">*</span> */}
                    </div>
                    <input
                      type="text"
                      placeholder="Enter Offer title"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full border border-[#DEDEDE] bg-[#F8FBFC] rounded-md px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-2.5 outline-none placeholder:text-[#686868] text-[#1C1C1C]"
                    />
                    <span className="text-[#686868] text-[12px] font-normal">
                      Please provide a title for your offer setup.
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 mt-3">
                    <div className="flex gap-1">
                      <label className="text-[#1C1C1C] font-normal text-[14px] ">
                        set Amount For 1 Reward Point
                      </label>
                      {/* <span className="text-[#DC2626] text-[14px]">*</span> */}
                    </div>
                    <div className="flex gap-4 items-center">
                      <input
                        type="number"
                        placeholder="₹ 0"
                        value={formData.Points}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            Points: e.target.value,
                          })
                        }
                        className="w-full border border-[#DEDEDE] bg-[#F8FBFC] rounded-md px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-2.5 outline-none placeholder:text-[#686868] text-[#1C1C1C]"
                      />
                      =
                      <span className="w-full border border-[#DEDEDE] bg-white rounded-md px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-2.5text-[#686868]">
                        1 Point
                      </span>
                    </div>

                    <span className="text-[#686868] text-[12px] font-normal">
                      How much do they need to spend to earn 1 Reward Point ?
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 mt-3">
                    <div className="flex gap-1">
                      <label className="text-[#1C1C1C] font-normal text-[14px] ">
                        Minimum Purchase Amount Earn Points
                      </label>
                      {/* <span className="text-[#DC2626] text-[14px]">*</span> */}
                    </div>
                    <input
                      type="number"
                      placeholder="₹ 0"
                      value={formData.minOrderValue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minOrderValue: e.target.value,
                        })
                      }
                      className="w-full border border-[#DEDEDE] bg-[#F8FBFC] rounded-md px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-2.5 outline-none placeholder:text-[#686868] text-[#1C1C1C]"
                    />
                    <span className="text-[#686868] text-[12px] font-normal">
                      How much do they need to spend to be eligible ?
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 mt-3">
                    <div className="flex gap-1">
                      <label className="text-[#1C1C1C] font-normal text-[14px] ">
                        Set Deadline
                      </label>
                      {/* <span className="text-[#DC2626] text-[14px]">*</span> */}
                    </div>
                    <input
                      type="date"
                      placeholder="Select Date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full border border-[#DEDEDE] bg-[#F8FBFC] rounded-md px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-2.5 outline-none placeholder:text-[#686868] text-[#1C1C1C]"
                    />
                    <span className="text-[#686868] text-[12px] font-normal">
                      Set the expiry date for this offer.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "redeem" && (
              <div className="mt-4">
                <div className="text-[#1C1C1C] font-medium text-[18px]">
                  <span>Setup Your Redeem System.</span>
                </div>

                <div className="flex flex-col gap-1 mt-3">
                  <div className="flex gap-1">
                    <label className="text-[#1C1C1C] font-normal text-[14px] ">
                      set value of 1 point in rupees for redemption
                    </label>
                    {/* <span className="text-[#DC2626] text-[14px]">*</span> */}
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="w-full border border-[#DEDEDE] bg-white rounded-md px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-2.5text-[#686868]">
                      1 Point
                    </span>
                    =
                    <input
                      type="number"
                      placeholder="₹ 0 "
                      value={formData.PriceForPoints}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          PriceForPoints: e.target.value,
                        })
                      }
                      className="w-full border border-[#DEDEDE] bg-white rounded-md px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-2.5 outline-none placeholder:text-[#686868] text-[#1C1C1C]"
                    />
                  </div>

                  <span className="text-[#686868] text-[12px] font-normal">
                    Enter conversion for redemption.
                  </span>
                </div>

                {/* <div className="flex flex-col gap-1 mt-3">
                                    <div className="flex gap-1">
                                        <label className="text-[#1C1C1C] font-normal text-[14px] ">
                                            Enter Maximum amount (%) eligible for points
                                        </label>
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="0 %"
                                        value={formData.maxPurchase}
                                        onChange={(e) =>
                                            setFormData({ ...formData, maxPurchase: e.target.value })
                                        }
                                        className="w-full border border-[#DEDEDE] bg-[#F8FBFC] rounded-md px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-2.5 outline-none placeholder:text-[#686868] text-[#1C1C1C]"
                                    />
                                </div> */}

                <div className="flex flex-col gap-1 mt-3">
                  <div className="flex gap-1">
                    <label className="text-[#1C1C1C] font-normal text-[14px] ">
                      Set Minimum invoice value for redemption eligibility
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="₹ 0"
                    value={formData.minOrderValueForRedeem}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minOrderValueForRedeem: e.target.value,
                      })
                    }
                    className="w-full border border-[#DEDEDE] bg-[#F8FBFC] rounded-md px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-2.5 outline-none placeholder:text-[#686868] text-[#1C1C1C]"
                  />
                </div>
              </div>
            )}
            <div className="flex gap-4 mt-4">
              <button
                className="px-2 py-2 border border-[#1C3753] text-[#1C3753] text-center rounded-md"
                onClick={() => setShowReward(false)}
              >
                Cancel
              </button>

              {/* CONDITIONAL BUTTON */}
              {activeTab === "reward" ? (
                <button
                  className="px-2.5 py-2 bg-[#1C3753] text-[#FFFFFF] rounded-md"
                  onClick={() => setActiveTab("redeem")}
                >
                  Next
                </button>
              ) : (
                <button
                  className="px-2.5 py-2 bg-[#1C3753] text-white rounded-md"
                  onClick={async () => {
                    // console.log("SAVE CLICKED");

                    try {
                      let validity = 30;

                      if (formData.date) {
                        const today = new Date();
                        const selected = new Date(formData.date);

                        validity = Math.ceil(
                          (selected - today) / (1000 * 60 * 60 * 24),
                        );
                      }

                      await axiosInstance.post(
                        "/dashboard/reward/createOrUpdate",
                        {
                          _id: isEditMode ? selectedCard?._id : undefined,
                          name: formData.name,

                          earn: {
                            minOrderValue: Number(formData.minOrderValue),
                            rules: {
                              PriceForPoints: Number(formData.Points), // Use formData.Points for earning rules
                              points: 1,
                            },
                          },

                          minOrderValueForRedeem: Number(
                            formData.minOrderValueForRedeem,
                          ),

                          pointValue: Number(formData.PriceForPoints), // Redemption value

                          validity: validity,
                          isActive: true,
                        },
                      );

                      // refresh data
                      await fetchRewards();

                      // UI updates
                      setShowReward(false);
                      setTimeout(() => setShowConfirm(true), 200);

                      // reset form
                      setFormData({
                        name: "",
                        price: "",
                        Points: "",
                        PriceForPoints: "",
                        minOrderValue: "",
                        minOrderValueForRedeem: "",
                        date: "",
                      });

                      setActiveTab("reward");
                    } catch (error) {
                      console.error(
                        "Create Reward Error:",
                        error.response?.data || error.message,
                      );
                    }
                  }}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* <--------------------------------------- CARD GRID Popup -----------------------------------> */}
      {showCard && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCard(false);
            }
          }}
        >
          <div
            className="bg-gradient-to-br from-[#FFFFFF] to-[#B2FF00]/30 rounded-xl shadow-lg relative p-4 sm:p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-10">
                <span>{selectedCard?.title}</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-[12px] sm:text-[13px] rounded-full whitespace-nowrap ${
                      selectedCard?.badge === "Active"
                        ? "text-[#01774B] bg-[#D4F7C7]"
                        : "text-[#A80205] bg-[#F7C7C9]"
                    }`}
                  >
                    {selectedCard?.badge}
                  </span>
                  <span
                    onClick={() => {
                      setIsEditMode(true);

                      setFormData({
                        name: selectedCard?.title || "",
                        Points: selectedCard?.earn?.rules?.PriceForPoints || "",
                        minOrderValue: selectedCard?.earn?.minOrderValue || "",
                        PriceForPoints: selectedCard?.pointValue || "",
                        minOrderValueForRedeem:
                          selectedCard?.minOrderValueForRedeem || "",
                        date: "", // optional (you don’t store exact date, only validity)
                      });

                      setShowReward(true);
                      setShowCard(false);
                    }}
                    className="text-[#727681] cursor-pointer"
                  >
                    <MdEdit />
                  </span>
                </div>
              </div>
              <div className="mt-2"></div>
              {/* <div className="mt-2">
                <button onClick={toggleStatus}>
                  <MdEdit />
                </button>
              </div> */}
            </div>
            <div className="mt-3">
              <span className="text-[14px] text-[#0E101A] font-medium">
                How it works:
              </span>
            </div>
            <div className="mt-3">
              <span className="text-[14px] text-[#727681] font-normal">
                Earning Rule
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[#0E101A] text-[14px] font-normal">
                ⚡ Customer earn {selectedCard?.earn?.rules?.points || 1} points
                for every ₹ {selectedCard?.earn?.rules?.PriceForPoints || 500}
                spent.
              </span>
              <span className="text-[#0E101A] text-[14px] font-normal">
                💰 Points are applicable only on purchases above ₹
                {selectedCard?.earn?.minOrderValue || 0} minimum value
              </span>
              <span className="text-[#0E101A] text-[14px] font-normal">
                ⏳ Reward offer validity: {selectedCard?.deadline || 30} days
              </span>
            </div>
            <div className="mt-3">
              <span className="text-[14px] text-[#727681] font-normal">
                Redemption Rules
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[#0E101A] text-[14px] font-normal">
                🎁 1 point value: ₹{selectedCard?.pointValue || selectedCard?.earn?.rules?.PriceForPoints || 0} during
                redemption
              </span>
              <span className="text-[#0E101A] text-[14px] font-normal">
                💰 Customers can redeem if order value is above ₹
                {selectedCard?.minOrderValueForRedeem || 0}
              </span>
            </div>
            <div className="mt-4">
              {/* <div className="border border-[#FFFFFF] shadow-[0_0_4px_rgba(0,0,0,0.23)] px-3 py-4 rounded-lg flex items-center justify-between gap-2">

                                <input
                                    type="text"
                                    placeholder="https://kasperinfotech.dummylinkforrewards"
                                    className="text-[#727681] text-[14px] w-full outline-none"
                                />

                                <span className="text-[#FFFFFF] bg-[#1F7FFF] text-[14px] px-2 py-1 whitespace-nowrap">
                                    Copy Link
                                </span>

                            </div> */}
            </div>
          </div>
        </div>
      )}

      {/* <====================------------------------- success popup -------------------======================> */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-6">
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              height: "100vh",
              overflow: "auto",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "532px",
                height: "auto",
                boxShadow: "0px 0px 23px rgba(0,110,255,0.25)",
                overflow: "hidden",
                borderRadius: 16,
                outline: "1px solid #EAEAEA",
                background: "#fff",
                zIndex: 2,
                position: "relative",
                paddingBottom: "30px",
              }}
            >
              {/* Close Button */}
              <div
                onClick={() => setShowConfirm(false)}
                style={{
                  display: "flex",
                  justifyContent: "end",
                  padding: "15px",
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    right: "16px",
                    top: "16px",
                    border: "2px solid #D00003",
                    borderRadius: "50%",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "600",
                    color: "#D00003",
                    fontSize: "18px",
                  }}
                >
                  X
                </div>
              </div>

              {/* Image */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  src={Surprisebox}
                  style={{
                    width: "450px",
                    borderRadius: "12px",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* Gradient Circle */}
              <div
                style={{
                  height: "auto",
                  width: "532px",
                  borderTopLeftRadius: "50%",
                  borderTopRightRadius: "50%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "30px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    borderRadius: "50%",
                    background:
                      "linear-gradient(318deg, #091A45 0%, #436AEB 100%)",
                    position: "absolute",
                    width: "1750px",
                    height: "1600px",
                    zIndex: 1,
                  }}
                ></div>

                <div
                  style={{
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "40px",
                  }}
                >
                  {/* Heading */}
                  <div>
                    <div
                      style={{
                        width: "100%",
                        marginTop: "60px",
                        textAlign: "center",
                        fontSize: "32px",
                        fontWeight: 700,
                        color: "#fff",
                        fontFamily: "Inter",
                      }}
                    >
                      Congratulations !!!
                    </div>

                    {/* Subtext */}
                    <div
                      style={{
                        width: "100%",
                        textAlign: "center",
                        fontSize: "16px",
                        fontWeight: 400,
                        color: "#F5F5F5",
                        fontFamily: "Inter",
                      }}
                    >
                      You have successfully created your Reward System.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RewardPoints;
