import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './register.css';
import userIcon from '../../statics/user.png';
import lockIcon from '../../statics/lock.png';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const BACKURL = process.env.REACT_APP_BACKURL;

    const handleRegister = async () => {
        try {
            const response = await fetch(`${BACKURL}/usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username, password: password })
            });

            if (response.status === 201) {
                navigate("/");
            } else {
                setError(true);
            }
        } catch (error) {
            setError(true);
            console.error('Error al intentar autenticar:', error);
        }
    };

    const goToLogIn = () => {
        navigate("/");
    };

    return (
            <div className="signup-container">
                <div className="signup-header">
                    <h1 className="signup-logo">
                        <span className="signup-white-letter">E</span>
                        <span className="signup-colored-letter">C</span>
                    </h1>
                    <button className="login-button2" onClick={goToLogIn}>Log In</button>
                </div>
                <div className="signup-box">
                    <div className="signup-input-container">
                        <img src={userIcon} alt="User" className="signup-icon" />
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="signup-input-container">
                        <img src={lockIcon} alt="Lock" className="signup-icon" />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <div className="signup-error-message">Registration failed.</div>}
                    <button className="signup-button2" onClick={handleRegister}>Sign Up</button>
                </div>
            </div>
        );
}

export default Register;