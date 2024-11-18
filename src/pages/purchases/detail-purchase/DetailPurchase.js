import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import userVerification from '../../../utils/userVerification';
import { API } from '../../../env';
import Loading from '../../../components/loading/Loading';
import CryptoJS from 'crypto-js';
import './detail-purchase.css';

const DetailPurchase = () => {
    localStorage.setItem('selectedView', 'purchases');
    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [purchase, setPurchase] = useState(null);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        // Permission validation
        if (!userVerification().isAuthenticated) {
            localStorage.clear();
            navigate('/login');
            return;
        }

        // Get purchase by id
        (async () => {
            try {
                const response = await fetch(`${API}/purchase/${id}`);
                if (!response.ok) {
                    navigate('/purchases');
                    return;
                }
                const data = await response.json();
                setPurchase(data);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                navigate('/purchases');
                return;
            }
        })();
    }, [navigate, id]);

    const handlePayment = async () => {
        const totalAmount = purchase.totalValue; // Use the total value of the purchase
        const transactionUuid = `${id}_${new Date().getTime()}`; // Generate a unique transaction UUID
        const productCode = "EPAYTEST"; // Define your product code

        const dataString = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
        const hmac = CryptoJS.HmacSHA256(dataString, "8gBm/:&EnhH.1/q");
        const signature = CryptoJS.enc.Base64.stringify(hmac);

        const formData = {
            amount: totalAmount.toString(),
            product_delivery_charge: "0",
            product_service_charge: "0",
            tax_amount: "0",
            product_code: productCode,
            signature,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            success_url: `${window.location.origin}/payment/success`, // Define success URL
            failure_url: `${window.location.origin}/payment/failure`, // Define failure URL
            total_amount: totalAmount.toString(),
            transaction_uuid: transactionUuid,
            url: "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
        };

        // Create and submit the form for payment
        const form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", formData.url);

        for (const key in formData) {
            const value = formData[key];
            if (key === "url") continue;
            const hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", value);
            form.appendChild(hiddenField);
        }

        document.body.appendChild(form);
        form.submit();
    };

    return (
        <div className="detailPurchase-container">
            <div className="text">Purchase details{" #" + id}</div>

            {!isLoading ? (
                <>
                    <div className="top-purchase">
                        <h2>Providers</h2>
                        <p>{purchase ? purchase.provider.name : ""}<br />{purchase ? purchase.provider.email : ""}</p>
                        <h2>Username</h2>
                        <p>{purchase ? purchase.user.name : ""}<br />{purchase ? "@" + purchase.user.username : ""}</p>
                        <h2>Sale</h2>
                    </div>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th style={{ color: 'black' }}>ID</th>
                                    <th style={{ color: 'black' }}>NAME</th>
                                    <th style={{ color: 'black' }}>BRAND</th>
                                    <th style={{ color: 'black' }}>QUANTITY</th>
                                    <th style={{ color: 'black' }}>PRICE</th>
                                    <th style={{ color: 'black' }}>SUBTOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchase && purchase.purchaseArticles.map(articleData => (
                                    <tr key={articleData.article.articleId}>
                                        <td style={{ color: 'black' }}>{articleData.article.articleId}</td>
                                        <td style={{ color: 'black' }}>{articleData.article.name}</td>
                                        <td style={{ color: 'black' }}>{articleData.article.brand}</td>
                                        <td style={{ color: 'black' }}>{articleData.articleQuantity}</td>
                                        <td style={{ color: 'black' }}>{(articleData.price / articleData.articleQuantity).toLocaleString('es-NP', { style: 'currency', currency: 'NPR' })}</td>
                                        <td style={{ color: 'black' }}>{articleData.price.toLocaleString('es-NP', { style: 'currency', currency: 'NPR' })}</td>
                                    </tr>
                                ))}
                                {purchase && (
                                    <>
                                        <tr>
                                            <td colSpan="4"></td>
                                            <td className="total" style={{ color: 'black' }}>TOTAL</td>
                                            <td className="total" style={{ color: 'black' }}>
                                                <button onClick={() => setShowPaymentPopup(true)} className="esewa-button">Pay with eSewa</button>
                                                {purchase.totalValue.toLocaleString('es-NP', { style: 'currency', currency: 'NPR' })}
                                            </td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {showPaymentPopup && (
                        <div className="payment-popup">
                            <div className="popup-content">
                                <p>Do you want to make the payment?</p>
                                <button onClick={handlePayment}>Yes</button>
                                <button onClick={() => setShowPaymentPopup(false)}>No</button>
                            </div>
                        </div>
                    )}

                    {paymentSuccess && <div className="payment-success">Payment successful!</div>}
                </>
            ) : (
                <Loading />
            )}
        </div>
    );
};

export default DetailPurchase;
