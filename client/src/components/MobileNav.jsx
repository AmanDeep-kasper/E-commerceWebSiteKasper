import React from "react";
import formImage from "../assets/SignupFormImage.png";
import { path } from "framer-motion/m";
import { ChevronDown } from "lucide-react";



function MobileNav({ navLinks }) {
  return (
    <div className="w-[300px]">
      <div className=" bg-[#FCF3E9] px-4 h-max">
        <div className="flex h-full">
          <div className="pt-[40px]">
            <h1 className="text-xl font-medium leading-6 my-2">
              First Time Here?
            </h1>
            <h1 className="bg-black text-white w-[100px] text-xl text-center rounded-md leading-6">
              Sign Up & Save Big!
            </h1>
          </div>
          <div className="h-full w-full">
            <img
              className="w-[130] h-full object-cover"
              src={formImage}
              alt=""
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="bg-[#FFCB2F] flex-1 py-3 rounded-md">
            Sign up
          </button>
          <button className="bg-[#FFCB2F] flex-1 rounded-md">Log in</button>
        </div>
      </div>
      <div className="px-4 flex flex-col gap-8 my-4">
        {navLinks.map((link) => (
          <div className="flex justify-between items-center">
            <h1>{link.linkName}</h1>
            <ChevronDown className="text-[#A1A1A1]" />
            <div>{
                link?.subList.map(({name, category}) => (
                    <h1>{name}</h1>
                ))
                }</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MobileNav;
