import React, { useState } from "react";

const servicesData = [
  { id: 1, title: "Recommendation Letter", icon: "Letter" },
  { id: 2, title: "Transcript Request", icon: "Transcript" },
  { id: 3, title: "Enrollment Verification", icon: "Enrollment" },
  { id: 4, title: "Academic Advising", icon: "Academic" },
  { id: 5, title: "Financial Aid", icon: "Financial" },
  { id: 6, title: "Course Registration", icon: "Course" },
  { id: 7, title: "Library Services", icon: "Library" },
  { id: 8, title: "IT Support", icon: "IT" },
  { id: 9, title: "Career Counseling", icon: "Career" },
  { id: 10, title: "Housing Services", icon: "Housing" },
  { id: 11, title: "Health Services", icon: "Health" },
  { id: 12, title: "Student Activities", icon: "Activities" },
];

// Custom SVG Icons with academic theme
const SvgIcons = {
  Letter: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Transcript: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Enrollment: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Academic: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
  ),
  Financial: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Course: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  Library: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
    </svg>
  ),
  IT: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Career: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 002 2h2a2 2 0 002-2V6m0 0v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6" />
    </svg>
  ),
  Housing: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Health: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  Activities: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 01118 0z" />
    </svg>
  ),
};

// Custom decorative elements
const UniversityLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect x="8" y="12" width="24" height="16" rx="2" stroke="#3D3270" strokeWidth="2"/>
    <path d="M16 20L20 16L24 20" stroke="#3D3270" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 16V28" stroke="#3D3270" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 28H28" stroke="#3D3270" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const Dashboard = () => {
  const [activeService, setActiveService] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-[#f7f7ff] p-4 font-sans">
      {/* Header with custom shape */}
      <header className="mb-8 relative">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#3D3270] opacity-5 rounded-full"></div>
        <div className="absolute -top-2 -right-2 w-16 h-16 bg-[#3D3270] opacity-5 rounded-full"></div>
        
        <div className="flex items-center justify-center mb-2">
          <div className="mr-3 bg-white p-2 rounded-xl shadow-sm">
            <UniversityLogo />
          </div>
          <h1 className="text-3xl font-light text-[#3D3270]">University Portal</h1>
        </div>
        <p className="text-center text-gray-500 relative z-10">Access all services in one place</p>
        
        <div className="absolute -bottom-4 left-1/4 w-12 h-12 bg-[#3D3270] opacity-5 rounded-full"></div>
      </header>

      {/* Stats Cards with unique layout */}
      <div className="grid grid-cols-12 gap-4 mb-10 relative">
        <div className="col-span-8 bg-white p-4 rounded-xl shadow-sm border-l-4 border-[#3D3270] transition-all duration-300 hover:shadow-md">
          <p className="text-sm text-gray-500">Pending Requests</p>
          <p className="text-2xl font-light text-gray-800">3</p>
        </div>
        <div className="col-span-4 bg-white p-4 rounded-xl shadow-sm border-l-4 border-[#3D3270] transition-all duration-300 hover:shadow-md flex flex-col justify-center">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-light text-gray-800">12</p>
        </div>
        
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#3D3270] opacity-5 rounded-full z-0"></div>
      </div>

      {/* Services Section with hexagonal pattern background */}
      <section className="mb-8 relative overflow-hidden rounded-2xl bg-white shadow-sm p-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#f0f0ff] opacity-30 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#f0f0ff] opacity-30 rounded-full -ml-12 -mb-12"></div>
        
        <h2 className="text-xl font-normal text-gray-700 mb-6 pl-3 relative inline-block">
          <span className="absolute left-0 top-1/2 w-2 h-8 bg-[#3D3270] transform -translate-y-1/2 rounded-full"></span>
          Services & Departments
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 relative z-10">
          {servicesData.map((service) => {
            const IconComponent = SvgIcons[service.icon];
            return (
              <div
                key={service.id}
                className="bg-white p-4 rounded-xl transition-all duration-300 hover:bg-[#f0f0ff] cursor-pointer border border-gray-200 hover:border-[#3D3270]/30 hover:shadow-sm relative group"
                onMouseEnter={() => setActiveService(service.id)}
                onMouseLeave={() => setActiveService(null)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`p-3 rounded-xl transition-all duration-300 mb-3 ${activeService === service.id ? 'bg-[#3D3270] text-white transform -translate-y-1' : 'bg-[#f0f0ff] text-[#3D3270]'}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className={`font-medium text-sm ${activeService === service.id ? 'text-[#3D3270] font-semibold' : 'text-gray-700'}`}>
                    {service.title}
                  </h3>
                </div>
                
                {/* Subtle connecting line animation */}
                <div className={`absolute bottom-0 left-1/2 h-1 bg-[#3D3270] transform -translate-x-1/2 transition-all duration-300 ${activeService === service.id ? 'w-8 opacity-100' : 'w-0 opacity-0'}`}></div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Activity with timeline style */}
      <section className="relative bg-white rounded-2xl shadow-sm p-5 overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-[#f0f0ff] opacity-20 rounded-full -mr-10 -mt-10"></div>
        
        <h2 className="text-xl font-normal text-gray-700 mb-6 pl-3 relative inline-block">
          <span className="absolute left-0 top-1/2 w-2 h-8 bg-[#3D3270] transform -translate-y-1/2 rounded-full"></span>
          Recent Activity
        </h2>
        
        <div className="space-y-4 relative">
          {/* Timeline connector */}
          <div className="absolute left-5 top-2 h-full w-0.5 bg-gray-200"></div>
          
          <div className="flex items-start pl-8 transition-all duration-300 hover:bg-[#f0f0ff] p-3 rounded-xl">
            <div className="absolute left-5 mt-2 w-3 h-3 rounded-full bg-amber-500 border-4 border-white"></div>
            <div className="flex-1">
              <p className="font-normal text-gray-800">Transcript Request</p>
              <p className="text-xs text-gray-400">Submitted 2 days ago</p>
            </div>
            <span className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded-full">In Review</span>
          </div>
          
          <div className="flex items-start pl-8 transition-all duration-300 hover:bg-[#f0f0ff] p-3 rounded-xl">
            <div className="absolute left-5 mt-2 w-3 h-3 rounded-full bg-emerald-500 border-4 border-white"></div>
            <div className="flex-1">
              <p className="font-normal text-gray-800">Recommendation Letter</p>
              <p className="text-xs text-gray-400">Submitted 1 week ago</p>
            </div>
            <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full">Approved</span>
          </div>
          
          <div className="flex items-start pl-8 transition-all duration-300 hover:bg-[#f0f0ff] p-3 rounded-xl">
            <div className="absolute left-5 mt-2 w-3 h-3 rounded-full bg-blue-500 border-4 border-white"></div>
            <div className="flex-1">
              <p className="font-normal text-gray-800">Enrollment Verification</p>
              <p className="text-xs text-gray-400">Submitted 5 days ago</p>
            </div>
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">Processing</span>
          </div>
        </div>
      </section>

      {/* Footer with subtle pattern */}
      <footer className="mt-12 text-center relative">
        <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200 transform -translate-y-1/2"></div>
        <p className="text-xs text-gray-400 bg-gradient-to-br from-gray-50 to-[#f7f7ff] inline-block px-4 relative z-10">University Services Portal v2.0</p>
        
        <div className="absolute -left-4 bottom-0 w-16 h-16 bg-[#3D3270] opacity-5 rounded-full"></div>
        <div className="absolute -right-4 bottom-0 w-12 h-12 bg-[#3D3270] opacity-5 rounded-full"></div>
      </footer>
    </div>
  );
};