import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51OU6UoSJvPaeOTQvAhVwRkhIcCGGZJuxUntzvOryGZpR0abWVc8u40jU9iNYaza9R6Qd8eZAnt4RLv3banucaslf00wS16v6C2');

const SubscriptionForm = () => {
  const [email, setEmail] = useState('');
  const [subscriptionInterval, setSubscriptionInterval] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [msg,setmsg] = useState(null);
  const [stripe, setStripe] = useState(null);
  const [cardElement, setCardElement] = useState(null);

  useEffect(() => {
    // Load Stripe.js and Elements once the component mounts
    const initializeStripe = async () => {
      const stripeInstance = await stripePromise;
      setStripe(stripeInstance);

      // Create an instance of Elements
      const elements = stripeInstance.elements();

      // Create a Card Element
      const card = elements.create('card');

      // Mount the Card Element to the div with id="card-element"
      card.mount('#card-element');

      // Set the Card Element state
      setCardElement(card);
    };

    initializeStripe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create a paymentMethod using the test Card Element
      const { paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
      console.log(paymentMethod.id);

      const response = await axios.post('http://localhost:3000/create-customer', {
        email,
        payment_method_token: paymentMethod.id,
        subscription_interval: subscriptionInterval,
      });

      // Handle successful response, e.g., redirect or display success message
      console.log(response.data);
      setmsg('User successfully Subscribed');
      setTimeout(()=>{
        setmsg(null);
      },2000);
    } catch (error) {
      console.log('Error creating subscription:', error.response?.data || error.message);
      setError('An error occurred while creating the subscription.');
      setTimeout(()=>{
        setError(null);
      },2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ color: '#432818' }}>
      <h2 style={{ color: '#bb9457' }}>Subscription Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <br />
        <label>
          Subscription Interval:
          <select value={subscriptionInterval} onChange={(e) => setSubscriptionInterval(e.target.value)}>
            <option value="monthly">Monthly</option>
            <option value="three-monthly">Three Monthly</option>
            <option value="six-monthly">Six Monthly</option>
          </select>
        </label>
        <br />
        <label>
          Card Details:
          <div id="card-element" />
        </label>
        <br />
        <button type="submit" disabled={loading} style={{ backgroundColor: '#bb9457', color: '#432818' }}>
          Subscribe (Test)
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {msg && <p style={{ color: 'green' }}>{msg}</p>}
    </div>
  );
};

const App = () => {
  return (
    <div>
      <SubscriptionForm />
    </div>
  );
};

export default App;