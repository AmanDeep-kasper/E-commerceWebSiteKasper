// components/LogoutModalContent.jsx
import React from "react";
import Button from "./Button";
import { CirclePower } from "lucide-react";

function LogoutModalContent({ onCancel, onConfirm }) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-center text-lg sm:text-xl font-semibold text-gray-800">Log Out</h1>
      <div className="flex flex-col items-center gap-2">
        <span className="p-1 text-center">
          <CirclePower className="text-[#EBB100] p-1 bg-[#ECEFF3] rounded-full" />
        </span>
        <p className="text-[15px] text-center">Are you sure you want to log out?</p>
      </div>
      <div className="flex w-full gap-2">
        <Button cart={true} className="px-6 py-2 justify-center" btnClass="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="px-6 py-2 justify-center" btnClass="flex-1" onClick={onConfirm}>
          Log Out
        </Button>
      </div>
    </div>
  );
}

export default LogoutModalContent;
