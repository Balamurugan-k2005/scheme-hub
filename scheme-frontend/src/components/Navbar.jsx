import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import axios from 'axios';
import { Bell, Globe, Sun, Moon, ArrowRight, User, LogOut, Shield, CheckCircle } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, token } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { isDarkMode, toggleTheme, increaseFontSize, decreaseFontSize, resetFontSize } = useAccessibility();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  useEffect(() => {
    if (token && user) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [token, user]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data || []);
    } catch (err) {
      setNotifications([]);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky-top">
      {/* ---------------- Top Government Utility Bar ---------------- */}
      <div className="gov-topbar py-1 px-3 d-none d-md-block">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <span className="fw-semibold">
              🇮🇳 भारत सरकार | Government of India
            </span>
            <span className="text-muted">|</span>
            <span className="text-muted small">National Portal for Scheme Search & Discovery</span>
          </div>

          <div className="d-flex align-items-center gap-3">
            {/* Font Size Accessibility Resizers */}
            <div className="d-flex align-items-center gap-1">
              <span className="small text-muted me-1">Font Size:</span>
              <div className="btn-group btn-group-sm" role="group">
                <button className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={decreaseFontSize} title="Decrease Text Size">A-</button>
                <button className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={resetFontSize} title="Normal Text Size">A</button>
                <button className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={increaseFontSize} title="Increase Text Size">A+</button>
              </div>
            </div>

            {/* Light / Dark Theme Toggle Button */}
            <button 
              className="btn btn-sm py-0 px-2 d-flex align-items-center gap-1 btn-outline-secondary rounded-pill"
              onClick={toggleTheme}
              title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDarkMode ? <Sun size={13} className="text-warning" /> : <Moon size={13} className="text-dark" />}
              <span className="small fw-semibold">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            {/* Language Selector */}
            <div className="d-flex align-items-center gap-1">
              <Globe size={14} className="text-muted" />
              <select 
                className="form-select form-select-sm py-0 border-0 bg-transparent fw-semibold text-secondary" 
                style={{ width: 'auto', cursor: 'pointer' }}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Main myScheme Navigation Bar ---------------- */}
      <nav className="navbar navbar-expand-lg myscheme-navbar px-3 py-2">
        <div className="container-fluid">
          {/* Logo & Emblem Branding */}
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-success text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: '#15803d' }}>
                <Shield size={22} />
              </div>
              <div>
                <div className="brand-title lh-1">
                  my<span>Scheme</span> <small className="fs-6 fw-normal text-muted">Hub</small>
                </div>
                <div className="text-muted" style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.3px' }}>
                  GOVERNMENT SCHEMES DISCOVERY PLATFORM
                </div>
              </div>
            </div>
          </Link>
          
          <div className="d-flex align-items-center gap-2 d-lg-none">
            {/* Mobile Theme Toggle Button */}
            <button 
              className="btn btn-sm btn-outline-secondary p-1 rounded-circle"
              onClick={toggleTheme}
              title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDarkMode ? <Sun size={18} className="text-warning" /> : <Moon size={18} />}
            </button>
            <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
              <li className="nav-item">
                <Link className={`nav-link nav-link-custom ${location.pathname === '/' ? 'active' : ''}`} to="/">
                  {t('navHome')}
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link nav-link-custom ${location.pathname === '/search' ? 'active' : ''}`} to="/search">
                  Explore Schemes
                </Link>
              </li>
              {user && (
                <>
                  <li className="nav-item">
                    <Link className={`nav-link nav-link-custom d-flex align-items-center gap-1 ${location.pathname === '/recommendations' ? 'active' : ''}`} to="/recommendations">
                      <span>{t('navRecommendations')}</span>
                      <span className="badge bg-success rounded-pill px-2" style={{ fontSize: '0.65rem' }}>For You</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link nav-link-custom ${location.pathname === '/applications' ? 'active' : ''}`} to="/applications">
                      {t('navApplications')}
                    </Link>
                  </li>
                </>
              )}
              {user && (user.role === 'ADMIN' || user.role === 'SCHEME_MANAGER') && (
                <li className="nav-item">
                  <Link className={`nav-link nav-link-custom text-danger fw-bold ${location.pathname === '/admin' ? 'active' : ''}`} to="/admin">
                    Admin Portal
                  </Link>
                </li>
              )}
            </ul>

            {/* Right Action Bar */}
            <div className="d-flex align-items-center gap-2">
              {user ? (
                <div className="d-flex align-items-center gap-2">
                  {/* Notifications Dropdown */}
                  <div className="position-relative">
                    <button 
                      className="btn btn-light rounded-circle p-2 position-relative" 
                      onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                      title="Notifications"
                    >
                      <Bell size={18} className="text-secondary" />
                      {unreadCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {showNotifDropdown && (
                      <div className="dropdown-menu show shadow-lg p-0 position-absolute end-0 mt-2 border-0 rounded-3" style={{ width: '320px', zIndex: 1050 }}>
                        <div className="p-3 bg-light border-bottom d-flex justify-content-between align-items-center rounded-top-3">
                          <h6 className="fw-bold mb-0 text-dark">Notifications</h6>
                          <span className="badge bg-success">{unreadCount} New</span>
                        </div>
                        <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                          {notifications.length === 0 ? (
                            <p className="text-muted small p-3 text-center mb-0">No new notifications</p>
                          ) : (
                            notifications.map(n => (
                              <div key={n.id} className={`p-3 border-bottom ${n.isRead ? 'bg-white' : 'bg-success bg-opacity-10'}`}>
                                <div className="d-flex justify-content-between">
                                  <strong className="small text-dark">{n.title}</strong>
                                  {!n.isRead && (
                                    <button className="btn btn-link btn-sm p-0 text-success" onClick={() => markAsRead(n.id)}>
                                      <CheckCircle size={14} />
                                    </button>
                                  )}
                                </div>
                                <p className="small text-muted mb-1 mt-1">{n.message}</p>
                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                                  {new Date(n.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Citizen Profile Button */}
                  <Link to="/profile" className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-2 px-3 py-1 fw-semibold">
                    <User size={15} className="text-success" />
                    <span>{user.name?.split(' ')[0] || 'My Profile'}</span>
                  </Link>

                  {/* Sign Out */}
                  <button className="btn btn-outline-danger btn-sm rounded-pill p-2" onClick={handleLogout} title="Sign Out">
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Link to="/login" className="btn btn-myscheme-primary btn-sm d-flex align-items-center gap-1">
                    <span>{t('signIn')}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
