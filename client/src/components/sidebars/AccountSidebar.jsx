import { Wallet, Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link, NavLink } from "react-router";
import users from "../data/user";
import { User, Package, Heart, MapPin, HelpCircle, Star } from "lucide-react";
import { useSelector } from "react-redux";

const accountMenu = [
  { label: "Account Details", path: "/details", icon: User },
  { label: "Orders", path: "/order-history", icon: Package },
  { label: "Wishlist", path: "/wishlist", icon: Heart },
  { label: "Manage Addresses", path: "/addresses", icon: MapPin },
  { label: "Support & Help", path: "/support", icon: HelpCircle },
  { label: "Reviews & Ratings", path: "/reviews", icon: Star },
];

function AccountSidebar() {
  const [image, setImage] = useState(users[0].profileImage);
  const [name, setName] = useState(users[0].name);
  const inputRef = useRef(null);
  const token = localStorage.getItem("token");
  const {user, isAuthenticated} = useSelector(s => s.user)

  // 🟡 Fetch user data including image on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axiosInstance.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setImage(res.data.profileImage);
        setName(res.data.name);
      } catch (err) {
        console.error("Failed to load user data", err);
      }
    };

    fetchUserData();
  }, [token]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const res = await axiosInstance.patch(
        "/users/me/profile-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setImage(res.data.profileImage);
      toast.success("Profile image updated");
    } catch (err) {
      console.error("Upload failed", err);
    }
  };


  return (
    <div className="sticky top-20 h-max min-w-[310px] !w-[310px] bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      {/* Account holder */}
      <div className="px-6 py-4 flex gap-4 items-center text-white bg-[#E4C590] border-l-black rounded-b-3xl rounded-t-lg m-1">
        <div className="relative group w-14 h-14 rounded-full overflow-hidden border-2 border-white/90 hover:border-white/50 transition-all duration-300">
          <img
            src={`http://localhost:5000/uploads/${image}` ||"/name1.jpg "}
            alt="Profile"
            className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
          />
          <div
            className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={() => inputRef.current.click()}
          >
            <Camera className="text-white w-5 h-5" />
          </div>
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div className="text-black">
          <p className="text-sm font-light">Welcome back</p>
          <p className="font-medium">{name}</p>
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 py-2">
        {/* Account Details */}
        <div className="mb-6">
          <h3 className="px-2 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Account
          </h3>
          <ul className="space-y-1">
            {accountMenu.map(({ label, path, icon: Icon }) => (
              <li key={label}>
                <NavLink
                  to={`/accounts${path}`}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-amber-50 text-amber-800"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                >
                  {Icon && <Icon className="w-5 h-5 mr-3 opacity-70" />}
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Payments */}
        {/* <div className="mb-6 border-t border-gray-200 pt-4">
          <h1 className="flex items-center px-2 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
            <Wallet className="w-4 h-4 mr-2" />
            Payments
          </h1>
          <ul className="space-y-1">
            <li className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200">
              <span>Gift Cards</span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                ₹5
              </span>
            </li>
            <li className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200">
              Saved UPI
            </li>
            <li className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200">
              Saved Cards
            </li>
          </ul>
        </div> */}

        {/* Legal */}
        {/* <div className="mb-4 border-t border-gray-200 pt-4">
          <h1 className="px-2 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Legal
          </h1>
          <ul className="space-y-1">
            <li className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200">
              Terms of Use
            </li>
            <Link className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200" to={`/policy`}>
              Privacy Policy
            </Link>
          </ul>
        </div> */}

        {/* Logout */}
        <hr />
        <button
          // onClick={handleLogout}
          className="w-full flex items-center px-3 py-3 mt-1 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
        >
          <div className="p-1.5 mr-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-all duration-200">
            <svg
              fill="#DC2626"
              height="18px"
              width="18px"
              viewBox="0 0 325.214 325.214"
              className="transition-all duration-200"
            >
              <g>
                <path
                  d="M288.777,93.565c-15.313-23.641-36.837-42.476-62.243-54.472c-1.616-0.763-3.109-1.134-4.564-1.134
                      c-1.969,0-8.392,0.833-8.392,11.541v17.75c0,8.998,5.479,13.113,7.159,14.16c32.613,20.33,52.083,55.317,52.083,93.59
                      c0,60.772-49.442,110.214-110.214,110.214S52.393,235.772,52.393,175c0-38.872,19.942-74.144,53.346-94.353
                      c4.475-2.707,6.839-7.426,6.839-13.647V49c0-7.959-5.077-10.783-9.424-10.783c-1.714,0-3.542,0.422-5.144,1.188
                      C72.781,51.471,51.42,70.305,36.237,93.872C20.638,118.084,12.393,146.137,12.393,175c0,82.828,67.386,150.214,150.214,150.214
                      S312.821,257.828,312.821,175C312.821,146.008,304.507,117.848,288.777,93.565z"
                />
                <path
                  d="M152.579,117h21c5.514,0,10-4.486,10-10V10c0-5.514-4.486-10-10-10h-21c-5.514,0-10,4.486-10,10v97
                      C142.579,112.514,147.064,117,152.579,117z"
                />
              </g>
            </svg>
          </div>
          Logout
        </button>
      </div>
    </div>
  );
}

export default AccountSidebar;
