import React, { useState, useEffect } from 'react';
import { User, Mail, KeyRound, Camera, CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../viewmodels/useAuth';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  // Personal info state — synced from Supabase session when user loads
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoMsg, setInfoMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load user data from Supabase session (includes metadata)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        // Use saved full_name from metadata, fallback to email prefix
        const name = meta?.full_name || session.user.email?.split('@')[0] || '';
        setFullName(name);
        setEmail(session.user.email || '');
      }
    });
  }, [user]);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password strength
  const getStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };
  const strength = getStrength(newPassword);
  const strengthLabel = ['', 'Faible', 'Moyen', 'Bon', 'Fort'][strength];
  const strengthColor = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'][strength];

  const handleSaveInfo = async () => {
    setSavingInfo(true);
    setInfoMsg(null);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });
      if (error) throw error;
      setInfoMsg({ type: 'success', text: 'Informations mises à jour avec succès.' });
    } catch (e: any) {
      setInfoMsg({ type: 'error', text: e.message || 'Une erreur est survenue.' });
    } finally {
      setSavingInfo(false);
    }
  };

  const handleUpdatePassword = async () => {
    setPwdMsg(null);

    if (!currentPassword) {
      setPwdMsg({ type: 'error', text: 'Veuillez entrer votre mot de passe actuel.' });
      return;
    }
    if (!newPassword || !confirmPassword) {
      setPwdMsg({ type: 'error', text: 'Veuillez remplir tous les champs.' });
      return;
    }
    if (newPassword.length < 6) {
      setPwdMsg({ type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdMsg({ type: 'error', text: 'Les mots de passe ne correspondent pas.' });
      return;
    }
    if (currentPassword === newPassword) {
      setPwdMsg({ type: 'error', text: 'Le nouveau mot de passe doit être différent de l\'actuel.' });
      return;
    }

    setSavingPwd(true);
    try {
      // Step 1 — Verify current password by re-signing in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });
      if (signInError) {
        setPwdMsg({ type: 'error', text: 'Mot de passe actuel incorrect.' });
        return;
      }

      // Step 2 — Update to new password
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;

      setPwdMsg({ type: 'success', text: 'Mot de passe mis à jour avec succès !' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      setPwdMsg({ type: 'error', text: e.message || 'Erreur lors de la mise à jour.' });
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-extrabold text-clarity-darkBrown font-serif pb-2 leading-tight">
          Profil
        </h1>
        <p className="text-clarity-muted text-lg font-medium">
          Gérez les informations de votre compte
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left — Avatar card */}
        <div className="bg-white rounded-[2.5rem] border border-clarity-beige shadow-soft p-10 flex flex-col items-center gap-5">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-clarity-beige/50 flex items-center justify-center border-4 border-clarity-beige shadow-md">
              <User className="w-16 h-16 text-clarity-brown/40" />
            </div>
            <button className="absolute bottom-1 right-1 bg-clarity-brown text-white p-2 rounded-full shadow-md hover:bg-clarity-darkBrown transition-all active:scale-95">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center">
            <p className="text-xl font-extrabold text-clarity-darkBrown">
              {fullName || email.split('@')[0] || '—'}
            </p>
            <p className="text-sm text-clarity-muted mt-1">{email}</p>
          </div>
          <button className="w-full border-2 border-clarity-beige text-clarity-brown font-bold py-3 rounded-2xl hover:bg-clarity-beige transition-all text-sm active:scale-95">
            Changer la photo
          </button>
        </div>

        {/* Right — Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal info */}
          <div className="bg-white rounded-[2.5rem] border border-clarity-beige shadow-soft p-10 space-y-6">
            <h2 className="text-2xl font-bold text-clarity-darkBrown flex items-center gap-3">
              <Mail className="w-6 h-6 text-clarity-brown" />
              Informations personnelles
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-clarity-muted mb-2">Nom complet</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-clarity-bg border-2 border-clarity-beige rounded-2xl px-5 py-4 text-clarity-darkBrown font-medium focus:outline-none focus:ring-4 focus:ring-clarity-brown/10 focus:border-clarity-brown transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-clarity-muted mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-clarity-beige/30 border-2 border-clarity-beige rounded-2xl px-5 py-4 text-clarity-muted font-medium cursor-not-allowed"
                />
              </div>
            </div>

            {infoMsg && (
              <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium ${
                infoMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
              }`}>
                {infoMsg.type === 'success'
                  ? <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                {infoMsg.text}
              </div>
            )}

            <button
              onClick={handleSaveInfo}
              disabled={savingInfo}
              className="bg-clarity-brown text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-clarity-darkBrown transition-all shadow-md disabled:opacity-50 flex items-center gap-2 active:scale-95"
            >
              {savingInfo ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Enregistrer les modifications
            </button>
          </div>

          {/* Change password */}
          <div className="bg-white rounded-[2.5rem] border border-clarity-beige shadow-soft p-10 space-y-6">
            <h2 className="text-2xl font-bold text-clarity-darkBrown flex items-center gap-3">
              <KeyRound className="w-6 h-6 text-clarity-brown" />
              Changer le mot de passe
            </h2>

            <div className="space-y-4">
              {/* Current password */}
              <div>
                <label className="block text-sm font-bold text-clarity-muted mb-2">Mot de passe actuel</label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-clarity-bg border-2 border-clarity-beige rounded-2xl px-5 py-4 pr-12 text-clarity-darkBrown font-medium focus:outline-none focus:ring-4 focus:ring-clarity-brown/10 focus:border-clarity-brown transition-all"
                  />
                  <button type="button" onClick={() => setShowCurrent(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-clarity-muted hover:text-clarity-brown transition-colors">
                    {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New password + strength */}
              <div>
                <label className="block text-sm font-bold text-clarity-muted mb-2">Nouveau mot de passe</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-clarity-bg border-2 border-clarity-beige rounded-2xl px-5 py-4 pr-12 text-clarity-darkBrown font-medium focus:outline-none focus:ring-4 focus:ring-clarity-brown/10 focus:border-clarity-brown transition-all"
                  />
                  <button type="button" onClick={() => setShowNew(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-clarity-muted hover:text-clarity-brown transition-colors">
                    {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Strength bar */}
                {newPassword.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : 'bg-clarity-beige'}`} />
                      ))}
                    </div>
                    <p className={`text-xs font-bold ${['','text-red-500','text-orange-500','text-yellow-600','text-green-600'][strength]}`}>
                      {strengthLabel}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-bold text-clarity-muted mb-2">Confirmer le nouveau mot de passe</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full bg-clarity-bg border-2 rounded-2xl px-5 py-4 pr-12 text-clarity-darkBrown font-medium focus:outline-none focus:ring-4 focus:ring-clarity-brown/10 transition-all ${
                      confirmPassword && confirmPassword !== newPassword
                        ? 'border-red-400 focus:ring-red-100'
                        : confirmPassword && confirmPassword === newPassword
                        ? 'border-green-400 focus:ring-green-100'
                        : 'border-clarity-beige focus:border-clarity-brown'
                    }`}
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-clarity-muted hover:text-clarity-brown transition-colors">
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-xs text-red-500 font-medium mt-1">Les mots de passe ne correspondent pas</p>
                )}
                {confirmPassword && confirmPassword === newPassword && (
                  <p className="text-xs text-green-600 font-medium mt-1">✓ Les mots de passe correspondent</p>
                )}
              </div>
            </div>

            {pwdMsg && (
              <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium ${
                pwdMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
              }`}>
                {pwdMsg.type === 'success'
                  ? <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                {pwdMsg.text}
              </div>
            )}

            <button
              onClick={handleUpdatePassword}
              disabled={savingPwd}
              className="bg-clarity-brown text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-clarity-darkBrown transition-all shadow-md disabled:opacity-50 flex items-center gap-2 active:scale-95"
            >
              {savingPwd ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Mettre à jour le mot de passe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
