import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe("pk_test_XXXXXXXXXXXXXX"); // your PK key

const StripeContainer = ({ clientSecret }) => {
  if (!clientSecret) return null;

  const appearance = { theme: "stripe" };

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
      <CheckoutForm />
    </Elements>
  );
};

export default StripeContainer;
