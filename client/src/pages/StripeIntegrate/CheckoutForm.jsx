import React from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/payment-success",
      },
    });

    if (error) alert(error.message);
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded-lg">
      <PaymentElement />
      <button
        disabled={!stripe}
        className="bg-black text-white px-4 py-2 mt-4 rounded-lg"
      >
        Pay Now
      </button>
    </form>
  );
};

export default CheckoutForm;
