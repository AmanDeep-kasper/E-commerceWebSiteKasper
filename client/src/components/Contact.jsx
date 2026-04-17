import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

function ContactSection() {
  const [formData, setFormData] = useState({
    // name: "",
    // email: "",
    // phone: "",
    // subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const promise = axiosInstance.post("/user/send-support-message", formData);

    toast.promise(promise, {
      pending: "Sending support message...",
      success: "Support message sent successfully",
      error: "Failed to send support message",
    });

    try {
      await promise;
      setFormData({
        message: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full font-inter mt-5">
      <div className="bg-white md:rounded-md md:shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-3">
          {/* ===== Left: Form ===== */}
          <div className="lg:col-span-2">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Contact Us
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  We'd love to hear from you. Fill out this form below.
                </p>
              </div>
            </div>

            <form className="p-6 space-y-5" onSubmit={handleSubmit}>
              {/* Full Name 
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1C3753] focus:border-[#1C3753] outline-none transition"
                  placeholder="John Doe"
                  required
                />
              </div>
*/}
              {/* Email 
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1C3753] focus:border-[#1C3753] outline-none transition"
                  placeholder="your@email.com"
                  required
                />
              </div>
*/}
              {/* Phone */}
              {/* <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1C3753] focus:border-[#1C3753] outline-none transition"
                  placeholder="1234567890"
                  pattern="[0-9]{10}"
                  maxLength="10"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subject <span className="text-red-500">*</span>
                </label>

                <select
                  id="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#1C3753] focus:border-[#1C3753] outline-none transition"
                  required
                >
                  <option value="">Select subject</option>
                  <option value="Order Issue">Order Issue</option>
                  <option value="Payment Issue">Payment Issue</option>
                  <option value="Return / Replace">Return / Replace</option>
                  <option value="Product Query">Product Query</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Other">Other</option>
                </select>
              </div> */}

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1C3753] focus:border-[#1C3753] outline-none transition"
                  placeholder="Write your message..."
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 text-sm font-medium bg-[#1C3753] text-white rounded-lg shadow-sm hover:bg-black transition flex items-center justify-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit
              </button>
            </form>
          </div>

          {/* ===== Right: Contact Info ===== */}
          <div className="p-8 flex flex-col justify-center bg-gradient-to-b from-[#CFC7FF]/20 to-[#FFC9EA]/50 space-y-6">
            <div className="text-center mb-1">
              <h2 className="text-lg font-semibold text-gray-800">
                Get in Touch
              </h2>
              {/* <p className="text-sm text-gray-500 mt-1">
                We're here to help with any questions
              </p> */}
            </div>

            <div className="w-full bg-[#F6F8F9] rounded-lg p-5 border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center gap-4 p-3 bg-white rounded-lg">
                <div className="p-2 bg-[#F5F8FA] rounded-lg">
                  <Mail className="w-5 h-5 text-[#1C3753]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-500">happyartsupplies@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-white rounded-lg">
                <div className="p-2 bg-[#F5F8FA] rounded-lg">
                  <Phone className="w-5 h-5 text-[#1C3753]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <p className="text-sm text-gray-500">(+91) 98868 94723</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-white rounded-lg">
                <div className="p-2 bg-[#F5F8FA] rounded-lg">
                  <MapPin className="w-5 h-5 text-[#1C3753]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Address</p>
                  <p className="text-sm text-gray-500">B402, Unites Crossandra, Hormavu Agara Lake Road Horamavu, Bengaluru 560043, Karnataka, India</p>
                </div>
              </div>

              {/* <div className="flex items-center gap-4 p-3 bg-white rounded-lg">
                <div className="p-2 bg-[#F5F8FA] rounded-lg">
                  <Clock className="w-5 h-5 text-[#1C3753]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Working Hours
                  </p>
                  <p className="text-sm text-gray-500">Mon - Fri, 9am - 6pm</p>
                </div>
              </div> */}
            </div>
{/* 
            <div className="text-xs text-[#686868] mt-4 text-center">
              We typically respond within 24 hours
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactSection;
