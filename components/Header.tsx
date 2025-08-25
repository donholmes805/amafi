
import React, { useState } from 'react';
import { User, Role } from '../types';
import Button from './Button';
import { ICONS } from '../constants';

interface HeaderProps {
  user: User | null;
  onNavigateHome: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToAdmin: () => void;
  onNavigateToModerator: () => void;
  onNavigateToCalendar: () => void;
  onNavigateToProfile: () => void;
  onLogout: () => void;
  onSignUp: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onNavigateHome, onNavigateToDashboard, onNavigateToAdmin, onNavigateToModerator, onNavigateToCalendar, onNavigateToProfile, onLogout, onSignUp }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileLinkClick = (navFunction?: () => void) => {
    if (navFunction) {
      navFunction();
    }
    setIsMobileMenuOpen(false);
  };
  
  const MobileNavMenu: React.FC = () => (
    <div className="fixed inset-0 z-[100] bg-brand-surface md:hidden flex flex-col" role="dialog" aria-modal="true">
      {/* Header of the mobile menu */}
      <div className="flex justify-between items-center p-4 border-b border-brand-secondary/50">
          <span className="font-bold text-lg text-brand-text-primary">Navigation</span>
          <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu" className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
      </div>

      {/* Main navigation links */}
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
           <li><button onClick={() => handleMobileLinkClick(onNavigateHome)} className="w-full text-left p-3 rounded-md hover:bg-brand-secondary font-semibold text-lg">AMAs</button></li>
           <li><button onClick={() => handleMobileLinkClick(onNavigateToCalendar)} className="w-full text-left p-3 rounded-md hover:bg-brand-secondary font-semibold text-lg">Calendar</button></li>
            {user?.role === Role.HOST && <li><button onClick={() => handleMobileLinkClick(onNavigateToDashboard)} className="w-full text-left p-3 rounded-md hover:bg-brand-secondary font-semibold text-lg">Host Dashboard</button></li>}
            {(user?.role === Role.ADMIN || user?.role === Role.MODERATOR) && <li><button onClick={() => handleMobileLinkClick(onNavigateToModerator)} className="w-full text-left p-3 rounded-md hover:bg-brand-secondary font-semibold text-lg">Moderator Panel</button></li>}
            {user?.role === Role.ADMIN && <li><button onClick={() => handleMobileLinkClick(onNavigateToAdmin)} className="w-full text-left p-3 rounded-md hover:bg-brand-secondary font-semibold text-lg">Admin Panel</button></li>}
        </ul>
      </nav>

      {/* Footer of the mobile menu */}
      <div className="p-4 border-t border-brand-secondary/50">
         {user ? (
            <div className="space-y-4">
                <div 
                    onClick={() => handleMobileLinkClick(onNavigateToProfile)}
                    className="flex items-center space-x-3 p-3 rounded-md hover:bg-brand-secondary cursor-pointer"
                >
                    <img src={user.avatar_url} alt={user.name} className="w-12 h-12 rounded-full border-2 border-brand-primary" />
                    <div>
                        <p className="font-bold flex items-center">{user.name} {(user.role === Role.ADMIN || user.role === Role.MODERATOR) && ICONS.CROWN}</p>
                        <p className="text-sm text-brand-text-secondary">View Profile</p>
                    </div>
                </div>
                <Button onClick={() => handleMobileLinkClick(onLogout)} variant="secondary" className="w-full">Logout</Button>
            </div>
          ) : (
            <Button onClick={() => handleMobileLinkClick(onSignUp)} variant="primary" className="w-full">Sign Up / Login</Button>
          )}
      </div>
    </div>
  );

  return (
    <>
      <header className="bg-brand-surface shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div 
              onClick={onNavigateHome}
              className="cursor-pointer"
              aria-label="AMA Fi Home"
            >
              <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 512 145" enableBackground="new 0 0 512 145" xmlSpace="preserve" className="h-10">
                <g>
                  <g>
                    <path fill="#8A2BE2" d="M51.761,18.014L5,123.945h30.568l8.26-20.58H88.75l8.259,20.58h31.175L81.271,18.014H51.761z
                      M52.695,81.27L66.29,47.399L79.882,81.27H52.695z"/>
                    <polygon fill="#8A2BE2" points="234.875,18.014 198.614,79.218 161.324,18.014 136.659,18.014 136.659,123.945 164.351,123.945 
                      164.351,69.313 191.44,113.503 204.758,113.503 232.036,67.741 232.298,123.945 259.842,123.945 259.539,18.014 		"/>
                    <path fill="#8A2BE2" d="M360.324,123.945h31.174L344.586,18.014h-29.51l-46.762,105.932h30.57l8.26-20.58h44.922L360.324,123.945z
                      M316.012,81.27l13.592-33.872l13.594,33.872H316.012L316.012,81.27z"/>
                  </g>
                  <g>
                    <polygon fill="#8A2BE2" points="408.729,139.77 432.17,129.487 419.705,101.076 456.285,85.03 448.34,66.918 411.76,82.965 
                      403.766,64.734 445.313,46.506 437.367,28.396 372.379,56.904 		"/>
                    <path fill="#E0E0E0" d="M452.197,31.63c3.531,1.183,7.344,0.871,11.449-0.93c4.18-1.833,7.008-4.461,8.473-7.881
                      c1.463-3.415,1.42-6.904-0.141-10.454c-1.486-3.391-3.973-5.619-7.453-6.682c-3.475-1.063-7.268-0.693-11.369,1.104
                      c-4.104,1.801-6.916,4.4-8.438,7.795c-1.521,3.399-1.539,6.793-0.051,10.185C446.16,28.164,448.668,30.45,452.197,31.63z"/>
                    
                      <rect x="468.574" y="34.879" transform="matrix(0.9157 -0.4018 0.4018 0.9157 12.4294 199.0858)" fill="#E0E0E0" width="24.564" height="70.063"/>
                  </g>
                </g>
              </svg>
            </div>
            <nav className="hidden md:flex items-center space-x-4">
              <button
                onClick={onNavigateHome}
                className="text-brand-text-secondary hover:text-brand-primary transition-colors font-semibold"
              >
                AMAs
              </button>
              <button
                onClick={onNavigateToCalendar}
                className="text-brand-text-secondary hover:text-brand-primary transition-colors font-semibold"
              >
                Calendar
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  {(user.role === Role.ADMIN || user.role === Role.MODERATOR) && (
                      <button
                        onClick={onNavigateToModerator}
                        className="text-brand-text-primary hover:text-brand-primary transition-colors"
                      >
                        Moderator Panel
                      </button>
                  )}
                  {user.role === Role.ADMIN && (
                    <button
                      onClick={onNavigateToAdmin}
                      className="text-brand-text-primary hover:text-brand-primary transition-colors"
                    >
                      Admin Panel
                    </button>
                  )}
                  {user.role === Role.HOST && (
                    <button
                      onClick={onNavigateToDashboard}
                      className="text-brand-text-primary hover:text-brand-primary transition-colors"
                    >
                      Host Dashboard
                    </button>
                  )}
                  <div className="flex items-center space-x-2">
                    <img 
                      src={user.avatar_url}
                      alt={user.name} 
                      className="w-10 h-10 rounded-full border-2 border-brand-primary cursor-pointer"
                      onClick={onNavigateToProfile}
                    />
                    <span className="font-semibold text-brand-text-primary hidden lg:flex items-center">{user.name} {(user.role === Role.ADMIN || user.role === Role.MODERATOR) && ICONS.CROWN}</span>
                  </div>
                  <Button onClick={onLogout} variant="secondary" size="sm">Logout</Button>
                </>
              ) : (
                <Button onClick={onSignUp} variant="primary">Sign Up / Login</Button>
              )}
            </div>
             <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-md text-brand-text-secondary hover:text-brand-primary"
              aria-label="Open menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      {isMobileMenuOpen && <MobileNavMenu />}
    </>
  );
};

export default Header;
