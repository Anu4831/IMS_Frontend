import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import userVerification from '../../../utils/userVerification';
import { API } from '../../../env';
import Loading from '../../../components/loading/Loading';
import CryptoJS from 'crypto-js';
import './detail-sale.css';

const DetailSale = () => {
    localStorage.setItem('selectedView', 'sales');
    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [sale, setSale] = useState(null);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);

    useEffect(() => {
        // Permission validation
        if (!userVerification().isAuthenticated) {
            localStorage.clear();
            navigate('/login');
            return;
        }

        // Get sale by id
        (async () => {
            try {
                const response = await fetch(`${API}/sale/${id}`);
                if (!response.ok) {
                    navigate('/sales');
                    return;
                }
                const data = await response.json();
                setSale(data);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                navigate('/sales');
                return;
            }
        })();
    }, [navigate, id]);

    const handlePayment = async () => {
        const totalAmount = sale.totalValue; // Use the total value of the sale
        const transactionUuid = `${id}_${new Date().getTime()}`; // Generate a unique transaction UUID
        const productCode = "EPAYTEST"; // Define your product code

        const dataString = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
        const hmac = CryptoJS.HmacSHA256(dataString, "8gBm/:&EnhH.1/q"); // Replace with your secret key
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
            if (key === "url") continue;
            const hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", formData[key]);
            form.appendChild(hiddenField);
        }

        document.body.appendChild(form);
        form.submit();
    };

    return (
        <div className="detailSale-container">
            <div className="text">Detail of Sales{" #" + id}</div>

            {!isLoading ? (
                <>
                    <div className="top-sale">
                        <h2>Client</h2>
                        <p>{sale ? sale.customer.name : ""}<br/>{sale ? sale.customer.email : ""}</p>
                        <h2>Username</h2>
                        <p>{sale ? sale.user.name : ""}<br/>{sale ? "@" + sale.user.username : ""}</p>
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
                                {sale && sale.saleArticles.map(articleData => (
                                    <tr key={articleData.article.articleId}>
                                        <td style={{ color: 'black' }}>{articleData.article.articleId}</td>
                                        <td style={{ color: 'black' }}>{articleData.article.name}</td>
                                        <td style={{ color: 'black' }}>{articleData.article.brand}</td>
                                        <td style={{ color: 'black' }}>{articleData.articleQuantity}</td>
                                        <td style={{ color: 'black' }}>{(articleData.price / articleData.articleQuantity).toLocaleString('es-NP', { style: 'currency', currency: 'NPR' })}</td>
                                        <td style={{ color: 'black' }}>{articleData.price.toLocaleString('es-NP', { style: 'currency', currency: 'NPR' })}</td>
                                    </tr>
                                ))}
                                {sale &&
                                    <tr>
                                        <td colSpan="4"></td>
                                        <td className="total" style={{ color: 'black' }}>TOTAL</td>
                                        <td className="total" style={{ color: 'black' }}>
                                            {sale.totalValue.toLocaleString('es-NP', { style: 'currency', currency: 'NPR' })}
                                            <button onClick={() => setShowPaymentPopup(true)} className="esewa-button">Pay with eSewa</button>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>

                    {showPaymentPopup && (
                        <div className="payment-popup">
                            <div className="popup-content">
                                <p>Do you want to proceed with the payment?</p>
                                <button onClick={handlePayment}>Yes</button>
                                <button onClick={() => setShowPaymentPopup(false)}>No</button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <Loading />
            )}
        </div>
    );
}

export default DetailSale;
