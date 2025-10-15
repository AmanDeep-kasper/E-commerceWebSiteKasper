import { TriangleAlert } from "lucide-react";
import Button from "../components/Button";
import React from "react";

function Troublshoot() {
  return (
    <>
      <section className="h-dvh flex items-center justify-center">
        <div className="flex flex-col gap-2 w-[410px] items-center">
          <span className="rounded-full overflow-hidden">
            <TriangleAlert className="p-2 w-10 h-10 bg-[#FEF0C7] text-[#DC6803] "></TriangleAlert>
          </span>
          <h1 className="font-medium text-lg sm:text-xl text-gray-800">Something went wrong...</h1>
          <p className="text-center text-[#828282] leading-5">
            We had some trouble loading this page. Please refresh the page to
            try again or get in touch if the problem come again!
          </p>
          <div className="flex gap-2 mt-6 w-full">
            <Button cart={true} className="flex-1 px-6 py-2 whitespace-nowrap justify-center" btnClass="flex-1">
              Contact Support
            </Button>
            <Button className="flex-1 px-6 py-2 justify-center" btnClass="flex-1">Refresh Page</Button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Troublshoot;
