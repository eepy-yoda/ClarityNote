import React from 'react';
import { Link } from 'react-router-dom';
import { BookMarked, Sparkles, FileCheck, QrCode, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-clarity-bg">
      {/* Landing Navbar */}
      <header className="max-w-6xl w-full mx-auto px-6 py-6 flex justify-between items-center animate-fade-in">
        <div className="flex items-center gap-2 text-clarity-brown font-bold text-2xl">
          <BookMarked className="w-8 h-8 text-clarity-brown animate-pulse" />
          <span>Clarity</span>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-clarity-muted hover:text-clarity-darkBrown font-bold text-sm transition-colors cursor-pointer hidden md:block"
          >
            Comment ça marche
          </button>
          <Link to="/login" className="px-6 py-2.5 border border-clarity-beige rounded-full text-clarity-brown font-bold text-sm hover:bg-clarity-beige/30 transition-all">
            Connexion
          </Link>
          <Link to="/signup" className="px-6 py-2.5 bg-clarity-brown text-white rounded-full font-bold text-sm hover:bg-clarity-darkBrown shadow-md transition-all">
            S'inscrire
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-4xl space-y-10 mt-10 md:mt-20 animate-fade-in-up">
          <h1 className="text-6xl md:text-8xl font-extrabold text-clarity-darkBrown leading-tight font-serif">
            Éclaircissez vos pensées. <span className="text-clarity-brown italic">Organisez</span> votre esprit.
          </h1>
          <p className="text-xl md:text-2xl text-clarity-muted max-w-2xl mx-auto font-medium leading-relaxed">
            Nous vous aidons à clarifier vos pensées et à structurer vos notes. Transformez vos écrits manuscrits en un savoir numérique clair, organisé et instantanément consultable.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
            <Link to="/signup" className="px-10 py-5 bg-clarity-brown text-white rounded-full font-extrabold text-xl hover:bg-clarity-darkBrown shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2">
              Commencer gratuitement <ArrowRight className="w-5 h-5" />
            </Link>
            <button 
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 bg-white text-clarity-brown border-2 border-clarity-beige rounded-full font-extrabold text-xl hover:bg-clarity-beige hover:border-clarity-lightBrown shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Comment ça marche ?
            </button>
          </div>
        </div>
        
        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mt-32">
          <div className="bg-white p-10 rounded-[3rem] shadow-soft text-left hover:-translate-y-3 transition-all duration-500 border border-clarity-beige/30 group">
            <div className="bg-clarity-beige/50 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <BookMarked className="w-8 h-8 text-clarity-brown" />
            </div>
            <h3 className="text-2xl font-bold text-clarity-darkBrown mb-4">Carnet Intelligent</h3>
            <p className="text-clarity-muted text-lg leading-relaxed font-medium">L'activation unique par QR Code lie votre carnet physique directement à votre espace de travail numérique.</p>
          </div>
          
          <div className="bg-white p-10 rounded-[3rem] shadow-soft text-left hover:-translate-y-3 transition-all duration-500 border border-clarity-beige/30 group">
            <div className="bg-clarity-beige/50 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Sparkles className="w-8 h-8 text-clarity-brown" />
            </div>
            <h3 className="text-2xl font-bold text-clarity-darkBrown mb-4">Conversion AI OCR</h3>
            <p className="text-clarity-muted text-lg leading-relaxed font-medium">Notre OCR avancé lit l'écriture manuscrite méticuleusement et la structure en texte éditable.</p>
          </div>
          
          <div className="bg-white p-10 rounded-[3rem] shadow-soft text-left hover:-translate-y-3 transition-all duration-500 border border-clarity-beige/30 group">
            <div className="bg-clarity-beige/50 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <FileCheck className="w-8 h-8 text-clarity-brown" />
            </div>
            <h3 className="text-2xl font-bold text-clarity-darkBrown mb-4">Génération PDF</h3>
            <p className="text-clarity-muted text-lg leading-relaxed font-medium">Exportez vos notes numérisées dans de magnifiques mises en page PDF prêtes pour l'impression.</p>
          </div>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="mt-36 max-w-6xl w-full mx-auto space-y-16 py-16 scroll-mt-6">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-clarity-darkBrown font-serif">
              Comment ça marche ?
            </h2>
            <p className="text-clarity-muted text-lg font-medium max-w-xl mx-auto">
              Trois étapes simples pour transformer vos carnets physiques en une base de connaissances numérique.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 relative">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-clarity-beige/30 relative flex flex-col items-center text-center group hover:shadow-xl transition-all duration-300">
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-clarity-brown text-white w-10 h-10 rounded-full flex items-center justify-center font-extrabold shadow-md">
                1
              </span>
              <div className="bg-clarity-beige/30 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6 mt-2 group-hover:scale-110 transition-transform">
                <QrCode className="w-8 h-8 text-clarity-brown" />
              </div>
              <h3 className="text-xl font-bold text-clarity-darkBrown mb-3">Scannez le QR Code</h3>
              <p className="text-clarity-muted text-sm font-medium leading-relaxed">
                Utilisez le code QR unique de votre carnet Clarity pour lier instantanément vos notes physiques à votre compte numérique.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-clarity-beige/30 relative flex flex-col items-center text-center group hover:shadow-xl transition-all duration-300">
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-clarity-brown text-white w-10 h-10 rounded-full flex items-center justify-center font-extrabold shadow-md">
                2
              </span>
              <div className="bg-clarity-beige/30 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6 mt-2 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-clarity-brown" />
              </div>
              <h3 className="text-xl font-bold text-clarity-darkBrown mb-3">Numérisation par l'IA</h3>
              <p className="text-clarity-muted text-sm font-medium leading-relaxed">
                Notre intelligence artificielle analyse votre écriture manuscrite pour la transcrire en texte numérique structuré et modifiable.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-clarity-beige/30 relative flex flex-col items-center text-center group hover:shadow-xl transition-all duration-300">
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-clarity-brown text-white w-10 h-10 rounded-full flex items-center justify-center font-extrabold shadow-md">
                3
              </span>
              <div className="bg-clarity-beige/30 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6 mt-2 group-hover:scale-110 transition-transform">
                <FileCheck className="w-8 h-8 text-clarity-brown" />
              </div>
              <h3 className="text-xl font-bold text-clarity-darkBrown mb-3">Organisez & Partagez</h3>
              <p className="text-clarity-muted text-sm font-medium leading-relaxed">
                Générez de superbes documents PDF, créez des résumés automatiques et gardez vos révisions à portée de main.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-clarity-beige py-8 text-center text-xs text-clarity-muted font-medium bg-clarity-lightBeige">
        <p>&copy; {new Date().getFullYear()} Clarity. Tous droits réservés.</p>
      </footer>
    </div>
  );
};
