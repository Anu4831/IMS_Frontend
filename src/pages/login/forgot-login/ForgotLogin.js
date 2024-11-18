import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import avatar from '../../../assets/user.jpg';
import '../login.css';
import LoginLayout from '../Layout';

const ForgotLogin = () => {

    useEffect(() => {
        // Management of the focus on the inputs
        const inputs = document.querySelectorAll('.input');
        
        function addFocus() {
            let parent = this.parentNode.parentNode;
            parent.classList.add('focus');
        }

        function removeFocus() {
            let parent = this.parentNode.parentNode;
            if (this.value === '') {
                parent.classList.remove('focus');
            }
        }

        inputs.forEach((input) => {
            input.addEventListener('focus', addFocus);
            input.addEventListener('blur', removeFocus);
        });
        
        return () => {
            // Remove event listeners
            inputs.forEach((input) => {
                input.removeEventListener('focus', addFocus);
                input.removeEventListener('blur', removeFocus);
            });
        };
    }, []);
    
    // Manage system login
    //const [username, setUsername] = useState('');
    //const [password, setPassword] = useState('');
    const navigate = useNavigate();
    function handleFormSubmit(event) {
        event.preventDefault();
        const code = '1234';

        // Check user

        // Delete history in localStorage
        //window.localStorage.clear();

        // Send code
        localStorage.setItem('code', code);

        // Navigate to checkCode view
        navigate('/access-validation');
    }

    return (
        <LoginLayout>
            <div className="login-content">
                <form onSubmit={handleFormSubmit}>
                    <img src={avatar} alt="login-avatar" />
                    <h2 className="title">Find your user</h2>
                    <p>Enter the email, phone number, or username associated with your account to change your password.</p>
                    <div className="input-div one">
                        <div className="icon">
                            <FontAwesomeIcon icon={faUser} className="i" />
                        </div>
                        <div className="div">
                            <h5>Email, phone, or username</h5>
                            <input type="text" className="input" required />
                        </div>
                    </div>
                    <button type="submit" className="btn">
                        Next
                    </button>
                </form>
            </div>
        </LoginLayout>
    );
}

export default ForgotLogin;