
import { useState, useEffect } from 'react';
import { ClientTypeModal } from './components/ClientTypeModal';
import Navbar from './components/Navbar';
import { Footer } from './components/Footer';
import { Contact } from './pages/Contact';
import Home from './pages/Home';
import About from './pages/About';
import Revendeurs from './pages/Revendeurs';
import Partners from './pages/Partners';
import Certifications from './pages/Certifications';
import Products from './pages/Products';
import ProductsAllPage from './pages/ProductsAllPage';
import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/CookieConsent';
import type { ClientType, ProductCategory } from './types';
import Cookies from 'js-cookie';
import { AppProvider } from './context/AppContext';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/Dashboard';
import { trackVisitor } from './utils/visitorTracking';
import DateFarcie from './pages/DateFarcie';

function App() {
  const [clientType, setClientType] = useState<ClientType>(() => {
    const savedType = Cookies.get('clientType') as ClientType;
    return savedType || null;
  });
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('tous');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Track page views when the current page changes
  useEffect(() => {
    if (currentPage) {
      // Using French page names for tracking
      const pageName = getFrenchPageName(currentPage);
      trackVisitor(pageName);
    }
  }, [currentPage]);

  // Map English page names to French
  const getFrenchPageName = (pageName: string): string => {
    const pageNameMap: Record<string, string> = {
      'home': 'accueil',
      'products': 'produits',
      'products-all': 'tous-produits',
      'product-detail': 'detail-produit',
      'about': 'a-propos',
      'contact': 'contact',
      'resellers': 'revendeurs',
      'partners': 'nos-partenaires',
      'certifications': 'certifications',
      'statistique': 'statistique',
      'technical-products': 'produits-techniques',
      'dattes-farcies': 'dattes-farcies'
    };
    
    return pageNameMap[pageName] || pageName;
  };

  useEffect(() => {
    const handleNavigateEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ page: string }>;
      if (customEvent.detail && customEvent.detail.page) {
        setCurrentPage(customEvent.detail.page);
      }
    };

    const handleNavigateToProduct = (event: Event) => {
      const customEvent = event as CustomEvent<{ productId: string }>;
      if (customEvent.detail && customEvent.detail.productId) {
        setSelectedProductId(customEvent.detail.productId);
        setCurrentPage('product-detail');
      }
    };

    window.addEventListener('navigateTo', handleNavigateEvent);
    window.addEventListener('navigateToProduct', handleNavigateToProduct);
    
    return () => {
      window.removeEventListener('navigateTo', handleNavigateEvent);
      window.removeEventListener('navigateToProduct', handleNavigateToProduct);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleClientTypeChange = (type: ClientType) => {
    setClientType(type);
    if (type) {
      const hasConsent = Cookies.get('cookieConsent');
      if (hasConsent === 'accepted') {
        Cookies.set('clientType', type);
      }
    }
  };

  const handleCookieAccept = () => {
    if (clientType) {
      Cookies.set('clientType', clientType);
    }
  };

  const handleCookieDecline = () => {
    Cookies.remove('clientType');
  };

  const handlePageChange = (page: string, category?: ProductCategory) => {
    console.log('Changing page to:', page);
    setCurrentPage(page);
    if (category) {
      setSelectedCategory(category);
    }
    // Reset product ID when navigating away from product detail
    if (page !== 'product-detail') {
      setSelectedProductId(null);
    }

    // No need to track page visit here as it's already handled in the useEffect
  };

  const renderPage = () => {
    console.log('Current page:', currentPage);
    switch (currentPage) {
      case 'products':
        return <Products selectedCategory={selectedCategory} />;
      case 'products-all':
        return <ProductsAllPage />;
      case 'product-detail':
        return selectedProductId ? (
          <ProductDetail 
            productId={selectedProductId}
            onBack={() => {
              setSelectedProductId(null);
              setCurrentPage('products-all');
            }}
          />
        ) : (
          <ProductsAllPage />
        );
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'resellers':
        return <Revendeurs />;
      case 'partners':
        return <Partners />;
      case 'certifications':
        return <Certifications />;
      case 'statistique':
        return <Dashboard />;
      case 'dattes-farcies':
        return <DateFarcie />;
      default:
        return <Home clientType={clientType} />;
    }
  };

  // Determine the effective client type (default to B2C if null)
  const effectiveClientType = clientType || 'B2C';

  return (
    <AppProvider clientType={effectiveClientType}>
      <div className="min-h-screen flex flex-col">
        {clientType === null ? (
          <>
            <Navbar 
              clientType="B2C" 
              onPageChange={handlePageChange}
              currentPage={currentPage}
              onClientTypeChange={handleClientTypeChange}
            />
            {renderPage()}
            <Footer />
            <ClientTypeModal onSelect={handleClientTypeChange} />
          </>
        ) : (
          <>
            {currentPage !== 'statistique' && (
              <Navbar 
                clientType={clientType} 
                onPageChange={handlePageChange}
                currentPage={currentPage}
                onClientTypeChange={handleClientTypeChange}
              />
            )}
            {renderPage()}
            {currentPage !== 'statistique' && <Footer />}
            <ScrollToTop />
            <CookieConsent 
              onAccept={handleCookieAccept}
              onDecline={handleCookieDecline}
            />
          </>
        )}
      </div>
    </AppProvider>
  );
}

export default App;
