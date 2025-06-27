
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "next-themes"
import { CartProvider } from "@/contexts/CartContext"
import { WishlistProvider } from "@/contexts/WishlistContext"
import Index from "./pages/Index"
import CategoryPage from "./pages/CategoryPage"
import ProductDetailsPage from "./pages/ProductDetailsPage"
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
import "./i18n"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <CartProvider>
            <WishlistProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/category/:category" element={<CategoryPage />} />
                  <Route path="/category/:category/:subcategory" element={<CategoryPage />} />
                  <Route path="/product/:id" element={<ProductDetailsPage />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/payment-failure" element={<PaymentFailure />} />
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/reservations" element={<AdminReservations />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/clients" element={<AdminClients />} />
                  <Route path="/admin/newsletter" element={<AdminNewsletter />} />
                  <Route path="/admin/messages" element={<AdminMessages />} />
                  <Route path="/admin/visitors" element={<AdminVisitors />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </WishlistProvider>
          </CartProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
