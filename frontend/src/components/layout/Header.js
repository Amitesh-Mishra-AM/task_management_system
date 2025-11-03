import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/">TaskManager</Link>
        </div>
        <nav className="nav">
          {user ? (
            <>
              <span>Welcome, {user.username}</span>
              <Link to="/">Tasks</Link>
              <Link to="/tasks/new">Create Task</Link>
              <button onClick={handleLogout} className="btn btn-link">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;