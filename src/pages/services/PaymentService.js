// src/services/PaymentService.js
const API_URL = process.env.REACT_APP_API_URL; // Ensure you have this in your .env file

export const initiatePayment = async (amount, purchaseId) => {
    const response = await fetch(`${API_URL}/payment/initiate`, { // Ensure the endpoint matches your backend
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, purchaseId }),
    });

    if (!response.ok) {
        throw new Error("Failed to initiate payment");
    }

    return response.json(); // Assumes that the response contains the required data
};
