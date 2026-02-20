import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './Context/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import ToastContainer from './Components/Toast/ToastContainer';
import Navbar from './Components/Navbar/Navbar';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import LoginSignup from './Pages/LoginSignup';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import Profile from './Pages/Profile';
import AdminDashboard from './Pages/AdminDashboard';
import AdminDashboardRBAC from './Pages/AdminDashboardRBAC';
import ComprehensiveAdminDashboard from './Pages/ComprehensiveAdminDashboard';
import SellerDashboard from './Pages/SellerDashboard';
import SellerDashboardRBAC from './Pages/SellerDashboardRBAC';
import DeliveryDashboard from './Pages/DeliveryDashboard';
import SupportDashboard from './Pages/SupportDashboard';
import FinanceDashboard from './Pages/FinanceDashboard';
import Forbidden from './Pages/Forbidden';
import ProtectedRoute from './Components/ProtectedRoute';
import TestConnection from './Pages/TestConnection';
import TestAuth from './Pages/TestAuth';
import RBACTest from './Pages/RBACTest';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Company from './Pages/Company';
import Offices from './Pages/Offices';
import Wishlist from './Pages/Wishlist';
import Orders from './Pages/Orders';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Assets/banner_mens.png'
import women_banner from './Components/Assets/banner_women.png'
import kid_banner from './Components/Assets/banner_kids.png'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <ToastProvider>
            <Router>
              <Navbar />
              <ToastContainer />
              <Routes>
                <Route path='/' element={<Shop />} />
                <Route path='/mens' element={<ShopCategory banner={men_banner} category="men" />} />
                <Route path='/womens' element={<ShopCategory banner={women_banner} category="women" />} />
                <Route path='/kids' element={<ShopCategory banner={kid_banner} category="kid" />} />
                <Route path='/product/:productId' element={<Product />} />
                <Route path='/login' element={<LoginSignup />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/reset-password' element={<ResetPassword />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/checkout' element={<Checkout />} />
                <Route path='/wishlist' element={<Wishlist />} />
                <Route path='/orders' element={<Orders />} />
                <Route path='/profile' element={<Profile />} />

                {/* Protected Admin Routes */}
                <Route path='/admin' element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path='/admin-rbac' element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboardRBAC />
                  </ProtectedRoute>
                } />
                <Route path='/admin-v2' element={
                  <ProtectedRoute requiredRole="admin">
                    <ComprehensiveAdminDashboard />
                  </ProtectedRoute>
                } />

                {/* Protected Seller Routes */}
                <Route path='/seller' element={
                  <ProtectedRoute requiredRole="seller">
                    <SellerDashboard />
                  </ProtectedRoute>
                } />
                <Route path='/seller-rbac' element={
                  <ProtectedRoute requiredRole="seller">
                    <SellerDashboardRBAC />
                  </ProtectedRoute>
                } />

                {/* Protected Delivery Staff Routes */}
                <Route path='/delivery' element={
                  <ProtectedRoute requiredRole="delivery">
                    <DeliveryDashboard />
                  </ProtectedRoute>
                } />

                {/* Protected Support Staff Routes */}
                <Route path='/support' element={
                  <ProtectedRoute requiredRole="support">
                    <SupportDashboard />
                  </ProtectedRoute>
                } />

                {/* Protected Finance Staff Routes */}
                <Route path='/finance' element={
                  <ProtectedRoute requiredRole="finance">
                    <FinanceDashboard />
                  </ProtectedRoute>
                } />

                {/* 403 Forbidden Page */}
                <Route path='/403' element={<Forbidden />} />
                <Route path='/test' element={<TestConnection />} />
                <Route path='/test-auth' element={<TestAuth />} />
                <Route path='/rbac-test' element={<RBACTest />} />
                <Route path='/about' element={<About />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/company' element={<Company />} />
                <Route path='/offices' element={<Offices />} />
              </Routes>
              <Footer />
            </Router>
          </ToastProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
