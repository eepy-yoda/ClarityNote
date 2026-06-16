import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { api } from '../lib/api';

export const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    const redirectTo = window.location.origin;

    try {
      await api.post('/auth/signup', { email, password });
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      const backendError = err.response?.data?.detail || err.message;
      // If backend is unavailable in production, fallback to direct Supabase signup
      try {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectTo },
        });

        if (signUpError) {
          setError(signUpError.message || backendError || "L'inscription a échoué. Veuillez réessayer.");
          setLoading(false);
          return;
        }

        if (data?.session) {
          navigate('/dashboard');
          return;
        }

        setSuccessMessage('Inscription réussie ! Veuillez vérifier votre email et confirmer votre compte.');
      } catch (fallbackErr: any) {
        setError(fallbackErr.message || backendError || "L'inscription a échoué. Veuillez réessayer.");
      }

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-clarity-bg">
      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-soft w-full max-w-md border border-clarity-beige">
        <Link to="/" className="inline-flex items-center gap-2 text-clarity-muted hover:text-clarity-brown transition-colors mb-6 font-bold text-sm">
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>
        <h2 className="text-4xl font-bold text-clarity-darkBrown mb-2">Créer un compte</h2>
        <p className="text-clarity-muted mb-8 font-medium">Commencez à organiser vos notes dès aujourd'hui.</p>
        
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm font-bold border border-red-100">{error}</div>}
        {successMessage && <div className="bg-green-50 text-green-600 p-3 rounded-xl mb-4 text-sm font-bold border border-green-100">{successMessage}</div>}
        
        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-clarity-darkBrown mb-1 ml-1 select-none">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-clarity-beige/50 bg-gray-50 transition-all font-medium"
              placeholder="votre@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-clarity-darkBrown mb-1 ml-1 select-none">Mot de passe</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 pr-12 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-clarity-beige/50 bg-gray-50 transition-all font-medium"
                placeholder="Min. 6 caractères"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-clarity-muted hover:text-clarity-brown transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-clarity-brown text-white font-extrabold py-4 rounded-2xl hover:bg-clarity-darkBrown transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50">
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>
        <div className="mt-8 text-center text-sm font-medium text-clarity-muted">
          Vous avez déjà un compte ? <Link to="/login" className="text-clarity-brown font-bold hover:underline">Connectez-vous</Link>
        </div>
      </div>
    </div>
  );
};
