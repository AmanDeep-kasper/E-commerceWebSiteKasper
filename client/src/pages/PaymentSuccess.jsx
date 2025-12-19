// import React, { useEffect } from "react";
// import { useNavigate } from "react-router";

// const PaymentSuccess = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     setTimeout(() => {
//       navigate("/confirm-order");
//     }, 5000);
//   }, []);

//   return (
//     <div className="p-10 text-center">
//       <h1 className="text-2xl font-semibold">Payment Successful!</h1>
//       <p className="mt-2 text-gray-600">
//         Redirecting to your order confirmation...
//       </p>
//     </div>
//   );
// };

// export default PaymentSuccess;


// import React, { useEffect } from "react";
// import { useNavigate, useLocation } from "react-router";

// function PaymentSuccess() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const query = new URLSearchParams(location.search);
//   const paymentIntent = query.get("payment_intent");
//   const status = query.get("redirect_status");

//   useEffect(() => {
//     setTimeout(() => {
//       navigate("/confirm-order", {
//         state: {
//           paymentIntent,
//           paymentStatus: status,
//         },
//       });
//     }, 5000);
//   }, []);

//   return (
//     <div style={{ padding: "40px", textAlign: "center" }}>
//       <h1>Payment Successful</h1>
//       <p>Redirecting to your order confirmation...</p>
//     </div>
//   );
// }

// export default PaymentSuccess;

// import React, { useEffect } from "react";
// import { useNavigate, useLocation } from "react-router";

// function PaymentSuccess() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const query = new URLSearchParams(location.search);
//   const paymentIntent = query.get("payment_intent");
//   const status = query.get("redirect_status");

//   const orderDetails = JSON.parse(sessionStorage.getItem("orderDetails") || "{}");

//   useEffect(() => {
//     setTimeout(() => {
//       navigate("/confirm-order", {
//         state: {
//           ...orderDetails,
//           paymentIntent,
//           paymentStatus: status,
//         },
//       });
//     }, 5000);
//   }, []);

//   return (
//     <div className="p-10 text-center">
//       <h1 className="text-2xl font-semibold">Payment Successful!</h1>
//       <p>Redirecting to your order confirmation...</p>
//     </div>
//   );
// }

// export default PaymentSuccess;

