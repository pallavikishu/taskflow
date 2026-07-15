import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <span className="navbar-brand">TaskFlow</span>
      <div className="navbar-right">
        <span className="navbar-user">Hi, {user?.username}</span>
        <button className="btn-ghost" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </nav>
  );
}
