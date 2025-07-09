
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { ProductProvider } from "@/context/ProductContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import ProductDetails from "./pages/ProductDetails";
import Category from "./pages/Category";
import Checkout from "./pages/Checkout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminNewsletter from "./pages/admin/AdminNewsletter";
import AdminVisitors from "./pages/admin/AdminVisitors";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminAuthProvider>
        <ProductProvider>
          <CurrencyProvider>
            <CartProvider>
              <WishlistProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/category/:category" element={<Category />} />
                <Route path="/category/:category/:subcategory" element={<Category />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Routes administratives */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="messages" element={<AdminMessages />} />
                  <Route path="newsletter" element={<AdminNewsletter />} />
                  <Route path="visitors" element={<AdminVisitors />} />
                </Route>
              </Routes>
            </BrowserRouter>
            </WishlistProvider>
          </CartProvider>
        </CurrencyProvider>
      </ProductProvider>
      </AdminAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
