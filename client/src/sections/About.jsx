import about from '../assets/About.png'
import Button from '../components/Button'

function About() {

    return (
        <section className="lg:px-20 md:px-[60px] px-4 py-[23px]">

            <div className="flex flex-col gap-2 items-center w-full">
                <h1 className="text-[60px] font-[500] font-nova">About Us</h1>
                <p className="text-[20px] text-center text-[#413F3F]">At [Your Brand Name], we create beautiful laser cut metal art that brings life to your walls. Our team is passionate about quality, creativity, and making sure you have a smooth and happy shopping experience.</p>
                <p className="text-[20px] text-[#413F3F]">Got a question or idea? We’re always here to help!</p>
            </div>
            <div className="mt-[23px] flex flex-col gap-2 items-center w-full">
                <h1 className="text-[60px] font-[500] font-nova">Why People Love Us</h1>
                <p className="text-[20px] text-center text-[#413F3F]">Our customers love us because we focus on what matters — great designs, top quality, fair prices, and fast delivery. We care about every order and every smile.</p>
                <p className="text-[20px] text-[#413F3F]">That’s why they keep coming back. 💛</p>
            </div>
            <div className='flex justify-evenly items-center py-[40px] mt-[100px] mb-[30px] border rounded-lg'>
                <div className="w-[479px] h-[214px] flex flex-col justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-[40px] text-[#1E1E1E] font-nova font-[600]">Customize Your Art</h1>
                        <p className="text-[#717171]">Upload your idea or request a design consultation.</p>
                    </div>
                    <div>
                        <Button className="py-[8px] px-[20px] text-[20px] border border-black hover:border-transparent rounded-[5px] transition duration-300 ">Start Your custom order</Button>
                    </div>
                </div>
                <div>
                    <img src={about} alt="" />
                </div>
            </div>
        </section>
    )
}

export default About
