import React, { useState } from 'react';

const PaymentComponent = ({ totalAmount, onPaymentSuccess }) => {
  const [transactionId, setTransactionId] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  // Function to initiate payment
  const initiatePayment = async () => {
    try {
      const response = await fetch('http://localhost:8080/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount, // Pass the total amount dynamically
          currency: 'USD', // or your currency
          customerId: 1, // Add the customer ID (can be fetched from context or props)
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setPaymentUrl(data);
        window.open(data, '_blank'); // Open payment URL in a new tab
      } else {
        alert('Error initiating payment');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
    }
  };

  // Function to verify payment
  const verifyPayment = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/payments/verify?transactionId=${transactionId}&amount=${totalAmount}`
      );

      if (response.ok) {
        const isPaymentSuccessful = await response.json();
        if (isPaymentSuccessful) {
          setPaymentStatus('Payment Successful!');
          onPaymentSuccess(); // Trigger success callback if needed
        } else {
          setPaymentStatus('Payment Failed!');
        }
      } else {
        alert('Error verifying payment');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };

  return (
    <div>
      <h2>Payment</h2>
      <p>Total Amount: {totalAmount}</p>
      <button onClick={initiatePayment}>Pay Now</button>
      
      {/* Transaction ID Input for Payment Verification */}
      {paymentUrl && (
        <div>
          <label>
            Enter Transaction ID:
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
          </label>
          <button onClick={verifyPayment}>Verify Payment</button>
        </div>
      )}

      {/* Display Payment Status */}
      {paymentStatus && <p>{paymentStatus}</p>}
    </div>
  );
};

export default PaymentComponent;
