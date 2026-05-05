import React from 'react'
import '../authForm.scss'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

const Register = () => {

    // get auth context
    const { Loading, handleRegister } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // navigate to home page
    const navigate = useNavigate();

    //handle reload
    const handleReload = async (e) => {
        e.preventDefault();
        await handleRegister(username, email, password);
        navigate("/");
    }
    if (Loading) {
        return (<main><h1>Loading...</h1></main>);
    }


    return (
        <main>
            <div className="form-container">
                <h1>Sign Up</h1>

                <form onSubmit={handleReload}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input 
                            onChange={(e) => setUsername(e.target.value)}
                            type="text" id="username" name='Username' placeholder='Enter your Username' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" id="email" name='Email' placeholder='Enter your Email' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            onChange={(e) => setPassword(e.target.value)}
                            type="password" id="password" name='Password' placeholder='Enter your Password' />
                    </div>

                    <button className='btn primary-btn' type='submit'>Sign Up</button>

                </form>

                {/* navigate to login */}
                <p className='navigate-login'>
                    Already have an account? <Link to="/login">Login</Link>
                </p>

            </div>
        </main>
    )
}

export default Register