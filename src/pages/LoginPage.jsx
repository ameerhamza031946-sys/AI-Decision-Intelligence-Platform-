import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { googleProvider } from '../services/firebase';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Logged in');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      toast.success('Logged in with Google');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Google login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-950">
      <div className="w-full max-w-md space-y-6 bg-surface-900 p-8 rounded-xl shadow-glow-primary animate-fade-in">
        <h2 className="text-center text-2xl font-bold text-slate-100">Log In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md bg-surface-800 px-3 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md bg-surface-800 px-3 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
          <button
            type="submit"
            className="w-full rounded-md bg-primary-600 hover:bg-primary-500 py-2 font-medium text-white transition-colors"
          >
            Sign In
          </button>
        </form>
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-2 rounded-md bg-surface-800 hover:bg-surface-700 py-2 text-slate-200"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.2v2.8h5.3c-.2 1.4-1.1 2.6-2.4 3.4v2.8h3.9c2.3-2.1 3.6-5.2 3.6-9z"/></svg>
          Sign in with Google
        </button>
        <p className="text-center text-sm text-slate-400">
          Don't have an account? <Link to="/register" className="text-primary-400 underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
