import React, { useState } from "react";
import { ChevronDown, Calendar, Star } from "lucide-react";

const Label = ({ children }) => (
  <label className="text-[13px] font-medium text-gray-700">{children}</label>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 ${className}`}
    {...props}
  />
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 ${className}`}
    rows={3}
    {...props}
  />
);

const Select = ({ options, value, onChange, placeholder }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className="w-full h-9 appearance-none rounded-md border border-gray-300 bg-white px-3 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
  </div>
);

const DateInput = ({ value, onChange }) => (
  <div className="relative">
    <Input type="text" value={value} onChange={onChange} />
    <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
  </div>
);

const StarRating = ({ value }) => (
  <div className="flex gap-0.5 text-amber-400">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < value ? "fill-amber-400" : "fill-gray-200 text-gray-300"}`}
      />
    ))}
  </div>
);

function SupportFeedbackForm() {
  const [form, setForm] = useState({
    ticketsRaised: "04",
    lastTicketDate: "12 July 2025",
    ticketStatus: "In progress",
    priority: "Medium",
    category: "Shipping Delay",
    agent: "Priya Verma",
    responseTime: "03 hours",
    resolutionTime: "01 day",
    feedbackScore: 4,
    reviews: "06",
    rating: 4,
    mostReviewed: "Adiyogi Shiva",
    lastReview: "09 July 2025",
    publicComment:
      "Absolutely loved the detailing in the Adiyogi piece! The craftsmanship is exceptional, and it looks even better in person.",
    notes: "Customer prefers early morning delivery. Offered coupon.",
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
        <div className="p-4 lg:p-6">
          

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Support Tickets Raised</Label>
              <Input
                value={form.ticketsRaised}
                onChange={(e) => update("ticketsRaised", e.target.value)}
              />
            </div>
            <div>
              <Label>Last Ticket Date</Label>
              <DateInput
                value={form.lastTicketDate}
                onChange={(e) => update("lastTicketDate", e.target.value)}
              />
            </div>
            <div>
              <Label>Ticket Status</Label>
              <Select
                value={form.ticketStatus}
                onChange={(e) => update("ticketStatus", e.target.value)}
                options={["In progress", "Pending", "Resolved"]}
              />
            </div>

            <div>
              <Label>Ticket Priority</Label>
              <Select
                value={form.priority}
                onChange={(e) => update("priority", e.target.value)}
                options={["Low", "Medium", "High"]}
              />
            </div>
            <div>
              <Label>Ticket Category</Label>
              <Select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                options={["Shipping Delay", "Payment Issue", "Product Issue"]}
              />
            </div>
            <div>
              <Label>Assigned Agent</Label>
              <Input
                value={form.agent}
                onChange={(e) => update("agent", e.target.value)}
              />
            </div>

            <div>
              <Label>Avg. Response Time</Label>
              <Select
                value={form.responseTime}
                onChange={(e) => update("responseTime", e.target.value)}
                options={["01 hour", "03 hours", "06 hours"]}
              />
            </div>
            <div>
              <Label>Avg. Resolution Time</Label>
              <Input
                value={form.resolutionTime}
                onChange={(e) => update("resolutionTime", e.target.value)}
              />
            </div>
            <div>
              <Label>Feedback Score</Label>
              <div className="flex items-center gap-2">
                <StarRating value={form.feedbackScore} />
                <Input
                  value={form.feedbackScore}
                  onChange={(e) => update("feedbackScore", e.target.value)}
                  className="w-16"
                />
              </div>
            </div>

            <div>
              <Label>Reviews Submitted</Label>
              <Input
                value={form.reviews}
                onChange={(e) => update("reviews", e.target.value)}
              />
            </div>
            <div>
              <Label>Average Rating</Label>
              <div className="flex items-center gap-2">
                <StarRating value={form.rating} />
                <Input
                  value={form.rating}
                  onChange={(e) => update("rating", e.target.value)}
                  className="w-16"
                />
              </div>
            </div>
            <div>
              <Label>Latest Review Date</Label>
              <DateInput
                value={form.lastReview}
                onChange={(e) => update("lastReview", e.target.value)}
              />
            </div>

            <div>
              <Label>Most Reviewed Product</Label>
              <Input
                value={form.mostReviewed}
                onChange={(e) => update("mostReviewed", e.target.value)}
              />
            </div>
          </div>

          <hr className="my-5 border-gray-200" />

          <div>
            <Label>Public Comments</Label>
            <Textarea
              value={form.publicComment}
              onChange={(e) => update("publicComment", e.target.value)}
            />
          </div>

          <div className="mt-4">
            <Label>Internal Notes (Admin Only)</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
            />
          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-end gap-2">
            <button className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-3 py-1.5 text-sm text-white hover:bg-amber-600">
              Save
            </button>
            <button className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">
              Reset Form
            </button>
          </div>
        </div>
  );
}

export default SupportFeedbackForm;
