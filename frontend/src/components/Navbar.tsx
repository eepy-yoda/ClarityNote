import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../viewmodels/useAuth';
import { BookOpen } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10">
      <Link to="/" className="flex items-center gap-2 text-clarity-brown font-bold text-2xl hover:text-clarity-darkBrown transition-colors">
        <BookOpen className="w-8 h-8" />
        Clarity
      </Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <Link to="/dashboard" className="text-clarity-darkBrown hover:text-clarity-brown font-medium">Dashboard</Link>
            <Link to="/events" className="text-clarity-darkBrown hover:text-clarity-brown font-medium">Events</Link>
            <button 
              onClick={logout}
              className="bg-clarity-beige text-clarity-darkBrown px-4 py-2 rounded-lg hover:bg-clarity-lightBrown transition-colors font-medium">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-clarity-brown font-medium hover:text-clarity-darkBrown">Login</Link>
            <Link to="/signup" className="bg-clarity-brown text-white px-5 py-2 rounded-lg shadow-soft hover:bg-clarity-darkBrown transition-transform transform hover:-translate-y-0.5 font-medium">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};
