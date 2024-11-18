import React, { useEffect, useState } from 'react';
import './home.css'; // Assuming you have some styles
import { useNavigate } from 'react-router-dom';
import userVerification from '../../utils/userVerification';
import { API } from '../../env';
import Loading from '../../components/loading/Loading';

const Home = () => {
    localStorage.setItem('selectedView', 'home');
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [dataSummary, setDataSummary] = useState(null);

    useEffect(() => {
        if (!userVerification().isAuthenticated) {
            localStorage.clear();
            navigate('/login');
            return;
        }

        (async () => {
            try {
                const url = new URL(`${API}/data/summary`);
                const response = await fetch(url);
                const data = await response.json();
                setDataSummary(data);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [navigate]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="home-container">
            <h1>Dashboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Metric</th>
                        <th>Value</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Total Items</td>
                        <td>{dataSummary.articles.totalArticles}</td>
                        <td>{dataSummary.articles.totalArticles > 5 ? 'Sufficient' : 'Low'}</td>
                    </tr>
                    <tr>
                        <td>Items in Stock</td>
                        <td>{dataSummary.articles.totalStock}</td>
                        <td>{dataSummary.articles.totalStock > 5 ? 'Sufficient' : 'Low'}</td>
                    </tr>
                    <tr>
                        <td>Total Sales</td>
                        <td>{dataSummary.sales.totalSales}</td>
                        <td>{dataSummary.sales.totalSales > 5 ? 'High' : 'Low'}</td>
                    </tr>
                    <tr>
                        <td>Total Purchases</td>
                        <td>{dataSummary.purchases.totalPurchases}</td>
                        <td>{dataSummary.purchases.totalPurchases > 20 ? 'High' : 'Low'}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Home;