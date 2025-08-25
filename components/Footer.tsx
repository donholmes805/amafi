
import React from 'react';

interface FooterProps {
  onNavigateToTerms: () => void;
  onNavigateToPrivacy: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigateToTerms, onNavigateToPrivacy }) => {
  return (
    <footer className="bg-brand-surface mt-12 py-6">
      <div className="container mx-auto px-4 text-center text-brand-text-secondary text-sm">
        <p>&copy; 2025 AMA Fi. The Stage for Questions & Conversations.</p>
        <div className="mt-4 flex justify-center space-x-4">
          <button onClick={onNavigateToTerms} className="hover:text-brand-primary transition-colors">
            Terms of Service
          </button>
          <span>&middot;</span>
          <button onClick={onNavigateToPrivacy} className="hover:text-brand-primary transition-colors">
            Privacy Policy
          </button>
        </div>
        <p className="mt-4">
          <a 
            href="https://fitotechnology.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-brand-primary transition-colors"
          >
            Fito Technology, LLC
          </a>
          {' '}Copyright &copy; 2025. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
