// import React from "react";
// import { Plus, Star } from "lucide-react";

// const InfoRow = ({ label, value }) => (
//   <div className="flex flex-col gap-0.5">
//     <span className="text-[13px] font-medium text-gray-700">{label}</span>
//     <span className="text-sm text-gray-900">{value}</span>
//   </div>
// );

// const Section = ({ children }) => (
//   <div className="grid grid-cols-2 gap-x-12 gap-y-4 py-4">{children}</div>
// );

// const Divider = () => <hr className="border-gray-200 my-4" />;

// function SupportFeedback() {
//   const data = {
//     ticketsRaised: 4,
//     lastTicketDate: "12 July 2025",
//     status: "In Progress",
//     priority: "Medium",
//     category: "Shipping Delay",
//     agent: "Priya Verma",
//     responseTime: "3 hours",
//     resolutionTime: "1 day",
//     feedbackScore: 4.2,
//     reviews: 6,
//     avgRating: 4.3,
//     lastReview: "09 July 2025",
//     mostReviewed: "Adiyogi Shiva",
//     comment:
//       "Absolutely loved the detailing in the Adiyogi piece! The craftsmanship is exceptional, and it looks even better in person. Will definitely buy again – truly a masterpiece for any wall!",
//     internalNotes:
//       "Customer prefers early morning delivery. Offered coupon.",
//   };

//   return (
//     <div className="col-span-6">
//         <div className="bg-white border rounded-xl shadow-sm p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-sm font-semibold text-gray-900">Support / Feedback</h2>
//             <button className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm bg-amber-500 text-white hover:bg-amber-600">
//               <Plus className="w-4 h-4" /> Add New Ticket
//             </button>
//           </div>

//           <Section>
//             <InfoRow label="Support Tickets Raised:" value={data.ticketsRaised} />
//             <InfoRow label="Last Ticket Date:" value={data.lastTicketDate} />
//             <InfoRow label="Ticket Status:" value={data.status} />
//             <InfoRow label="Ticket Priority:" value={data.priority} />
//             <InfoRow label="Ticket Category:" value={data.category} />
//             <InfoRow label="Assigned Agent:" value={data.agent} />
//             <InfoRow label="Avg. Response Time:" value={data.responseTime} />
//             <InfoRow label="Avg. Resolution Time:" value={data.resolutionTime} />
//             <div>
//               <div className="text-[13px] font-medium text-gray-700 mb-1">Feedback Score:</div>
//               <div className="flex items-center gap-1 text-sm text-gray-900">
//                 <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {data.feedbackScore}
//               </div>
//             </div>
//           </Section>

//           <Divider />

//           <Section>
//             <InfoRow label="Reviews Submitted:" value={data.reviews} />
//             <div>
//               <div className="text-[13px] font-medium text-gray-700 mb-1">Average Rating:</div>
//               <div className="flex items-center gap-1 text-sm text-gray-900">
//                 <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {data.avgRating}
//               </div>
//             </div>
//             <InfoRow label="Latest Review Date:" value={data.lastReview} />
//             <InfoRow label="Most Reviewed Product:" value={data.mostReviewed} />
//           </Section>

//           <Divider />

//           <div className="py-2">
//             <div className="text-[13px] font-medium text-gray-700 mb-1">Public Comments:</div>
//             <p className="text-sm text-gray-800 italic mb-2">“{data.comment}”</p>
//             <div className="flex items-center gap-1 text-sm text-gray-700">
//               <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Verified Buyer
//             </div>
//             <button className="mt-3 inline-flex items-center gap-2 border rounded-md px-3 py-1.5 text-sm hover:bg-gray-50">
//               View All Reviews
//             </button>
//           </div>

//           <Divider />

//           <div className="py-2">
//             <div className="text-[13px] font-medium text-gray-700 mb-1">Internal Notes (Admin Only):</div>
//             <p className="text-sm text-gray-900">{data.internalNotes}</p>
//           </div>
//         </div>
//       </div>
//   );
// }

// export default SupportFeedback;

import React from "react";
import {
  Plus,
  Star,
  MessageSquare,
  Clock,
  AlertTriangle,
  User,
  Tag,
  FileText,
  Eye,
  ThumbsUp,
  Calendar,
  HeadphonesIcon,
} from "lucide-react";
import { Link } from "react-router";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const InfoRow = ({ label, value, icon: Icon, status, className = "" }) => {
  const statusColors = {
    high: "bg-red-100 text-red-800 w-max",
    medium: "bg-amber-100 text-amber-800 w-max",
    low: "bg-blue-100 text-blue-800 w-max",
    completed: "bg-green-100 text-green-800 w-max",
    progress: "bg-blue-100 text-blue-800 w-max",
    open: "bg-gray-100 text-gray-800 w-max",
  };

  return (
    <div
      className={`flex flex-col gap-1 p-3 bg-gray-50 rounded-lg ${className}`}
    >
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        <span>{label}</span>
      </div>
      {status && statusColors[status] ? (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]} mt-1 inline-block`}
        >
          {value}
        </span>
      ) : (
        <div className="text-sm font-medium text-gray-900">{value}</div>
      )}
    </div>
  );
};

const Rating = ({ score, max = 5 }) => (
  <div className="flex items-center gap-1">
    {[...Array(max)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(score)
            ? "text-amber-400 fill-amber-400"
            : "text-gray-300"
        }`}
      />
    ))}
    <span className="text-sm font-medium text-gray-900 ml-1">({score})</span>
  </div>
);

