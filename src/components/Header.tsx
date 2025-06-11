import { useState } from 'react';
import Logo from '@/components/ui/Logo';
import AccountMenu from './Header/AccountMenu';
import LoginModal from './auth/LoginModal';
import SignupModal from './auth/SignupModal';
import AccountModal from './auth/AccountModal';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    console.log('Login attempt:', { email, password });
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const handleSignup = async (name: string, email: string, phone: string, password: string) => {
    console.log('Signup attempt:', { name, email, phone, password });
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
  };

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Empty */}
            <div className="flex-1"></div>
            
            {/* Center - Logo */}
            <div className="flex items-center justify-center">
              <Logo size="lg" clickable={true} />
            </div>
            
            {/* Right side - Account Menu */}
            <div className="flex items-center justify-end flex-1">
              <AccountMenu
                isLoggedIn={isLoggedIn}
                userEmail={userEmail}
                onShowLogin={() => setShowLoginModal(true)}
                onShowSignup={() => setShowSignupModal(true)}
                onShowAccount={() => setShowAccountModal(true)}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      </header>

      
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />

      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSignup={handleSignup}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />

      <AccountModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        userEmail={userEmail}
      />
    </>
  );
};

export default Header;
