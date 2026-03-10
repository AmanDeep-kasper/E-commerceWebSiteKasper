import React from 'react'

const InventoryDetails = () => {
  return (
    <div> <div className="flex items-start justify-between gap-4">
          {/* Left */}
          <div className="flex flex-col w-[60%] space-y-4">
            <div className="flex flex-col space-y-3 bg-[#FFFFFF] px-3 py-3 rounded-xl">
              <h1 className="font-medium">Basic Information</h1>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[#686868] text-[14px]">
                    Transporter Name
                  </p>
                  {/* <span>{transporter.transporterName || "--"}</span> */}
                  <span>dljdj</span>
                </div>

                <div>
                  <p className="text-[#686868] text-[14px]">
                    Registration Number
                  </p>
                  {/* <span>{transporter.registrationNumber || "--"}</span> */}
                  <span>dljdkdj</span>
                </div>
              </div>

              <div>
                <p className="text-[#686868] text-[14px]">Tracking ID URL</p>
                {/* <span>{transporter.trackingUrl || "--"}</span> */}
                <span>djdkj</span>
              </div>

              
            </div>

            <div className="flex flex-col space-y-3 bg-[#FFFFFF] px-3 py-3 rounded-xl">
              <h1 className="font-medium">SLA Configuration</h1>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#686868] text-[14px]">
                    Expected Forward Delivery Time
                  </p>
                  <span>
                   
                   djdljkd
                  </span>
                </div>

                <div>
                  <p className="text-[#686868] text-[14px]">
                    Expected Return Delivery Time
                  </p>
                  <span>
                    ldjldjld
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#686868] text-[14px]">
                    Expected RTO Delivery Time
                  </p>
                  <span>
                    
                    d;kldldk
                  </span>
                </div>

                <div>
                  <p className="text-[#686868] text-[14px]">
                    Expected Fast Delivery Time
                  </p>
                  <span>
                  dkd;k;ld
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3 bg-[#FFFFFF] px-3 py-3 rounded-xl">
              <h1 className="font-medium">COD Charges</h1>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#686868] text-[14px]">
                    Cash On Delivery (COD)
                  </p>
                  <span
                    
                  >
                    dljdjd
                  </span>
                </div>

                <div>
                  <p className="text-[#686868] text-[14px]">
                    COD Charge Flat Rate
                  </p>
                  <span>₹</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col w-[40%] space-y-4">
            <div className="flex flex-col space-y-3 bg-[#FFFFFF] px-3 py-3 rounded-xl">
              <h1 className="font-medium">Contact Details</h1>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-[#686868] text-[14px]">
                    Contact Person Name
                  </p>
                  <span>dljdlkjd</span>
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-[#686868] text-[14px]">Phone Number</p>
                  <span>ldjkljd</span>
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-[#686868] text-[14px]">Email Address</p>
                  <span>dljdkld</span>
                </div>
              </div>
            </div>

            {/* <div className="flex flex-col space-y-3 bg-[#FFFFFF] px-3 py-3 rounded-xl">
              <h1 className="font-medium">Delivery Type</h1>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-[#686868] text-[14px]">Forward</p>
                  {renderSupportText(transporter.deliveryOptions?.forward)}
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-[#686868] text-[14px]">Return</p>
                  {renderSupportText(transporter.deliveryOptions?.return)}
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-[#686868] text-[14px]">RTO</p>
                  {renderSupportText(transporter.deliveryOptions?.rto)}
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-[#686868] text-[14px]">Fast Delivery</p>
                  {renderSupportText(transporter.deliveryOptions?.fast)}
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-[#686868] text-[14px]">One-Day Delivery</p>
                  {renderSupportText(transporter.deliveryOptions?.oneDay)}
                </div>
              </div>
            </div> */}
          </div>
        </div></div>
  )
}

export default InventoryDetails