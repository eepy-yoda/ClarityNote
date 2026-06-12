import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Veuillez entrer votre email');
      return;
    }
    
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setResetSent(true);
      setError('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-clarity-bg">
      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-soft w-full max-w-md border border-clarity-beige">
        <Link to="/" className="inline-flex items-center gap-2 text-clarity-muted hover:text-clarity-brown transition-colors mb-6 font-bold text-sm">
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>
        <h2 className="text-4xl font-bold text-clarity-darkBrown mb-2">Bon retour</h2>
        <p className="text-clarity-muted mb-8 font-medium">Entrez vos identifiants pour accéder à vos notes.</p>
        
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm font-bold border border-red-100">{error}</div>}
        {resetSent && <div className="bg-green-50 text-green-600 p-3 rounded-xl mb-4 text-sm font-bold border border-green-100">Email de réinitialisation envoyé! Vérifiez votre boîte de réception.</div>}
        
        <form onSubmit={handleLogin} className="space-y-6">
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
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-clarity-beige/50 bg-gray-50 transition-all font-medium"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-clarity-brown text-white font-extrabold py-4 rounded-2xl hover:bg-clarity-darkBrown transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <button
          onClick={handleForgotPassword}
          disabled={loading}
          className="w-full mt-4 text-clarity-brown font-medium text-sm hover:text-clarity-darkBrown transition-all"
        >
          Mot de passe oublié?
        </button>

        <div className="mt-8 text-center text-sm font-medium text-clarity-muted">
          Vous n'avez pas de compte ? <Link to="/signup" className="text-clarity-brown font-bold hover:underline">Inscrivez-vous</Link>
        </div>
      </div>
    </div>
  );
};
