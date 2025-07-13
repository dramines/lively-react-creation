
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import MobileSidebar from './MobileSidebar';
import AnnouncementBar from './AnnouncementBar';
import PageAnnouncementBar from './PageAnnouncementBar';
import Footer from './Footer';
import StoreFinderModal from '../modals/StoreFinderModal';
import BookingModal from '../modals/BookingModal';
import WishlistModal from '../modals/WishlistModal';
import NewsletterSignupModal from '../modals/NewsletterSignupModal';
import ScrollToTop from '../ui/ScrollToTop';
import { FloatingAssistant } from '../ui/floating-assistant';

interface LayoutProps {
  children: React.ReactNode | ((props: { onBookingOpen: () => void }) => React.ReactNode);
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isStoreFinderOpen, setIsStoreFinderOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);

  // Check if we're on an admin page
  const isAdminPage = location.pathname.startsWith('/admin');
  // Check if we're on the index page
  const isIndexPage = location.pathname === '/';

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    // Show newsletter modal after a short delay when app loads
    const hasSeenNewsletter = localStorage.getItem('hasSeenNewsletterModal');
    if (!hasSeenNewsletter) {
      const timer = setTimeout(() => {
        setIsNewsletterOpen(true);
      }, 2000); // 2 second delay
      
      return () => clearTimeout(timer);
    } else {
      // If user has already seen newsletter, show assistant directly
      setShowAssistant(true);
    }
  }, []);

  const handleMenuClick = () => {
    setIsMobileMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleStoreFinderOpen = () => {
    setIsStoreFinderOpen(true);
  };

  const handleStoreFinderClose = () => {
    setIsStoreFinderOpen(false);
  };

  const handleBookingOpen = () => {
    setIsBookingOpen(true);
  };

  const handleBookingClose = () => {
    setIsBookingOpen(false);
  };

  const handleWishlistOpen = () => {
    setIsWishlistOpen(true);
  };

  const handleWishlistClose = () => {
    setIsWishlistOpen(false);
  };

  const handleContactOpen = () => {
    navigate('/contact');
  };

  const handleNewsletterClose = () => {
    setIsNewsletterOpen(false);
    localStorage.setItem('hasSeenNewsletterModal', 'true');
    // Show assistant after newsletter is closed
    setShowAssistant(true);
  };

  const renderChildren = () => {
    if (typeof children === 'function') {
      return children({ onBookingOpen: handleBookingOpen });
    }
    return children;
  };

  return (
    <div className={`min-h-screen ${isIndexPage ? 'bg-transparent' : 'bg-white'}`}>
      {/* Sticky container for index page - includes both announcement bar and header */}
      {!isAdminPage && isIndexPage && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <AnnouncementBar onStoreFinderOpen={handleStoreFinderOpen} />
          <Header 
            onMenuClick={handleMenuClick} 
            onContactOpen={handleContactOpen}
            onBookingOpen={handleBookingOpen}
          />
        </div>
      )}
      
      {/* Non-index pages - separate announcement bar and header */}
      {!isAdminPage && !isIndexPage && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <PageAnnouncementBar onStoreFinderOpen={handleStoreFinderOpen} />
          <Header 
            onMenuClick={handleMenuClick} 
            onContactOpen={handleContactOpen}
            onBookingOpen={handleBookingOpen}
          />
        </div>
      )}
      
      {/* Admin pages - header only */}
      {isAdminPage && (
        <Header 
          onMenuClick={handleMenuClick} 
          onContactOpen={handleContactOpen}
          onBookingOpen={handleBookingOpen}
        />
      )}
      
      <MobileSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={handleMenuClose}
        onStoreFinderOpen={handleStoreFinderOpen}
        onBookingOpen={handleBookingOpen}
        onWishlistOpen={handleWishlistOpen}
        onContactOpen={handleContactOpen}
      />
      {/* Remove padding on index page so hero starts behind header */}
      <main className={isIndexPage ? '' : 'pt-[140px]'}>{renderChildren()}</main>
      <Footer />
      <StoreFinderModal isOpen={isStoreFinderOpen} onClose={handleStoreFinderClose} />
      <BookingModal isOpen={isBookingOpen} onClose={handleBookingClose} />
      <WishlistModal isOpen={isWishlistOpen} onClose={handleWishlistClose} />
      
      <NewsletterSignupModal isOpen={isNewsletterOpen} onClose={handleNewsletterClose} />
      <ScrollToTop />
      {!isAdminPage && <FloatingAssistant />}
    </div>
  );
};

export default Layout;
