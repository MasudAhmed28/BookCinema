import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

const CheckoutPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [paymentSuccessfull, setPaymentSuccessfull] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDeafault();
    if (!stripe || !elements) {
      return;
    }
    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });
    if (error) {
      setError(error.message);
    } else {
      const response = await fetch("/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod: paymentMethod.id, amount: 1000 }),
      });

      const paymentResult = await response.json();
      if (paymentResult.error) {
        setError(paymentResult.error);
      } else {
        setPaymentSuccessfull(true);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
      {error && <div>{error}</div>}
      {paymentSuccessfull && <div>Payment Successfull</div>}
    </form>
  );
};
export default CheckoutPage;
