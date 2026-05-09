import '../authForm.scss';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

const Register = () => {
    const { loading, handleRegister } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await handleRegister(username, email, password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
    };

    if (loading) {
        return <main><h1>Loading...</h1></main>;
    }

    return (
        <main className="auth-page">
            <div className="form-container">
                <h1>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            type="text" id="username" name="Username"
                            placeholder="Enter your Username"
                            value={username}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" id="email" name="Email"
                            placeholder="Enter your Email"
                            value={email}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password" id="password" name="Password"
                            placeholder="Enter your Password"
                            value={password}
                        />
                    </div>
                    {error && <p className="form-error" style={{ color: '#f87171', fontSize: '0.875rem', margin: '0.25rem 0' }}>{error}</p>}
                    <button className="btn primary-btn" type="submit">Sign Up</button>
                </form>
                <p className="navigate-login">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </main>
    );
};

export default Register;
