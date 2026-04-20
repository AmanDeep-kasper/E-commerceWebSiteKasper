// import { Instagram, Twitter, Youtube, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import facebook from "../assets/img/facebook.png";
import instagram from "../assets/img/instagram.png";
import map from "../assets/img/googleMap.png";
import footerImg from "../assets/img/FooterImg.png";

function Footer() {
  return (
    <section className="relative lg:px-20 md:px-[60px] px-4 py-[20px] bg-[#FAFAF8] text-[#2D2F31]">
      <img
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-100"
        src={footerImg}
        alt=""
      />
      <div className="relative z-10 flex justify-between lg:flex-nowrap flex-wrap gap-4">
        <div className="flex flex-col w-full">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 flex justify-between sm:gap-10 lg:gap-20 md:gap-15">

            <div className="flex flex-col gap-2">
              <Link to="/home">
                <h1 className="font-[500] font-marcellus lg:text-[20px] text-[14.5px] text-[#44546C]">
                  Happy Art Supplies
                </h1>
              </Link>
              <p className="lg:text-[14px] text-[11.5px] font-[300] text-[#7D8694] font-">
                Happy Art Supplies offers premium resin art materials across India.
                Since 2021, we’ve helped creators with quality supplies, reliable
                service, and everything needed to bring ideas to life. ✨
              </p>
              <div>
                <p className="text-[#44546C] text-[16px]">Contact us on</p>
                <p className="font-[400] lg:text-sm text-sm">Sangeetha Banerjee</p>
                <span className="text-sm">(+91) 98868 94723</span>
                <br />
                <span className="text-sm">happyartsupplies@gmail.com</span>
                <p className="text-sm">
                  B402, Unites Crossandra, Hormavu Agara Lake Road
                </p>
                {/* <br /> */}
                <p className="text-sm">
                  Horamavu, Bengaluru 560043, Karnataka, India
                </p>
                <div className="flex gap-3 font-[200] mt-2">
                  <img src={instagram} alt="" />
                  <img src={facebook} alt="" />
                  <img src={map} alt="" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="font-[300] lg:text-[20px] text-[14.5px] text-[#44546C]">
                  About Us
                </h1>
                <ul className="font-[300] flex flex-col gap-2 lg:text-[16px] text-[11.5px] text-[#7D8694]">
                  <Link to="/aboutUs">
                    <li>About Us</li>
                  </Link>
                  <Link to="/shippingpolicy">
                    <li>Shipping Policy</li>
                  </Link>
                  <Link to="/returnrefundpolicy">
                    <li>Return & Refund Policy</li>
                  </Link>
                  <Link to="/policy">
                    <li>Privacy Policy</li>
                  </Link>
                  <Link to="/accounts/support">
                    <li>Contact Us</li>
                  </Link>
                  <Link to="/faqs">
                    <li>FAQs</li>
                  </Link>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h1 className="font-[300]  lg:text-[20px] text-[14.5px] text-[#44546C]">
                  Shop
                </h1>
                <ul className="font-[300] flex flex-col gap-2 lg:text-[16px] text-[11.5px] text-[#7D8694]">
                  <li>
                    <Link to="/products">Best Selling Products</Link>
                  </li>
                  <li>
                    <Link to="/">Bestseller Collection</Link></li>
                  <li>
                    <Link to="/products/top-products">Featured Collection</Link>
                  </li>
                  <li>
                    <Link to="/products/Festive">Festive Occasions</Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="font-[300] lg:text-[20px] text-[14.5px] text-[#44546C]">
                Account
              </h1>
              <ul className="lg:text-[16px] text-[11.5px] font-[300] flex flex-col gap-2 text-[#7D8694]">
                <li>
                  <Link to="/accounts/details">My Account</Link>
                </li>
                <Link to="/bag">
                <li>My Cart</li>
                </Link>
                <li>
                  <Link to="/accounts/order-history">My Orders</Link>
                </li>
                <li>
                  <Link to="/accounts/wishlist">Wishlist</Link>
                </li>
                {/* <li>
                  <Link to="/accounts/addresses">Manage Addresses</Link>
                </li> */}
              </ul>
            </div>

           {/*  <div className="flex flex-col gap-8">
              <div className="lg:w-[437px] w-[310.5px] flex flex-col gap-4">
            <h1 className="font-[500] lg:text-[20px] text-[14.5px]">
              Stay Up to date
            </h1>
            <p className="font-[300] lg:text-[16px] text-[11.5px]">
              Get updated on New Arrivals, Offers & Design Tips.
            </p>
            <div className="flex gap-4">
              <input
                className="lg:text-[16px] text-[11.5px] lg:pl-[15px] pl-[10px] py-[5px] lg:py-[8px] text-white bg-transparent border border-white rounded-full outline-0"
                type="text"
                placeholder="Enter your Email"
              />
              <button className="lg:text-[16px] text-[11.5px] bg-white text-[#3A3A3A] rounded-full py-[10] px-[30px]">
                Subscribe
              </button>
            </div>
          </div> */}

              {/* <div className="flex flex-col gap-4">
            <h1 className="font-[500] lg:text-[25px] text-[17.5px]">
              Connect With Us
            </h1>
            <div className="flex gap-3 font-[200]">
              
                <Instagram size={27} strokeWidth={1.5} />
              
              
                <Facebook size={27} strokeWidth={1.5} />
              
              
                <Twitter size={27} strokeWidth={1.5} />
              
              
                <Youtube size={27} strokeWidth={1.5} />
              
            </div>
          </div> 
            </div> */}

          </div>
          <div className="flex justify-between py-[20px] border-t-[1px] border-[#ACACAC] mt-4">
            <p className="lg:text-sm text-xs text-[#2D2F31]">
              © 2026 HAPPY ART SUPPLIES. All rights reserved.
            </p>
            <ul className="flex md:gap-4 gap-1 font-[400] lg:text-[16px] text-[11.5px]">
              <li className="lg:text-sm text-xs text-[#2D2F31]">
                <Link to="/termsconditions">Terms & Conditions</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Footer;
