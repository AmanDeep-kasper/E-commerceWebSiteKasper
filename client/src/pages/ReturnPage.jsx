import React, { useState } from 'react';
import orders from "../data/orders.json"
import { useParams } from 'react-router';

const ReturnPage = () => {
  // State management
  const [step, setStep] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [reason, setReason] = useState('');
  const [evidence, setEvidence] = useState([]);
  const [refundMode, setRefundMode] = useState('');
  const {orderId} = useParams()
  const [pickupDetails, setPickupDetails] = useState({
    name: '',
    phone: '',
    address: '',
    landmark: '',
    city: '',
    pincode: '',
    date: '',
    timeSlot: ''
  });

  // Sample data
  const items = orders.find(val => val.orderId === orderId).items;

  // Step titles for progress indicator
  const stepTitles = [
    "Select Items",
    "Return Reason",
    "Upload Evidence",
    "Refund Mode",
    "Pickup Details"
  ];

  // Toggle item selection
  const toggleItem = (productId) => {
    if (selectedItems.includes(productId)) {
      setSelectedItems(selectedItems.filter(id => id !== productId));
    } else {
      setSelectedItems([...selectedItems, productId]);
    }
  };

  // Handle file upload
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    setEvidence([...evidence, ...files]);
  };

  // Remove uploaded file
  const removeFile = (index) => {
    const newEvidence = [...evidence];
    newEvidence.splice(index, 1);
    setEvidence(newEvidence);
  };

  // Navigation handlers
  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Handle form submission
  const handleSubmit = () => {
    alert('Return request submitted successfully!');
    // In a real app, you would submit the data to your backend here
  };

  // Handle pickup details change
  const handlePickupChange = (e) => {
    const { name, value } = e.target;
    setPickupDetails({
      ...pickupDetails,
      [name]: value
    });
  };

  // Save pickup details
  const savePickupDetails = () => {
    // This would typically connect to an API
    console.log('Pickup details saved:', pickupDetails);
    handleNext();
  };

  // Custom file input component
  const FileInput = () => (
    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <div className="mt-4 flex text-sm leading-6 text-gray-600">
          <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
            <span>Upload files</span>
            <input 
              id="file-upload" 
              name="file-upload" 
              type="file" 
              multiple 
              className="sr-only" 
              onChange={handleUpload}
            />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
      </div>
    </div>
  );

  // Pickup form component
  const PickupForm = ({ savePickupDetails }) => (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-4">Step 5: Pickup Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={pickupDetails.name}
            onChange={handlePickupChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={pickupDetails.phone}
            onChange={handlePickupChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your phone number"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            name="address"
            value={pickupDetails.address}
            onChange={handlePickupChange}
            rows={3}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your complete address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
          <input
            type="text"
            name="landmark"
            value={pickupDetails.landmark}
            onChange={handlePickupChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nearby landmark"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            name="city"
            value={pickupDetails.city}
            onChange={handlePickupChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your city"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
          <input
            type="text"
            name="pincode"
            value={pickupDetails.pincode}
            onChange={handlePickupChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter pincode"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
          <input
            type="date"
            name="date"
            value={pickupDetails.date}
            onChange={handlePickupChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
          <select
            name="timeSlot"
            value={pickupDetails.timeSlot}
            onChange={handlePickupChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a time slot</option>
            <option value="9:00 AM - 12:00 PM">9:00 AM - 12:00 PM</option>
            <option value="12:00 PM - 3:00 PM">12:00 PM - 3:00 PM</option>
            <option value="3:00 PM - 6:00 PM">3:00 PM - 6:00 PM</option>
            <option value="6:00 PM - 9:00 PM">6:00 PM - 9:00 PM</option>
          </select>
        </div>
      </div>
      <button
        onClick={savePickupDetails}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Save Pickup Details
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 w-full">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <button
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
            onClick={() => window.history.back()}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Order Details
          </button>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Return Request</h2>
          <p className="text-gray-600 mt-1">Select items and provide return details.</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {stepTitles.map((title, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step > index + 1 ? 'bg-blue-600' : step === index + 1 ? 'bg-blue-600' : 'bg-gray-300'} text-white`}>
                  {step > index + 1 ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`text-xs mt-2 text-center ${step >= index + 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                  {title}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Step Content */}
          <div className="p-6">
            {/* Step 1: Select Items */}
            {step === 1 && (
              <div>
                <h2 className="text-lg font-medium mb-4">Select Items to Return</h2>
                <p className="text-gray-600 mb-4">Choose the items you want to return from your order.</p>
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center border rounded-lg p-4 cursor-pointer transition-all ${selectedItems.includes(item.productId) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                      onClick={() => toggleItem(item.productId)}
                    >
                      <div className={`flex items-center justify-center w-5 h-5 rounded-full border mr-3 ${selectedItems.includes(item.productId) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                        {selectedItems.includes(item.productId) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="ml-4 flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Reason */}
            {step === 2 && (
              <div>
                <h2 className="text-lg font-medium mb-4">Reason for Return</h2>
                <p className="text-gray-600 mb-4">Please tell us why you are returning these items.</p>
                <div className="space-y-3">
                  {[
                    "Wrong item delivered",
                    "Damaged / defective",
                    "Quality not as expected",
                    "No longer needed",
                    "Other",
                  ].map((r, idx) => (
                    <label key={idx} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="return-reason"
                        value={r}
                        checked={reason === r}
                        onChange={(e) => setReason(e.target.value)}
                        className="mt-1 mr-3"
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>
                {reason === "Other" && (
                  <div className="mt-4">
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Please specify your reason..."
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Upload Evidence */}
            {step === 3 && (
              <div>
                <h2 className="text-lg font-medium mb-4">Upload Evidence</h2>
                <p className="text-gray-600 mb-4">Please upload photos that show the issue with your product.</p>
                
                <FileInput />
                
                {evidence.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-900 mb-2">Uploaded Files</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {evidence.map((file, idx) => (
                        <div key={idx} className="relative group">
                          <div className="w-full h-24 bg-gray-100 rounded-md flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-xs text-gray-500 truncate mt-1">{file.name}</p>
                          <button
                            onClick={() => removeFile(idx)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Refund Mode */}
            {step === 4 && (
              <div>
                <h2 className="text-lg font-medium mb-4">Refund Method</h2>
                <p className="text-gray-600 mb-4">How would you like to receive your refund?</p>
                <div className="space-y-3">
                  <label className={`flex items-start p-4 border rounded-lg cursor-pointer ${refundMode === "original" ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="refund-method"
                      value="original"
                      checked={refundMode === "original"}
                      onChange={(e) => setRefundMode(e.target.value)}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <span className="font-medium">Original Payment Method</span>
                      <p className="text-sm text-gray-500 mt-1">Refund will be processed to your original payment method. This may take 5-10 business days.</p>
                    </div>
                  </label>
                  
                  <label className={`flex items-start p-4 border rounded-lg cursor-pointer ${refundMode === "wallet" ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="refund-method"
                      value="wallet"
                      checked={refundMode === "wallet"}
                      onChange={(e) => setRefundMode(e.target.value)}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <span className="font-medium">Store Credit / Wallet</span>
                      <p className="text-sm text-gray-500 mt-1">Instant refund to your account wallet. You can use this credit for future purchases.</p>
                    </div>
                  </label>
                  
                  <label className={`flex items-start p-4 border rounded-lg cursor-pointer ${refundMode === "replace" ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="refund-method"
                      value="replace"
                      checked={refundMode === "replace"}
                      onChange={(e) => setRefundMode(e.target.value)}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <span className="font-medium">Replace Item</span>
                      <p className="text-sm text-gray-500 mt-1">We'll send you a replacement for the returned item.</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Step 5: Pickup Details */}
            {step === 5 && <PickupForm savePickupDetails={savePickupDetails} />}
          </div>

          {/* Navigation Buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
            <button
              className={`px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${step === 1 ? 'invisible' : ''}`}
              onClick={handleBack}
            >
              Back
            </button>
            
            {step < 5 ? (
              <button
                className="ml-auto px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                onClick={handleNext}
                disabled={
                  (step === 1 && selectedItems.length === 0) ||
                  (step === 2 && !reason) ||
                  (step === 4 && !refundMode)
                }
              >
                Next
              </button>
            ) : (
              <button
                className="ml-auto px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                onClick={handleSubmit}
              >
                Submit Return Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPage;