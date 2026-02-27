import { Instagram, Twitter, Youtube, Facebook } from "lucide-react";
import { Link } from "react-router";

function Footer() {
  return (
    <section className="lg:px-20 md:px-[60px] px-4 py-[40px] bg-[#1C3753] text-white">
      <div className="flex justify-between lg:flex-nowrap flex-wrap gap-4">
        <div className="lg:w-[327px] w-[232px] flex flex-col gap-2">
          <Link to="/">
            <h1 className="font-[500] lg:text-[20px] text-[14.5px]">
              Laser Cut Metal Art
            </h1>
          </Link>
          <p className="lg:text-[16px] text-[11.5px] font-[300]">
            Premium laser cutting tools and accessories built for creators,
            fabricators, and manufacturers who demand accuracy and durability.
          </p>
          <div>
            <p className="font-[500] lg:text-[20px] text-[14.5px]">
              Contact us on
            </p>
            <span>(+91) 3523623254</span>
            <p>Monday - Sunday: 10:00 AM - 6:00 PM</p>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="lg:w-[180px] w-[120px] flex flex-col gap-2">
            <h1 className="font-[500] lg:text-[20px] text-[14.5px]">
              About Us
            </h1>
            <ul className="font-[300] flex flex-col gap-2 lg:text-[16px] text-[11.5px]">
              <Link to="/aboutUs">
                <li>
                  <a href="">About Us</a>
                </li>
              </Link>
              <Link to="/shippingpolicy">
                <li>
                  <a href="">Shipping Policy</a>
                </li>
              </Link>
              <Link to="/returnrefundpolicy">
                <li>
                  <a href="">Return & Refund Policy</a>
                </li>
              </Link>
              <Link to="/policy">
                <li>
                  <a href="">Privacy Policy</a>
                </li>
              </Link>
              <li>
                <a href="">Contact Us</a>
              </li>
              <Link to="/faqs">
                <li>
                  <a href="">FAQs</a>
                </li>
              </Link>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="lg:w-[180px] w-[120px] flex flex-col gap-2">
            <h1 className="font-[500] lg:text-[20px] text-[14.5px]">Shop</h1>
            <ul className="font-[300] flex flex-col gap-2 lg:text-[16px] text-[11.5px]">
              <li>
                <Link to="/products">
                  <a href="">Latest Products</a>
                </Link>
              </li>
              <li>
                <a href="">Bestseller Collection</a>
              </li>
              <li>
                <Link to="/products/top-products">
                  <a href="">Featured Collection</a>
                </Link>
              </li>
              <li>
                <Link to="/products/Festive">
                  <a href="">Festive Occasions</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:w-[180px] w-[120px] flex flex-col gap-2">
          <h1 className="font-[500] lg:text-[20px] text-[14.5px]">Account</h1>
          <ul className="lg:text-[16px] text-[11.5px] font-[300] flex flex-col gap-2">
            <li>
              <Link to="/accounts/details">
                <a href="">My Account</a>
              </Link>
            </li>
            <li>
              <a href="">My Cart</a>
            </li>
            <li>
              <Link to="/accounts/order-history">
                <a href="">My Orders</a>
              </Link>
            </li>
            <li>
              <Link to="/accounts/wishlist">
                <a href="">Wishlist</a>
              </Link>
            </li>
            <li>
              <Link to="/accounts/addresses">
                <a href="">Manage Addresses</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-8">
          {/* <div className="lg:w-[437px] w-[310.5px] flex flex-col gap-4">
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

          <div className="flex flex-col gap-4">
            <h1 className="font-[500] lg:text-[25px] text-[17.5px]">
              Connect With Us
            </h1>
            <div className="flex gap-3 font-[200]">
              <a href="">
                <Instagram size={27} strokeWidth={1.5} />
              </a>
              <a href="">
                <Facebook size={27} strokeWidth={1.5} />
              </a>
              <a href="">
                <Twitter size={27} strokeWidth={1.5} />
              </a>
              <a href="">
                <Youtube size={27} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between py-[20px] border-t-[1px] border-[#495F75] mt-4">
        <p className="lg:text-[16px] text-[11.5px]">
          © 2026 Kasper Infotech. All rights reserved.
        </p>
        <ul className="flex md:gap-4 gap-1 font-[400] lg:text-[16px] text-[11.5px]">
          <li>
            <Link to="/termsconditions">
            <a href="">Terms & Conditions</a>
            </Link>
          </li>
          {/* <li><a href="">Privacy</a></li>
                    <li><a href="">Cookies</a></li> */}
        </ul>
      </div>
    </section>
  );
}

export default Footer;
