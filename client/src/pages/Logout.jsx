import React from "react";
import Button from "../components/Button";
import { CirclePower, LogOut } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";

function Logout({ onCancel, onConfirm }) {
  return (
    <>
      <section className="lg:px-20 md:px-[60px] px-4">
        <div className="h-max flex justify-center items-center">
          <div className="flex flex-col gap-4">
            <h1 className="text-center text-[30px]">Log Out</h1>
            <div className="flex flex-col items-center gap-2">
              <span className="p-1 text-center">
                <LogOut
                  className="text-[#EBB100] p-2 bg-[#ECEFF3] rounded-full "
                  size={40}
                />
                {/* Log In / Log Out */}
                <div className="pt-4 border-t border-gray-200">
                  {isAuthenticated ? (
                    <>
                      {/* Logout Button */}
                      <div
                        className="flex items-center gap-4 px-7 pb-6 rounded-lg cursor-pointer transition-colors duration-200 group"
                        onClick={() => setShowLogoutModal(true)}
                      >
                        <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors duration-200">
                          <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-gray-800 font-medium text-sm">
                            Log Out
                          </h2>
                        </div>
                      </div>

                      {/* Logout Modal */}
                      <Modal
                        isOpen={showLogoutModal}
                        onClose={() => setShowLogoutModal(false)}
                        onConfirm={() => {
                          handleLogout();
                          setShowLogoutModal(false);
                        }}
                        title="Log Out"
                        description="Are you sure you want to log out?"
                        confirmText="Yes, Logout"
                        cancelText="Cancel"
                      ></Modal>
                    </>
                  ) : (
                    // Login Link
                    <Link
                      to="/login"
                      className="flex items-center gap-4 p-3 my-1 rounded-lg hover:bg-yellow-50 transition-colors duration-200 group"
                    >
                      <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-yellow-100 transition-colors duration-200">
                        <LogIn className="w-5 h-5 text-gray-600 group-hover:text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-yellow-600 font-medium text-sm">
                          Log In
                        </h2>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  )}
                </div>
              </span>
              <p className="text-[15px]">Are you sure you want to log out?</p>
            </div>
            <div className="flex w-full gap-4">
              <button
                onClick={onCancel}
                className="rounded-md px-6 py-2 whitespace-nowrap justify-center border border-[#212121]"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="rounded-md px-6 py-2 justify-center bg-[#212121] text-white"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Logout;
