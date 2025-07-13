
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "next-themes"
import { CartProvider } from "@/contexts/CartContext"
import { WishlistProvider } from "@/contexts/WishlistContext"
import { CurrencyProvider } from "@/contexts/CurrencyContext"
import Index from "./pages/Index"
import Contact from "./pages/Contact"
import CategoryPage from "./pages/CategoryPage"
import ProductDetailsPage from "./pages/ProductDetailsPage"
import AllProductsPage from "./pages/AllProductsPage"
import NotFound from "./pages/NotFound"
import Checkout from "./pages/Checkout"
import PaymentSuccess from "./pages/PaymentSuccess"
import PaymentFailure from "./pages/PaymentFailure"
import AdminLogin from "./pages/admin/AdminLogin"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminReservations from "./pages/admin/AdminReservations"
import AdminOrders from "./pages/admin/AdminOrders"
import AdminClients from "./pages/admin/AdminClients"
import AdminNewsletter from "./pages/admin/AdminNewsletter"
import AdminMessages from "./pages/admin/AdminMessages"
import AdminVisitors from "./pages/admin/AdminVisitors"
import AdminProducts from "./pages/admin/AdminProducts"
import AdminMessanger from "./pages/admin/AdminMessanger"
import { AdminChat } from "./pages/admin/AdminChat"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import TermsOfService from "./pages/TermsOfService"
import CookiePolicy from "./pages/CookiePolicy"
import Accessibility from "./pages/Accessibility"
import "./i18n"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <CurrencyProvider>
            <CartProvider>
              <WishlistProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/all-products" element={<AllProductsPage />} />
                  <Route path="/category/:category" element={<CategoryPage />} />
                  <Route path="/category/:category/:subcategory" element={<CategoryPage />} />
                  <Route path="/product/:id" element={<ProductDetailsPage />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/payment-failure" element={<PaymentFailure />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/cookie-policy" element={<CookiePolicy />} />
                  <Route path="/accessibility" element={<Accessibility />} />
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/reservations" element={<AdminReservations />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/clients" element={<AdminClients />} />
                  <Route path="/admin/newsletter" element={<AdminNewsletter />} />
                  <Route path="/admin/messages" element={<AdminMessages />} />
                  <Route path="/admin/visitors" element={<AdminVisitors />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/messanger" element={<AdminMessanger />} />
                  <Route path="/admin/chat" element={<AdminChat />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
              </WishlistProvider>
            </CartProvider>
          </CurrencyProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
