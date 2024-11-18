import { useNavigate, useParams } from 'react-router-dom';
import { API } from '../../../env';
import { useState } from 'react';

const DeleteItem = () => {
    const { id } = useParams(); // Get the item ID from the route params
    const navigate = useNavigate();
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            setSubmitDisabled(true); // Disable button while deleting
            setErrorMessage(''); // Reset any previous error messages
            try {
                const response = await fetch(`${API}/api/v1/article/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Item deleted successfully');
                    navigate('/items'); // Redirect to the items list page after deletion
                    return;
                }

                const errorData = await response.json(); // Get error details if available
                setErrorMessage(errorData.message || 'The item could not be deleted. Please try again.');
            } catch (error) {
                console.log(error);
                setErrorMessage('Error deleting the item. Please check your network connection.');
            }
            setSubmitDisabled(false); // Re-enable button if delete fails
        }
    };

    return (
        <div className="delete-item-container">
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button 
                className="btn btn-delete" 
                onClick={handleDelete} 
                disabled={submitDisabled}
            >
                Delete Item
            </button>
        </div>
    );
};

export default DeleteItem;
