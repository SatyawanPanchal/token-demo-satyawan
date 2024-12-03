import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [protectedMessage, setProtectedMessage] = useState('');
    const admin="satyawan";
    const handleRegister = async () => {
        try {
       
            const response = await axios.post('http://localhost:5000/api/register', { username,admin, password });
            alert(response.data.message);
        } catch (error) {
            alert(error.response?.data?.error || "Error during registration");
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/login', { username,admin, password });
            setToken(response.data.token);
            alert("Login successful!");
        } catch (error) {
            alert(error.response?.data?.error || "Error during login");
        }
    };

    const accessProtectedRoute = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/protected', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('response we got ',response.data.user.admin);
            
            setProtectedMessage(response.data.message);
        } catch (error) {
            alert(error.response?.data?.error || "Unauthorized!");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>JWT Authentication Example</h1>

            <div>
                <h2>Register</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleRegister}>Register</button>
            </div>

            <div>
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
            </div>

            <div>
                <h2>Access Protected Route</h2>
                <button onClick={accessProtectedRoute}>Get Protected Data</button>
                <p>{protectedMessage}</p>
            </div>
        </div>
    );
};

export default App;
