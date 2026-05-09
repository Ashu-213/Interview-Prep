import '../authForm.scss';
import { useNavigate, Link, useLocation, Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import LoadingOverlay from '../components/LoadingOverlay';
import { useState } from 'react';

const Login = () => {
    const { loading, user, handleLogin } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const destination = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await handleLogin(email, password);
        if (result.success) {
            navigate(destination, { replace: true });
        } else {
            setError(result.error);
        }
    };

    if (loading) {
        return <LoadingOverlay message="Signing you in..." submessage="Please wait while we verify your credentials" />;
    }

    if (user) {
        return <Navigate to={destination} replace />;
    }

    return (
        <main className="auth-page">
            <div className="form-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
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
                    <button className="btn primary-btn" type="submit">Login</button>
                </form>
                <p className="navigate-register">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            </div>
        </main>
    );
};

export default Login;
