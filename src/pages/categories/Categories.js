import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import './categories.css';
import '../../styles/addbox.css';
import SearchBox from '../../components/search-box/SearchBox';
import Pagination from '../../components/pagination/Pagination';
import { Link, useNavigate } from 'react-router-dom';
import userVerification from '../../utils/userVerification';
import { API } from '../../env';
import Loading from '../../components/loading/Loading';

const Categories = () => {
    localStorage.setItem('selectedView', 'categories');
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const [isLoading, setIsLoading] = useState(true);
    const [paginator, setPaginator] = useState({});

    const navigate = useNavigate();

    // Only seen by the user who is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;  // Get the logged-in user's ID

    useEffect(() => {
        // Permission validation
        if (!userVerification().isAuthenticated) {
            localStorage.clear();
            navigate('/login');
            return;
        }

        // Query paginated data
        const data = new FormData();
        if (query.length > 0) {
            data.append('searchCriteria', query);
        }
        data.append('page', page);
        data.append('pageSize', pageSize);
        data.append('userId', userId); 

        const url = new URL(`${API}/category`);
        url.search = new URLSearchParams(data).toString();
        (async () => {
            await fetch(url)
                .then(response => response.json())
                .then(data => {
                    setPaginator(data);
                    setIsLoading(false);
                })
                .catch(error => console.log(error));
        })();
    }, [navigate, query, page]);

    const handleSearch = (query) => {
        setQuery(query);
    }

    const handlePage = (page) => {
        setPage(page);
    }

    //deleting the categories
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                const response = await fetch(`${API}/category/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Category deleted successfully');
                    // Refresh the data
                    setPaginator(prevPaginator => ({
                        ...prevPaginator,
                        categories: prevPaginator.categories.filter(category => category.id !== id),
                    }));
                } else {
                    alert('Failed to delete the category');
                }
            } catch (error) {
                console.log(error);
                alert('Error deleting the category');
            }
        }
    }

    return (
        <div className="categories-container">
            <div className="text">Categories</div>
            <div className="options">
                <SearchBox onSearch={handleSearch} disabled={isLoading} />
                <Link to="/new-category" className="add-box">
                    <FontAwesomeIcon icon={faPlus} className="icon" />
                    <span className="text">New Category</span>
                </Link>
            </div>
            {!isLoading ? (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ fontWeight: 'bold', color: 'black' }}>ID</th>
                                <th style={{ fontWeight: 'bold', color: 'black' }}>NAME</th>
                                <th style={{ fontWeight: 'bold', color: 'black' }}>EDIT</th>
                                <th style={{ fontWeight: 'bold', color: 'black' }}>DELETE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginator.categories && paginator.categories.length > 0 ? (
                                paginator.categories.map(category => (
                                    <tr key={category.categoryId}>
                                        <td>{category.categoryId}</td>
                                        <td>{category.name}</td>
                                        <td>
                                            <Link to={`/edit-category/${category.categoryId}`}>
                                                <FontAwesomeIcon icon={faPen} className="pen-icon" />
                                            </Link>
                                        </td>
                                        <td>
                                            <button onClick={() => handleDelete(category.categoryId)} className="delete-button">
                                                <FontAwesomeIcon icon={faTrashCan} className="trash-icon" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No results found</td>
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

export default Categories;
