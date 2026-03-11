import React, { useState } from "react";

const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-[22px] w-[40px] items-center rounded-full transition-colors duration-200 ${
        checked ? "bg-[#1F3B5B]" : "bg-[#A3A3A3]"
      }`}
    >
      <span
        className={`inline-block h-[16px] w-[16px] transform rounded-full bg-white transition-transform duration-200 ${
          checked ? "translate-x-[20px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
};

const NotificationRow = ({ title, description, checked, onToggle }) => {
  return (
    <div className="flex items-center justify-between px-4 py-4 border-b border-[#E5E7EB] last:border-b-0">
      <div>
        <h4 className="text-[16px] font-medium text-[#222222]">{title}</h4>
        <p className="text-[12px] text-[#8A8A8A] mt-1">{description}</p>
      </div>

      <ToggleSwitch checked={checked} onChange={onToggle} />
    </div>
  );
};

const NotificationSection = ({ heading, items, states, onToggle }) => {
  return (
    <div className="mb-6">
      <h3 className="text-[18px] font-medium text-[#2B2B2B] mb-3">{heading}</h3>

      <div className="bg-white rounded-[14px] overflow-hidden border border-[#F0F0F0]">
        {items.map((item) => (
          <NotificationRow
            key={item.key}
            title={item.title}
            description={item.description}
            checked={states[item.key]}
            onToggle={() => onToggle(item.key)}
          />
        ))}
      </div>
    </div>
  );
};

const NotificationsSettings = () => {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    dashboardNotifications: false,

    outOfStockAlert: true,
    inventoryAdjustment: true,

    newOrder: true,
    orderCancellation: true,
    returnRequest: true,

    paymentSuccessful: true,
    refundProcessed: true,
    paymentFailed: true,

    newSupportTicket: true,
    customerReply: true,
  });

  const handleToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const notificationData = [
    {
      heading: "Notification Channels",
      items: [
        {
          key: "emailNotifications",
          title: "Email Notifications",
          description: "Receive notifications by email.",
        },
        {
          key: "dashboardNotifications",
          title: "Dashboard Notifications",
          description: "Receive alerts within the admin dashboard.",
        },
      ],
    },
    {
      heading: "Inventory Notifications",
      items: [
        {
          key: "outOfStockAlert",
          title: "Out of Stock Alert",
          description: "Notifies you when a product is out of stock.",
        },
        {
          key: "inventoryAdjustment",
          title: "Inventory Adjustment",
          description: "Notifies you when stock is manually adjusted.",
        },
      ],
    },
    {
      heading: "Order & Returns Notifications",
      items: [
        {
          key: "newOrder",
          title: "New Order",
          description: "Notifies you when a new order is placed.",
        },
        {
          key: "orderCancellation",
          title: "Order Cancellation",
          description: "Notifies you when an order is cancelled.",
        },
        {
          key: "returnRequest",
          title: "Return Request",
          description: "Notifies you when a customer requests a return.",
        },
      ],
    },
    {
      heading: "Payments Notifications",
      items: [
        {
          key: "paymentSuccessful",
          title: "Payment Successful",
          description: "Notifies you when a payment is successfully completed.",
        },
        {
          key: "refundProcessed",
          title: "Refund Processed",
          description: "Notifies you when a refund is completed.",
        },
        {
          key: "paymentFailed",
          title: "Payment Failed",
          description: "Notifies you when a payment attempt fails.",
        },
      ],
    },
    {
      heading: "Support & Ticket Notifications",
      items: [
        {
          key: "newSupportTicket",
          title: "New Support Ticket",
          description: "Notifies you when a new support ticket is created.",
        },
        {
          key: "customerReply",
          title: "Customer Reply",
          description: "Notifies you when a customer replies to an existing ticket.",
        },
      ],
    },
  ];

  return (
    <div className="w-full bg-[#F9FAFB] p-5">
      <div className="mb-6">
        <h1 className="text-[28px] font-semibold text-[#222222]">
          Notifications
        </h1>
        <p className="text-[14px] text-[#7B7B7B] mt-1">
          Control when and how you receive alerts across all modules.
        </p>
      </div>

      {notificationData.map((section) => (
        <NotificationSection
          key={section.heading}
          heading={section.heading}
          items={section.items}
          states={notifications}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
};

export default NotificationsSettings;