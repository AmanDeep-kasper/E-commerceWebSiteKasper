import React, { useState, useEffect } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { X, Plus, Trash2, Edit2, Check, XCircle } from "lucide-react";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "react-toastify";

const BannersSettings = () => {
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [fileError, setFileError] = useState("");
  const [videoPreview, setVideoPreview] = useState(null);
  
  // Premium Features State
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFeature, setEditingFeature] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newFeature, setNewFeature] = useState({ text: '' });

  const banners = [
    { id: 1, name: "Banner 1" },
    { id: 2, name: "Banner 2" },
  ];

  // Fetch features on mount
  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/settings/homepage-features");
      if (response.data.success) {
        setFeatures(response.data.data);
      } else {
        setFeatures([]);
      }
    } catch (error) {
      console.error("Error fetching features:", error);
      setFeatures([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeature = async () => {
    if (!newFeature.text.trim()) {
      toast.error("Please enter feature text");
      return;
    }

    try {
      const response = await axiosInstance.post("/settings/homepage-features", newFeature);
      if (response.data.success) {
        toast.success("Feature added successfully");
        setNewFeature({ text: '' });
        setIsAddingNew(false);
        fetchFeatures();
      }
    } catch (error) {
      console.error("Error adding feature:", error);
      toast.error(error.response?.data?.message || "Failed to add feature");
    }
  };

  const handleUpdateFeature = async (feature) => {
    try {
      const updatedFeatures = features.map(f => 
        f._id === feature._id ? feature : f
      );
      
      const response = await axiosInstance.put("/settings/homepage-features", { features: updatedFeatures });
      if (response.data.success) {
        toast.success("Feature updated successfully");
        setEditingFeature(null);
        fetchFeatures();
      }
    } catch (error) {
      console.error("Error updating feature:", error);
      toast.error("Failed to update feature");
    }
  };

  const handleDeleteFeature = async (featureId) => {
    try {
      const response = await axiosInstance.delete(`/settings/homepage-features/${featureId}`);
      if (response.data.success) {
        toast.success("Feature deleted successfully");
        fetchFeatures();
      }
    } catch (error) {
      console.error("Error deleting feature:", error);
      toast.error("Failed to delete feature");
    }
  };

  const handleToggleStatus = async (featureId) => {
    try {
      const response = await axiosInstance.patch(`/settings/homepage-features/${featureId}/toggle`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchFeatures();
      }
    } catch (error) {
      console.error("Error toggling feature:", error);
      toast.error("Failed to update feature status");
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 8 * 1024 * 1024;

    if (file.size > maxSize) {
      setFileError("Video must be less than 8MB");
      e.target.value = "";
      return;
    }

    setFileError("");
    const videoURL = URL.createObjectURL(file);
    setVideoPreview(videoURL);
  };

  const handleRemoveVideo = () => {
    setVideoPreview(null);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-semibold text-[20px] mb-2">Banners</h1>
          <span className="text-[#686868] text-[14px]">
            Manage banners displayed on the customer homepage.
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[12px] border border-[#E5E7EB] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB]">
              <th className="text-left px-6 py-4 text-[14px] font-medium text-[#111827] border-b border-[#E5E7EB]">
                Serial No.
              </th>
              <th className="text-left px-6 py-4 text-[14px] font-medium text-[#111827] border-b border-[#E5E7EB]">
                Banner Number
              </th>
              <th className="text-left px-6 py-4 text-[14px] font-medium text-[#111827] border-b border-[#E5E7EB]">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {banners.map((banner, index) => (
              <tr key={banner.id} className="border-b border-[#E5E7EB]">
                <td className="px-6 py-5 text-[14px] text-[#111827]">
                  {index + 1}.
                </td>
                <td className="px-6 py-5 text-[14px] text-[#111827]">
                  {banner.name}
                </td>
                <td className="px-6 py-5">
                  <button
                    onClick={() => setSelectedBanner(banner)}
                    className="text-[#2563EB] text-[14px] font-medium hover:underline"
                  >
                    Edit Banner
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* for premium text form start */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-semibold text-[20px] mb-2">Premium Text Features</h1>
            <span className="text-[#686868] text-[14px]">
              Manage the premium text features displayed on the customer homepage.
            </span>
          </div>
          <button
            onClick={() => setIsAddingNew(true)}
            className="bg-[#1C3753] text-white px-4 py-2 rounded-lg hover:bg-[#2a4a6e] flex items-center gap-2"
          >
            <Plus size={18} />
            Add Feature
          </button>
        </div>

        {/* Add New Feature Modal */}
        {isAddingNew && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
            <div className="w-full max-w-[460px] bg-white rounded-[8px] shadow-lg p-6">
              <h2 className="text-[18px] font-semibold text-[#111827] mb-4">
                Add New Feature
              </h2>

              <div className="mb-5">
                <label className="block text-[14px] text-[#374151] mb-2">
                  Text <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newFeature.text}
                  onChange={(e) => setNewFeature({ text: e.target.value })}
                  placeholder="Enter feature text"
                  className="w-full h-[42px] rounded-[6px] border border-[#D1D5DB] px-3 text-[14px] outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddFeature}
                  className="bg-[#183B63] hover:bg-[#163556] text-white text-[14px] font-medium px-5 py-2 rounded-[6px]"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAddingNew(false);
                    setNewFeature({ text: '' });
                  }}
                  className="border border-[#94A3B8] text-[#183B63] text-[14px] font-medium px-5 py-2 rounded-[6px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Features Table */}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1C3753]"></div>
          </div>
        ) : (
          <div className="bg-white rounded-[12px] border border-[#E5E7EB] overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#F9FAFB]">
                  <th className="text-left px-6 py-4 text-[14px] font-medium text-[#111827] border-b border-[#E5E7EB]">
                    Serial No.
                  </th>
                  <th className="text-left px-6 py-4 text-[14px] font-medium text-[#111827] border-b border-[#E5E7EB]">
                    Text
                  </th>
                  <th className="text-left px-6 py-4 text-[14px] font-medium text-[#111827] border-b border-[#E5E7EB]">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-[14px] font-medium text-[#111827] border-b border-[#E5E7EB]">
                    Order
                  </th>
                  <th className="text-left px-6 py-4 text-[14px] font-medium text-[#111827] border-b border-[#E5E7EB]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {features.map((feature, index) => (
                  <tr key={feature._id} className="border-b border-[#E5E7EB]">
                    <td className="px-6 py-5 text-[14px] text-[#111827]">
                      {index + 1}.
                    </td>
                    <td className="px-6 py-5 text-[14px] text-[#111827]">
                      {editingFeature?._id === feature._id ? (
                        <input
                          type="text"
                          value={editingFeature.text}
                          onChange={(e) => setEditingFeature({ ...editingFeature, text: e.target.value })}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        feature.text
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => handleToggleStatus(feature._id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          feature.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {feature.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-5 text-[14px] text-[#111827]">
                      {feature.order}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {editingFeature?._id === feature._id ? (
                          <>
                            <button
                              onClick={() => handleUpdateFeature(editingFeature)}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => setEditingFeature(null)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingFeature(feature)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteFeature(feature._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {features.length === 0 && !loading && (
          <div className="text-center text-gray-500 py-8 bg-white rounded-lg border">
            No features added yet. Click "Add Feature" to create one.
          </div>
        )}
      </div>
      {/* for premium text form end */}

      {/* Banner Modal */}
      {selectedBanner && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-[460px] bg-white rounded-[8px] shadow-lg p-4">
            <h2 className="text-[16px] font-semibold text-[#111827] mb-3">
              {selectedBanner.name}
            </h2>

            <div>
              {!videoPreview ? (
                <label className="w-[60px] h-[60px] border border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-100">
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoUpload}
                  />
                  <MdOutlineFileUpload className="text-2xl text-gray-500" />
                </label>
              ) : (
                <div className="relative w-[120px] h-[80px]">
                  <video
                    src={videoPreview}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    onClick={handleRemoveVideo}
                    className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:bg-black"
                  >
                    <X size={14} className="text-black" />
                  </button>
                </div>
              )}

              <span
                className={`text-[12px] ${fileError ? "text-red-500" : "text-[#686868]"
                  }`}
              >
                {fileError
                  ? fileError
                  : "*Recommended 1920x800px size with 4-8Mb video size only in MP4"}
              </span>
            </div>

            <div className="mt-3">
              <label className="block text-[14px] text-[#374151] mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Write a title"
                className="w-full h-[42px] rounded-[6px] border border-[#D1D5DB] bg-[#F8FBFC] px-3 text-[14px] outline-none focus:border-[#2563EB]"
                value={selectedBanner.title}
                onChange={(e) => setSelectedBanner({ ...selectedBanner, title: e.target.value })}
              />
            </div>

            <div className="mt-3">
              <label className="block text-[14px] text-[#374151] mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Write a description"
                rows={4}
                className="w-full bg-[#F8FBFC] rounded-[6px] border border-[#D1D5DB] px-3 py-3 text-[14px] outline-none resize-none focus:border-[#2563EB]"
                value={selectedBanner.description}
                onChange={(e) => setSelectedBanner({ ...selectedBanner, description: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button className="bg-[#183B63] hover:bg-[#163556] text-white text-[14px] font-medium px-5 py-2 rounded-[6px]">
                Save
              </button>
              <button
                onClick={() => setSelectedBanner(null)}
                className="border border-[#94A3B8] text-[#183B63] text-[14px] font-medium px-5 py-2 rounded-[6px]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BannersSettings;
// import React, { useState } from "react";
// import { MdOutlineFileUpload } from "react-icons/md";
// import { X } from "lucide-react";
// const BannersSettings = () => {
//   // const [selectedBanner, setSelectedBanner] = useState(null);
//   // const [isBanner4ModalOpen, setIsBanner4ModalOpen] = useState(false);
//   const [selectedBanner, setSelectedBanner] = useState(null);
//   const [fileError, setFileError] = useState("");
//   const [videoPreview, setVideoPreview] = useState(null);

//   const handleVideoUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const maxSize = 8 * 1024 * 1024;

//     if (file.size > maxSize) {
//       setFileError("Video must be less than 8MB");
//       e.target.value = "";
//       return;
//     }

//     setFileError("");

//     const videoURL = URL.createObjectURL(file); // ✅ IMPORTANT
//     setVideoPreview(videoURL); // ✅ SAVE IT
//   };


//   const generateThumbnail = (file) => {
//     const video = document.createElement("video");
//     video.src = URL.createObjectURL(file);

//     video.addEventListener("loadeddata", () => {
//       const canvas = document.createElement("canvas");
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;

//       const ctx = canvas.getContext("2d");
//       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//       const image = canvas.toDataURL("image/png");
//       setVideoPreview(image);
//     });
//   };

//   const handleRemoveVideo = () => {
//     setVideoPreview(null);
//   };


//   const banners = [
//     { id: 1, name: "Banner 1" },
//     { id: 2, name: "Banner 2" },
//   ];

//   // const handleEditBanner = (banner) => {
//   //   if (banner.id === 4) {
//   //     setIsBanner4ModalOpen(true);
//   //     setSelectedBanner(null);
//   //   } else {
//   //     setSelectedBanner(banner);
//   //     setIsBanner4ModalOpen(false);
//   //   }
//   // };

//   // const closeAll = () => {
//   //   setSelectedBanner(null);
//   //   setIsBanner4ModalOpen(false);
//   // };

//   return (
//     <>
//       <div className="flex items-center justify-between mb-5">
//         <div>
//           <h1 className="font-semibold text-[20px] mb-2">Banners</h1>
//           <span className="text-[#686868] text-[14px]">
//             Manage banners displayed on the customer homepage.
//           </span>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-[12px] border border-[#E5E7EB] overflow-hidden">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-[#F9FAFB]">
//               <th className="text-left px-6 py-4 text-[14px] font-medium text-[#111827] border-b border-[#E5E7EB]">
//                 Serial No.
//               </th>
//               <th className="text-left px-6 py-4 text-[14px] font-medium text-[#111827] border-b border-[#E5E7EB]">
//                 Banner Number
//               </th>
//               <th className="text-left px-6 py-4 text-[14px] font-medium text-[#111827] border-b border-[#E5E7EB]">
//                 Action
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {banners.map((banner, index) => (
//               <tr key={banner.id} className="border-b border-[#E5E7EB]">
//                 <td className="px-6 py-5 text-[14px] text-[#111827]">
//                   {index + 1}.
//                 </td>
//                 <td className="px-6 py-5 text-[14px] text-[#111827]">
//                   {banner.name}
//                 </td>
//                 <td className="px-6 py-5">
//                   <button
//                     onClick={() => setSelectedBanner(banner)}
//                     className="text-[#2563EB] text-[14px] font-medium hover:underline"
//                   >
//                     Edit Banner
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {/* for premium text form start */}
      
//       {/* for premium text form end */}

//       {/* Banner 1,2,3 Form */}
//       {/* {selectedBanner && selectedBanner.id !== 4 && (
//         <div className="mt-6 bg-white rounded-[8px] border border-[#E5E7EB] p-4 max-w-[600px]">
          
//           <h2 className="text-[16px] font-semibold text-[#111827] mb-4">
//             {selectedBanner.name}
//           </h2>

//           <div className="mb-4">
//             <label className="w-[56px] h-[56px] border border-[#D1D5DB] rounded-[6px] flex items-center justify-center cursor-pointer hover:bg-gray-50">
//               <input type="file" className="hidden" />
//               <svg
//                 width="22"
//                 height="22"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#374151"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
//                 <path d="M8 15l3-3 2 2 4-4"></path>
//                 <path d="M16 8h.01"></path>
//                 <path d="M12 5v4"></path>
//                 <path d="M10 7h4"></path>
//               </svg>
//             </label>
//           </div>

//           <div className="mb-4">
//             <label className="block text-[14px] text-[#374151] mb-1">
//               Title <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               placeholder="Write a title"
//               className="w-full h-[42px] rounded-[6px] border border-[#D1D5DB] px-3 text-[14px] outline-none focus:border-[#2563EB]"
//             />
//           </div>

//           <div className="mb-5">
//             <label className="block text-[14px] text-[#374151] mb-1">
//               Description <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               placeholder="Write a description"
//               rows={4}
//               className="w-full rounded-[6px] border border-[#D1D5DB] px-3 py-3 text-[14px] outline-none resize-none focus:border-[#2563EB]"
//             />
//           </div>

//           <div className="flex items-center gap-3">
//             <button className="bg-[#183B63] hover:bg-[#163556] text-white text-[14px] font-medium px-5 py-2 rounded-[6px]">
//               Save
//             </button>
//             <button
//               onClick={closeAll}
//               className="border border-[#94A3B8] text-[#183B63] text-[14px] font-medium px-5 py-2 rounded-[6px]"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )} */}

//       {/* Banner 4 Modal */}
//       {selectedBanner && (
//         <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
//           <div className="w-full max-w-[460px] bg-white rounded-[8px] shadow-lg p-4">
//             <h2 className="text-[16px] font-semibold text-[#111827] mb-3">
//               {selectedBanner.name}
//             </h2>

//             <div>
//               {!videoPreview ? (
//                 // ✅ Upload box (only when no video)
//                 <label className="w-[60px] h-[60px] border border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-100">
//                   <input
//                     type="file"
//                     accept="video/*"
//                     className="hidden"
//                     onChange={handleVideoUpload}
//                   />
//                   <MdOutlineFileUpload className="text-2xl text-gray-500" />
//                 </label>
//               ) : (
//                 // ✅ Video preview with remove button
//                 <div className="relative w-[120px] h-[80px]">
//                   <video
//                     src={videoPreview}
//                     className="w-full h-full object-cover rounded-md"
//                   />

//                   {/* ❌ Remove button */}
//                   <button
//                     onClick={handleRemoveVideo}
//                     className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:bg-black"
//                   >
//                     <X size={14} className="text-black" />
//                   </button>
//                 </div>
//               )}

//               {/* Message */}
//               <span
//                 className={`text-[12px] ${fileError ? "text-red-500" : "text-[#686868]"
//                   }`}
//               >
//                 {fileError
//                   ? fileError
//                   : "*Recommended 1920x800px size with 4-8Mb video size only in MP4"}
//               </span>
//             </div>

//             {/* Title */}
//             <div className="mt-3">
//               <label className="block text-[14px] text-[#374151] mb-1">
//                 Title <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 placeholder="Write a title"
//                 className="w-full h-[42px] rounded-[6px] border border-[#D1D5DB] bg-[#F8FBFC] px-3 text-[14px] outline-none focus:border-[#2563EB]"
//                 value={selectedBanner.title}
//                 onChange={(e) => setSelectedBanner({ ...selectedBanner, title: e.target.value })}
//               />
//             </div>

//             {/* Description */}
//             <div className="mt-3">
//               <label className="block text-[14px] text-[#374151] mb-1">
//                 Description <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 placeholder="Write a description"
//                 rows={4}
//                 className="w-full bg-[#F8FBFC] rounded-[6px] border border-[#D1D5DB] px-3 py-3 text-[14px] outline-none resize-none focus:border-[#2563EB]"
//                 value={selectedBanner.description}
//                 onChange={(e) => setSelectedBanner({ ...selectedBanner, description: e.target.value })}
//               />
//             </div>

//             {/* Buttons */}
//             <div className="flex items-center gap-3">
//               <button className="bg-[#183B63] hover:bg-[#163556] text-white text-[14px] font-medium px-5 py-2 rounded-[6px]">
//                 Save
//               </button>
//               <button
//                 onClick={() => setSelectedBanner(null)}
//                 className="border border-[#94A3B8] text-[#183B63] text-[14px] font-medium px-5 py-2 rounded-[6px]"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default BannersSettings;