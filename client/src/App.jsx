import React, { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { PhotographerDashboard } from './pages/PhotographerDashboard';
import { PublicGallery } from './pages/PublicGallery';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'dashboard' | 'public'
  const [publicSlug, setPublicSlug] = useState('');

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#galeria=')) {
        const slug = hash.replace('#galeria=', '');
        if (slug) {
          setPublicSlug(slug);
          setCurrentView('public');
          return true;
        }
      }
      return false;
    };

    const hasPublicHash = checkHash();

    if (!hasPublicHash) {
      const savedUser = localStorage.getItem('@pickmyshot:user');
      const savedToken = localStorage.getItem('@pickmyshot:token');

      if (savedUser && savedToken) {
        try {
          setCurrentUser(JSON.parse(savedUser));
          setCurrentView('dashboard');
        } catch (e) {
          localStorage.removeItem('@pickmyshot:user');
          localStorage.removeItem('@pickmyshot:token');
        }
      }
    }

    const handleHashChange = () => {
      checkHash();
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
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
