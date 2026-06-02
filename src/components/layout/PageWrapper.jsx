import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Toaster } from 'react-hot-toast';

export function PageWrapper({ children }) {
  const location = useLocation();
  // No navbar on the distraction-free focus session page
  const showNavbar = location.pathname !== '/focus';

  return (
    <div className="min-h-screen w-full relative bg-background text-text-primary overflow-x-hidden flex flex-col">
      {/* Visual background decorations */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40 z-0" />
      
      {/* Top central gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-gradient-to-b from-primary/5 to-transparent blur-[100px] pointer-events-none z-0" />
      
      {/* Floating radial glow points */}
      <div className="absolute top-[20%] left-[5%] w-[250px] h-[250px] bg-primary/5 rounded-full blur-[80px] pointer-events-none z-0 animate-pulse-slow" />
      <div className="absolute bottom-[30%] right-[5%] w-[300px] h-[300px] bg-cyan-900/5 rounded-full blur-[90px] pointer-events-none z-0 animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111118',
            color: '#f9fafb',
            border: '1px solid #1f2937',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#111118',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#111118',
            },
          },
          loading: {
            style: {
              border: '1px solid rgba(6,182,212,0.3)',
            }
          }
        }}
      />

      {showNavbar && <Navbar />}

      <main className="flex-grow z-10 flex flex-col">
        {children}
      </main>

      {showNavbar && (
        <footer className="w-full border-t border-border bg-background py-8 text-center text-xs text-text-muted z-10">
          <div className="max-w-6xl mx-auto px-4">
            <p>© {new Date().getFullYear()} Proof of Focus. Stellar Testnet productivity commitment mechanism.</p>
            <p className="mt-2 text-text-muted/50 max-w-md mx-auto">
              Vault secret keys are stored in .env for hackathon scope. Always secure secret keys on a backend in production.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
