import users from "../../data/user";
import AccountDetails from "../AccountDetails";
import Navbar from "../../components/Navbar";
import AccountSidebar from "../../components/AccountSidebar";
import Footer from "../../sections/Footer";
import { Outlet } from "react-router";

function AccountLayout() {
  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   dateOfBirth: "",
  //   gender: "",
  //   alternateMobile: "",
  // });

  // Fetch user data on mount (backend)
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const res = await axiosInstance.get("/users/me", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       console.log(res);

  //       setFormData({
  //         name: res.data.name || "",
  //         email: res.data.email || "",
  //         dateOfBirth: res.data.dateOfBirth || "",
  //         gender: res.data.gender || "",
  //         alternateMobile: res.data.alternateMobile || "",
  //       });
  //     } catch (err) {
  //       console.error("Error fetching user:", err);
  //     }
  //   };
  //   fetchUser();
  // }, []);

  // const handleChange = (e) => {
  //   setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  // };

  // const handleGenderSelect = (gender) => {
  //   setFormData((prev) => ({ ...prev, gender }));
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const token = localStorage.getItem("token");
  //     await axiosInstance.put(
  //       "/users/me",
  //       {
  //         name: formData.name,
  //         dateOfBirth: formData.dateOfBirth,
  //         gender: formData.gender,
  //         alternateMobile: formData.alternateMobile,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     alert("Details updated!");
  //   } catch (err) {
  //     console.error("Update error:", err);
  //     alert("Failed to update details.");
  //   }
  // };

  const formData = users[0];

  return (
    <>
      <Navbar />
      <section className="lg:px-20 md:px-[60px] px-0 md:py-4 bg-gray-50 min-h-screen">
        <div className="flex flex-col lg:flex-row gap-4 mx-auto">
          <div className="max-lg:hidden">
            <AccountSidebar />
          </div>

          <Outlet/>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default AccountLayout;
