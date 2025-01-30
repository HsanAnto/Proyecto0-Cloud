import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import userIcon from '../../statics/user.png';
import lockIcon from '../../statics/lock.png';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const BACKURL = process.env.REACT_APP_BACKURL;

    const handleLogin = async () => {
        try {
            const response = await fetch(`${BACKURL}/usuarios/iniciar-sesion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.status === 200) {
                const data = await response.json();
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('profile_image', data.profile_image);
                navigate("/calendar");
            } else {
                setError(true);
            }
        } catch (error) {
            setError(true);
            console.error('Error al intentar autenticar:', error);
        }
    };

    const goToSignUp = () => {
        navigate("/register");
    };

    return (
        <div className="login-container">
            <div className="header">
                <h1 className="logo">
                    <span className="white-letter">E</span>
                    <span className="colored-letter">C</span>
                </h1>
                <button className="signup-button" onClick={goToSignUp}>Sign Up</button>
            </div>
            <div className="login-box">
                <div className="input-container">
                    <img src={userIcon} alt="User" className="icon" />
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div className="input-container">
                    <img src={lockIcon} alt="Lock" className="icon" />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                {error && <div className="error-message">Authentication failed. Check your credentials.</div>}
                <button className="login-button" onClick={handleLogin}>Log In</button>
            </div>
        </div>
    );
}

export default Login;
