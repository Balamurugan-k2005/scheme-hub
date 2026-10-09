import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LogIn, UserPlus, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginRegister = () => {
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (isLogin) {
        await login({ username, password });
        navigate('/recommendations');
      } else {
        await register({ username, password, email, role });
        setMessage('Registration successful! Please login with your credentials.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please check your credentials.');
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="card shadow-sm border-0 p-4 p-md-5 bg-white" style={{ width: '460px', borderRadius: '16px' }}>
        <div className="text-center mb-4">
          <div className="bg-success text-white rounded-circle p-2 d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '48px', height: '48px', backgroundColor: '#15803d' }}>
            <Shield size={26} />
          </div>
          <h3 className="fw-bold text-dark mb-1">
            {isLogin ? 'Sign In to myScheme' : 'Citizen Registration'}
          </h3>
          <p className="text-muted small">
            Access personalized scheme matching, dynamic eligibility calculations, and application tracking.
          </p>
        </div>

        {error && <div className="alert alert-danger p-2 small rounded-3">{error}</div>}
        {message && <div className="alert alert-success p-2 small rounded-3">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Username</label>
            <input 
              type="text" 
              className="form-control py-2" 
              placeholder="e.g. citizen_user or your username"
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>

          {!isLogin && (
            <div className="mb-3">
              <label className="form-label small fw-semibold">Email address</label>
              <input 
                type="email" 
                className="form-control py-2" 
                placeholder="citizen@example.gov.in"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label small fw-semibold">Password</label>
            <input 
              type="password" 
              className="form-control py-2" 
              placeholder="••••••••"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>

          {!isLogin && (
            <div className="mb-3">
              <label className="form-label small fw-semibold">Account Role</label>
              <select className="form-select py-2" value={role} onChange={e => setRole(e.target.value)}>
                <option value="USER">Citizen (General User)</option>
                <option value="SCHEME_MANAGER">Scheme Department Manager</option>
                <option value="ADMIN">Portal Administrator</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-myscheme-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 mt-4 shadow-sm">
            {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
          </button>
        </form>

        <div className="text-center mt-4 border-top pt-3">
          <p className="small text-muted mb-0">
            {isLogin ? "Don't have a myScheme account?" : "Already registered?"}{' '}
            <button 
              className="btn btn-link p-0 small fw-bold text-success text-decoration-none" 
              onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }}
            >
              {isLogin ? 'Register New Profile' : 'Sign In Here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
