import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { auth, db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cred = await register(email, password, name, role);
      // Create Firestore profile (already handled in AuthContext, but keep for safety)
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
        notifications: true,
      });
      toast.success('Account created');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-950">
      <div className="w-full max-w-md space-y-6 bg-surface-900 p-8 rounded-xl shadow-glow-primary animate-fade-in">
        <h2 className="text-center text-2xl font-bold text-slate-100">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md bg-surface-800 px-3 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
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
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-md bg-surface-800 px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="citizen">Citizen</option>
            <option value="government">Government Authority</option>
            <option value="ngo">NGO</option>
          </select>
          <button
            type="submit"
            className="w-full rounded-md bg-primary-600 hover:bg-primary-500 py-2 font-medium text-white transition-colors"
          >
            Create Account
          </button>
        </form>
        <p className="text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-primary-400 underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
