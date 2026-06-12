import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event fired by Supabase
    // when the user arrives via the reset link in their email
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        setValidSession(true);
      }
    });

    // Also handle case where page loads with recovery token already in URL hash
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Only trust session if we're on this page intentionally (token in URL)
      const hash = window.location.hash;
      if (session && (hash.includes('type=recovery') || hash.includes('access_token'))) {
        setValidSession(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setDone(true);
      setTimeout(() => navigate('/login'), 3000);
    }
    setLoading(false);
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-clarity-bg">
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-soft w-full max-w-md border border-clarity-beige text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-clarity-darkBrown mb-2">Mot de passe mis à jour!</h2>
          <p className="text-clarity-muted font-medium">Vous allez être redirigé vers la connexion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-clarity-bg">
      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-soft w-full max-w-md border border-clarity-beige">
        <Link to="/login" className="inline-flex items-center gap-2 text-clarity-muted hover:text-clarity-brown transition-colors mb-6 font-bold text-sm">
          <ArrowLeft className="w-4 h-4" />
          Retour à la connexion
        </Link>

        <h2 className="text-4xl font-bold text-clarity-darkBrown mb-2">Nouveau mot de passe</h2>
        <p className="text-clarity-muted mb-8 font-medium">Choisissez un nouveau mot de passe sécurisé.</p>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm font-bold border border-red-100">
            {error}
          </div>
        )}

        {!validSession && (
          <div className="bg-yellow-50 text-yellow-700 p-3 rounded-xl mb-4 text-sm font-bold border border-yellow-100">
            Lien invalide ou expiré. Veuillez refaire une demande de réinitialisation.
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-clarity-darkBrown mb-1 ml-1 select-none">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!validSession}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-clarity-beige/50 bg-gray-50 transition-all font-medium pr-12 disabled:opacity-50"
                placeholder="••••••••"
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

          <div>
            <label className="block text-sm font-bold text-clarity-darkBrown mb-1 ml-1 select-none">
              Confirmer le mot de passe
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={!validSession}
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-clarity-beige/50 bg-gray-50 transition-all font-medium disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !validSession}
            className="w-full bg-clarity-brown text-white font-extrabold py-4 rounded-2xl hover:bg-clarity-darkBrown transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  );
};
