import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashCan, faPen } from '@fortawesome/free-solid-svg-icons';
import './items.css';
import '../../styles/addbox.css';
import SearchBox from '../../components/search-box/SearchBox';
import Pagination from '../../components/pagination/Pagination';
import { Link, useNavigate } from 'react-router-dom';
import userVerification from '../../utils/userVerification';
import { API } from '../../env';
import Loading from '../../components/loading/Loading';

const Items = () => {
    localStorage.setItem('selectedView', 'items');
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const [isLoading, setIsLoading] = useState(true);
    const [paginator, setPaginator] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (!userVerification().isAuthenticated) {
            localStorage.clear();
            navigate('/login');
            return;
        }

        const params = new URLSearchParams({
            page,
            pageSize,
            ...(query && { searchCriteria: query }),
        });

        const url = `${API}/article?${params.toString()}`;

        (async () => {
            try {
                setIsLoading(true);
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setPaginator(data);
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [navigate, query, page]);

    const handleSearch = (query) => {
        setQuery(query);
        setPage(1); // Reset to first page on search
    };

    const handlePage = (newPage) => {
        setPage(newPage);
    };




    // const handleDelete = async (id) => {
    //     if (window.confirm('Are you sure you want to delete this items')) {
    //         try {
    //             const response = await fetch(`${API}/api/v1/article/${id}`, {
    //                 method: 'DELETE',
    //             });

    //             if (response.ok) {
    //                 alert('item deleted successfully');
    //                 // Refresh the data
    //                 setPaginator(prevPaginator => ({
    //                     ...prevPaginator,
    //                     items: prevPaginator.items.filter(items=> items.id !== id),
    //                 }));
    //             } else {
    //                 alert('Failed to delete the item');
    //             }
    //         } catch (error) {
    //             console.log(error);
    //             alert('Error deleting the item');
    //         }
    //     }
    // }







    return (
        <div className="items-container">
            <div className="text">ITEMS</div>
            <div className="options">
                <SearchBox onSearch={handleSearch} disabled={isLoading} />
                <Link to="/new-item" className="add-box">
                    <FontAwesomeIcon icon={faPlus} className="icon" />
                    <span className="text">New ITEMS</span>
                </Link>
            </div>

            {!isLoading ? (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr style={{ fontWeight: 'bold', color: 'black' }}>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>BRAND</th>
                                <th>CATEGORY</th>
                                <th>STOCK</th>
                                <th>PURCHASE PRICE</th>
                                <th>SALE PRICE</th>
                                <th>WEIGHT</th>
                                <th>PROVIDER</th>
                                <th>EDIT</th>
                                {/* <th>DELETE</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {paginator.articles && paginator.articles.length > 0 ? (
                                paginator.articles.map(article => (
                                    <tr key={article.articleId}>
                                        <td>{article.articleId}</td>
                                        <td>{article.name}</td>
                                        <td>{article.brand}</td>
                                        <td>{article.category?.name || 'N/A'}</td>
                                        <td>{article.stock}</td>
                                        <td>{article.purchasePrice?.toLocaleString('en-NP', { style: 'currency', currency: 'NPR' }) || 'N/A'}</td>
                                        <td>{article.salePrice?.toLocaleString('en-NP', { style: 'currency', currency: 'NPR' }) || 'N/A'}</td>
                                        <td>{article.weight}</td>
                                        <td>{article.provider?.name || 'N/A'}</td>
                                        <td>
                                            <Link to={`/edit-item/${article.articleId}`}>
                                                <FontAwesomeIcon icon={faPen} className="pen-icon" />
                                            </Link>
                                        </td>
                                        {/* <td>
                                            <Link to={`/delete-item/${article.articleId}`}>
                                                <FontAwesomeIcon icon={faTrashCan} className="trash-icon" />
                                            </Link>
                                        </td> */}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11">No results</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Pagination paginator={paginator} onChangePage={handlePage} />
                </div>
            ) : (
                <Loading />
            )}
        </div>
    );
}

export default Items;
