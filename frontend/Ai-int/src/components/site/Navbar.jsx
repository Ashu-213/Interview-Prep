import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../features/auth/hooks/useAuth';
import LoadingOverlay from '../../features/auth/components/LoadingOverlay';
import { useState } from 'react';
import './navbar.scss';

const navLinkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

const Navbar = () => {
  const { user, loading, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const onLogout = async () => {
    setIsLoggingOut(true);
    // Navigate FIRST to unmount protected routes before clearing user state
    navigate('/', { replace: true });
    // Then clear user state after a micro-task to ensure navigation starts
    await new Promise(resolve => setTimeout(resolve, 0));
    await handleLogout();
    setIsLoggingOut(false);
  };

  if (isLoggingOut) {
    return <LoadingOverlay message="Logging you out..." submessage="Securely closing your session" />;
  }

  return (
    <header className="site-navbar">
      {/* Brand */}
      <div className="nav-brand">
        <Link to="/" className="brand-mark" aria-label="InterviewPrep home">IP</Link>
        <span className="brand-name">InterviewPrep</span>
      </div>

      {/* Primary nav */}
      <nav className="nav-links" aria-label="Primary navigation">
        <NavLink to="/" end className={navLinkClass}>Home</NavLink>
        {user && <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>}
      </nav>

      {/* Auth actions */}
      <div className="nav-actions">
        {loading ? (
          <span className="nav-status">Loading…</span>
        ) : user ? (
          <>
            <span className="nav-user">{user.username}</span>
            <button className="nav-button ghost" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    className="nav-button ghost">Login</Link>
            <Link to="/register" className="nav-button primary">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;