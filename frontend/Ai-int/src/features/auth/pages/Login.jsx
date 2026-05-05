import '../authForm.scss'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';


const Login = () => {
    // get auth context
    const { Loading, handleLogin } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // navigate to register page
    const navigate = useNavigate();

    // handle reload
    const handleReload = async(e) => {
        e.preventDefault();
        await handleLogin(email, password);
        navigate("/");
       
    }
    if (Loading) {
        return (<main><h1>Loading...</h1></main>);
    }


    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>
                
                <form onSubmit={handleReload}>
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
                    <button className='btn primary-btn' type='submit'>Login</button>

                </form>

                {/* navigate to register */}
                <p className='navigate-register'>
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            </div>

        </main>
    )
}

export default Login