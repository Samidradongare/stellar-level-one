import React from 'react';
import { Timer } from 'lucide-react';
import { ConnectButton } from '../wallet/ConnectButton';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="w-full border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <Timer className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform duration-200" />
            <span className="font-extrabold text-lg text-text-primary tracking-tight">
              Proof of <span className="text-primary font-bold">Focus</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
