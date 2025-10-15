import { Instagram, Twitter, Youtube, Facebook } from "lucide-react";

function Footer() {

    return (
        <section className="lg:px-20 md:px-[60px] px-4 py-[40px] bg-[#3A3A3A] text-white">
            <div className="flex justify-between lg:flex-nowrap flex-wrap gap-4">
                <div className="lg:w-[327px] w-[232px] flex flex-col gap-2">
                    <h1 className="font-[500] lg:text-[20px] text-[14.5px]">Laser Cut Metal Art</h1>
                    <p className="lg:text-[16px] text-[11.5px] font-[300]">Turn empty walls into works of art with handcrafted metal designs.</p>
                </div>
                <div className="flex flex-col gap-8">
                    <div className="lg:w-[139px] w-[98.5px] flex flex-col gap-2">

                        <h1 className="font-[500] lg:text-[20px] text-[14.5px]">Shop</h1>
                        <ul className="font-[300] flex flex-col gap-2 lg:text-[16px] text-[11.5px]">
                            <li><a href="">All Products</a></li>
                            <li><a href="">Best Sellers</a></li>
                            <li><a href="">Custom Orders</a></li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h1 className="font-[500] lg:text-[20px] text-[14.5px]">Customer Service</h1>
                        <p className="lg:text-[16px] text-[11.5px] font-[300]">FAQs</p>
                    </div>
                </div>
                <div className="lg:w-[139px] w-[98.5px] flex flex-col gap-2">
                    <h1 className="font-[500] lg:text-[20px] text-[14.5px]">Support</h1>
                    <ul className="lg:text-[16px] text-[11.5px] font-[300] flex flex-col gap-2">
                        <li><a href="">Contact Us</a></li>
                        <li><a href="">Order Tracking</a></li>
                        <li><a href="">Shipping Policy</a></li>
                        <li><a href="">Returns & Refunds</a></li>
                    </ul>
                </div>
                <div className="flex flex-col gap-8">

                    <div className="lg:w-[437px] w-[310.5px] flex flex-col gap-4">
                        <h1 className="font-[500] lg:text-[20px] text-[14.5px]">Stay Up to date</h1>
                        <p className="font-[300] lg:text-[16px] text-[11.5px]">Get updated on New Arrivals, Offers & Design Tips.</p>
                        <div className="flex gap-4">
                            <input className="lg:text-[16px] text-[11.5px] lg:pl-[15px] pl-[10px] py-[5px] lg:py-[8px] text-white bg-transparent border border-white rounded-full outline-0" type="text" placeholder="Enter your Email" />
                            <button className="lg:text-[16px] text-[11.5px] bg-white text-[#3A3A3A] rounded-full py-[10] px-[30px]">Subscribe</button>
                        </div>

                    </div>
                    <div className="flex flex-col gap-4">
                        <h1 className="font-[500] lg:text-[25px] text-[17.5px]">Follow Us</h1>
                        <div className="flex gap-3 font-[200]">
                            <a href=""><Instagram size={27} strokeWidth={1.5} /></a>
                            <a href=""><Facebook size={27} strokeWidth={1.5} /></a>
                            <a href=""><Twitter size={27} strokeWidth={1.5} /></a>
                            <a href=""><Youtube size={27} strokeWidth={1.5} /></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between py-[20px]">
                <p className="lg:text-[16px] text-[11.5px]">
                    © 2025 Kasper UI. All rights reserved.
                </p>
                <ul className="flex md:gap-4 gap-1 font-[400] lg:text-[16px] text-[11.5px]">
                    <li><a href="">Terms</a></li>
                    <li><a href="">Privacy</a></li>
                    <li><a href="">Cookies</a></li>
                </ul>
            </div>
        </section>
    )

}

export default Footer;