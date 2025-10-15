import React from "react";
import {
  Plus,
  Edit2,
  X,
  Trash2,
  MapPin,
  Home,
  Building,
  Phone,
  User,
  Navigation,
  Tag,
  Calendar,
  FileText,
} from "lucide-react";
import { Link } from "react-router";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const InfoRow = ({ label, value, icon: Icon, status, className = "" }) => {
  const statusColors = {
    home: "bg-blue-100 text-blue-800 w-max",
    work: "bg-purple-100 text-purple-800 w-max",
    shipping: "bg-green-100 text-green-800 w-max",
    billing: "bg-amber-100 text-amber-800 w-max",
    both: "bg-indigo-100 text-indigo-800 w-max",
  };

  return (
    <div
      className={`flex flex-col gap-1 p-3 bg-gray-50 rounded-lg ${className}`}
    >
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        <span>{label}</span>
      </div>
      {status && statusColors[status] ? (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]} mt-1 inline-block`}
        >
          {value}
        </span>
      ) : (
        <div className="text-sm font-medium text-gray-900">{value}</div>
      )}
    </div>
  );
};

const Section = ({ title, icon: Icon, children }) => (
  <div className="mb-6 last:mb-0">
    <h3 className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide border-b pb-2 mb-4">
      {Icon && <Icon className="w-4 h-4" />}
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const AddressCard = ({ address, index }) => {
  const getAddressTypeStatus = (type) => {
    const typeMap = {
      home: "home",
      work: "work",
      "Shipping + Billing": "both",
      "Billing Only": "billing",
    };
    return typeMap[type.toLowerCase()] || "home";
  };

  return (
    <Card className="p-6 mb-6 last:mb-0">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-semibold text-gray-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-500" />
          Address {index + 1}
          {address.fields["Address Tag"] && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                getAddressTypeStatus(address.fields["Address Tag"]) === "home"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-purple-100 text-purple-800"
              }`}
            >
              {address.fields["Address Tag"]}
            </span>
          )}
        </h3>
        <div className="flex items-center gap-2">
          <Link
            to={"/admin/address-form"}
            className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            <Edit2 className="w-4 h-4" /> Edit
          </Link>
          <button className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm bg-amber-500 text-white hover:bg-amber-600">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      <Section title="Contact Information" icon={User}>
        <InfoRow
          label="Full Name"
          value={address.fields["Full Name"]}
          icon={User}
        />
        <InfoRow label="Phone" value={address.fields["Phone"]} icon={Phone} />
      </Section>

      <Section title="Address Details" icon={Navigation}>
        <InfoRow
          label="Address"
          value={address.fields["Address"]}
          icon={MapPin}
          className="md:col-span-2"
        />
        <InfoRow
          label="City"
          value={address.fields["City"] || "Delhi"}
          icon={Building}
        />
        <InfoRow
          label="State"
          value={address.fields["State"] || "Delhi"}
          icon={Navigation}
        />
        <InfoRow
          label="Postal Code"
          value={address.fields["Postal Code ( PIN )"] || "110034"}
          icon={Tag}
        />
        <InfoRow
          label="Country"
          value={address.fields["Country"] || "India"}
          icon={MapPin}
        />
      </Section>

      <Section title="Usage Information" icon={FileText}>
        <InfoRow
          label="Address Type"
          value={
            address.fields["Address Type"] ||
            address.fields["Type"] ||
            "Shipping + Billing"
          }
          icon={Tag}
          status={getAddressTypeStatus(
            address.fields["Address Type"] ||
              address.fields["Type"] ||
              "Shipping + Billing"
          )}
        />
        <InfoRow
          label="Used in Orders"
          value={address.fields["Used in Orders"]}
          icon={FileText}
        />
        {address.fields["Added On"] && (
          <InfoRow
            label="Added On"
            value={address.fields["Added On"]}
            icon={Calendar}
          />
        )}
        {address.fields["Modified"] && (
          <InfoRow
            label="Last Modified"
            value={address.fields["Modified"]}
            icon={Calendar}
          />
        )}
      </Section>
    </Card>
  );
};

function AddressBook() {
  const addresses = [
    {
      fields: {
        "Full Name": "Neha Pal",
        Phone: "8448******",
        City: "Delhi",
        Country: "India",
        "Used in Orders": "05",
        "Address Type": "Shipping + Billing",
        Address:
          "C-102, Krishna Residency Near metro Station, XYZ Nagar Pitampura, North Delhi, Delhi - 110034, India",
        State: "Delhi",
        "Postal Code ( PIN )": "110034",
        "Address Tag": "Home",
      },
    },
    {
      fields: {
        "Full Name": "Neha Pal",
        Phone: "8448******",
        "Address Tag": "Work",
        "Added On": "15 Jul 2025",
        "Used in Orders": "02",
        Address: "47 Work Lane, Connaught Place, Delhi - 110002",
        Type: "Billing Only",
        Modified: "15 Jul 2025",
      },
    },
  ];

  return (
    <div className="col-span-7">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Address Book
          </h2>
        </div>

        {addresses.map((address, index) => (
          <AddressCard key={index} address={address} index={index} />
        ))}
      </Card>
    </div>
  );
}

export default AddressBook;