const Section = ({ title, icon: Icon, children }) => (
  <div className="mb-6 last:mb-0">
    <h3 className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide border-b pb-2 mb-4">
      {Icon && <Icon className="w-4 h-4" />}
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

function SupportFeedback() {
  const data = {
    ticketsRaised: 4,
    lastTicketDate: "12 July 2025",
    status: "In Progress",
    priority: "Medium",
    category: "Shipping Delay",
    agent: "Priya Verma",
    responseTime: "3 hours",
    resolutionTime: "1 day",
    feedbackScore: 4.2,
    reviews: 6,
    avgRating: 4.3,
    lastReview: "09 July 2025",
    mostReviewed: "Adiyogi Shiva",
    comment:
      "Absolutely loved the detailing in the Adiyogi piece! The craftsmanship is exceptional, and it looks even better in person. Will definitely buy again – truly a masterpiece for any wall!",
    internalNotes: "Customer prefers early morning delivery. Offered coupon.",
  };

  const getPriorityStatus = (priority) => {
    const statusMap = {
      high: "high",
      medium: "medium",
      low: "low",
    };
    return statusMap[priority.toLowerCase()] || "low";
  };

  const getTicketStatus = (status) => {
    const statusMap = {
      "in progress": "progress",
      completed: "completed",
      open: "open",
    };
    return statusMap[status.toLowerCase()] || "open";
  };

  return (
    <div className="col-span-7">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <HeadphonesIcon className="w-5 h-5" />
            Support & Feedback
          </h2>
          <button className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm bg-amber-500 text-white hover:bg-amber-600 transition-colors font-medium">
            <Plus className="w-4 h-4" /> New Ticket
          </button>
        </div>

        {/* Support Tickets Section */}
        <Section title="Support Tickets" icon={MessageSquare}>
          <InfoRow
            label="Tickets Raised"
            value={data.ticketsRaised}
            icon={FileText}
          />
          <InfoRow
            label="Last Ticket Date"
            value={data.lastTicketDate}
            icon={Calendar}
          />
          <InfoRow
            label="Ticket Status"
            value={data.status}
            icon={Clock}
            status={getTicketStatus(data.status)}
          />
          <InfoRow
            label="Ticket Priority"
            value={data.priority}
            icon={AlertTriangle}
            status={getPriorityStatus(data.priority)}
          />
          <InfoRow label="Ticket Category" value={data.category} icon={Tag} />
          <InfoRow label="Assigned Agent" value={data.agent} icon={User} />
          <InfoRow
            label="Avg. Response Time"
            value={data.responseTime}
            icon={Clock}
          />
          <InfoRow
            label="Avg. Resolution Time"
            value={data.resolutionTime}
            icon={Clock}
          />
        </Section>

        {/* Feedback & Reviews Section */}
        <Section title="Customer Feedback" icon={ThumbsUp}>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              <Star className="w-3.5 h-3.5" />
              <span>Feedback Score</span>
            </div>
            <Rating score={data.feedbackScore} />
          </div>
          <InfoRow
            label="Reviews Submitted"
            value={data.reviews}
            icon={FileText}
          />
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              <Star className="w-3.5 h-3.5" />
              <span>Average Rating</span>
            </div>
            <Rating score={data.avgRating} />
          </div>
          <InfoRow
            label="Latest Review Date"
            value={data.lastReview}
            icon={Calendar}
          />
          <InfoRow
            label="Most Reviewed Product"
            value={data.mostReviewed}
            icon={Tag}
          />
        </Section>

        {/* Customer Comment Section */}
        <div className="mb-6">
          <h3 className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide border-b pb-2 mb-4">
            <MessageSquare className="w-4 h-4" />
            Recent Customer Comment
          </h3>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Rating score={5} />
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    Verified Buyer
                  </span>
                </div>
                <p className="text-sm text-gray-800 italic">"{data.comment}"</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">
                    {data.lastReview}
                  </span>
                  <button className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
                    <Eye className="w-3 h-3" /> View All Reviews
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Internal Notes Section */}
        <div className="mb-6">
          <h3 className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide border-b pb-2 mb-4">
            <FileText className="w-4 h-4" />
            Internal Notes (Admin Only)
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-900">{data.internalNotes}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-500">
                Last updated: {data.lastTicketDate}
              </span>
              <button className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800 font-medium">
                <Plus className="w-3 h-3" /> Add Note
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {/* <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button className="flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
              <MessageSquare className="w-4 h-4" />
              Contact Customer
            </button>
            <button className="flex items-center justify-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors">
              <ThumbsUp className="w-4 h-4" />
              Request Feedback
            </button>
            <button className="flex items-center justify-center gap-2 p-3 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              <FileText className="w-4 h-4" />
              View Ticket History
            </button>
          </div>
        </div> */}
      </Card>
      <div className="flex items-center gap-2 justify-end mt-6">
        <Link to={"/admin/support-form"} className="inline-flex items-center gap-2 border rounded-md px-3 py-1.5 text-sm hover:bg-gray-50">
          Edit
        </Link>
        <button className="inline-flex items-center gap-2 border rounded-md px-3 py-1.5 text-sm hover:bg-gray-50">
          Cancel
        </button>
        <button className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm bg-amber-500 text-white hover:bg-amber-600">
          Delete
        </button>
      </div>
    </div>
  );
}

export default SupportFeedback;
