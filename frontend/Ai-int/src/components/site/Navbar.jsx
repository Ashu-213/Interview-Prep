import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../features/auth/hooks/useAuth';
import './navbar.scss';

const navLinkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

const Navbar = () => {
  const { user, loading, handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await handleLogout();
    navigate('/login');
  };

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