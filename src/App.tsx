
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Index from './pages/Index';
import Metiers from './pages/Metiers';
import MetierProducts from './pages/MetierProducts';
import Cart from './pages/Cart';
import Devis from './pages/Devis';
import Personalization from './pages/Personalization';
import DesignValidation from './pages/DesignValidation';
import DesignSummary from './pages/DesignSummary';
import Favorites from './pages/Favorites';
import CategoryPage from './components/categories/CategoryPage';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Index />} />
        <Route path="metiers" element={<Metiers />} />
        <Route path="metier/:metierType" element={<MetierProducts />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/devis" element={<Devis />} />
        <Route path="/personalization" element={<Personalization />} />
        <Route path="/design-validation" element={<DesignValidation />} />
        <Route path="/design-summary" element={<DesignSummary />} />
        <Route path="/favorites" element={<Favorites />} />
        
        {/* Category Routes - All using the same template */}
        <Route path="/vetements-cuisine/*" element={<CategoryPage />} />
        <Route path="/vetements-boulanger/*" element={<CategoryPage />} />
        <Route path="/vetements-boucher/*" element={<CategoryPage />} />
        <Route path="/vetements-hotellerie/*" element={<CategoryPage />} />
        <Route path="/vetements-esthetique/*" element={<CategoryPage />} />
        <Route path="/vetements-travail/*" element={<CategoryPage />} />
        <Route path="/chaussures/*" element={<CategoryPage />} />
        <Route path="/produits-marketing/*" element={<CategoryPage />} />
        
        <Route path="/product/:id" element={<ProductDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
