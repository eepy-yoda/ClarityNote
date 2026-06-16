import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../viewmodels/useAuth';
import { 
  BookOpen, 
  FileText, 
  UploadCloud, 
  FileCheck, 
  Calendar, 
  User, 
  LogOut,
  Shield
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Mes Notes', path: '/dashboard', icon: FileText },
    { name: 'Télécharger une Note', path: '/upload', icon: UploadCloud },
    { name: 'PDF Générés', path: '/pdfs', icon: FileCheck },
    { name: 'Événements', path: '/events', icon: Calendar },
    ...(user?.email?.toLowerCase() && ['tsmeowtsmeow@gmail.com', 'nourromdhane21@gmail.com'].includes(user.email.toLowerCase())
      ? [{ name: 'Admin Panel', path: '/admin', icon: Shield }]
      : []),
    { name: 'Profil', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-clarity-lightBeige border-r border-clarity-beige h-screen flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-6">
        <NavLink to="/" className="flex items-center gap-2 text-clarity-brown font-bold text-2xl">
          <BookOpen className="w-8 h-8 text-clarity-brown" />
          Clarity
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? 'bg-clarity-brown text-white shadow-md'
                  : 'text-clarity-muted hover:bg-clarity-beige hover:text-clarity-brown'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-clarity-beige bg-clarity-bg/50">
        <div className="mb-4 bg-clarity-beige/50 p-3 rounded-xl overflow-hidden">
          <p className="text-xs text-clarity-muted font-bold uppercase tracking-wider mb-1">
            Connecté en tant que
          </p>
          <p className="text-sm font-bold text-clarity-darkBrown truncate">
            {user?.email?.split('@')[0] || 'Utilisateur'}
          </p>
          <p className="text-xs text-clarity-muted truncate">
            {user?.email}
          </p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-clarity-beige rounded-xl text-clarity-brown hover:bg-clarity-brown hover:text-white transition-all font-bold text-sm"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
};
