import React, { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { PhotographerDashboard } from './pages/PhotographerDashboard';
import { PublicGallery } from './pages/PublicGallery';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'dashboard' | 'public' | 'notfound'
  const [publicSlug, setPublicSlug] = useState('');

  useEffect(() => {
    const checkRoute = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;

      // Se acessou uma rota que não é a raiz '/' nem o 404.html
      if (pathname !== '/' && pathname !== '' && !pathname.endsWith('/index.html')) {
        setCurrentView('notfound');
        return;
      }

      if (hash.startsWith('#galeria=')) {
        const slug = hash.replace('#galeria=', '');
        if (slug) {
          setPublicSlug(slug);
          setCurrentView('public');
        } else {
          setCurrentView('notfound');
        }
        return;
      }

      // Rota padrão na raiz
      const savedUser = localStorage.getItem('@pickmyshot:user');
      const savedToken = localStorage.getItem('@pickmyshot:token');

      if (savedUser && savedToken) {
        try {
          setCurrentUser(JSON.parse(savedUser));
          setCurrentView('dashboard');
        } catch (e) {
          localStorage.removeItem('@pickmyshot:user');
          localStorage.removeItem('@pickmyshot:token');
          setCurrentView('landing');
        }
      } else {
        setCurrentView('landing');
      }
    };

    checkRoute();

    const handleHashChange = () => {
      checkRoute();
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('@pickmyshot:user');
    localStorage.removeItem('@pickmyshot:token');
    setCurrentUser(null);
    setCurrentView('landing');
    window.location.hash = '';
  };

  const handleNavigateToPublic = (slug) => {
    setPublicSlug(slug);
    setCurrentView('public');
    window.location.hash = `galeria=${slug}`;
  };

  const handleBackToLanding = () => {
    window.location.hash = '';
    if (currentUser) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('landing');
    }
  };

  if (currentView === 'notfound') {
    return <NotFoundPage onBackToLanding={handleBackToLanding} />;
  }

  if (currentView === 'public' && publicSlug) {
    return <PublicGallery slug={publicSlug} onBackToLanding={handleBackToLanding} />;
  }

  if (currentView === 'dashboard' && currentUser) {
    return (
      <PhotographerDashboard
        user={currentUser}
        onLogout={handleLogout}
        onNavigateToPublic={handleNavigateToPublic}
      />
    );
  }

  return <LandingPage onLoginSuccess={handleLoginSuccess} />;
}
