/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Header from './components/layout/Header';
import Navbar from './components/layout/Navbar';
import Hero from './components/home/Hero';
import Categories from './components/home/Categories';
import FeaturedProducts from './components/home/FeaturedProducts';
import WellnessKits from './components/home/WellnessKits';
import Catalog from './components/home/Catalog';
import ProductDetails, { Product } from './components/products/ProductDetails';
import Cart, { CartItem } from './components/cart/Cart';
import Profile from './components/profile/Profile';
import AuthScreen from './components/auth/AuthScreen';
import ProfileSelection from './components/auth/ProfileSelection';
import SplashScreen from './components/layout/SplashScreen';
import AdminLayout from './components/admin/AdminLayout';
import DashboardOverview from './components/admin/DashboardOverview';
import ProductManagement from './components/admin/ProductManagement';
import PromotionsManagement from './components/admin/PromotionsManagement';
import FinancialManagement from './components/admin/FinancialManagement';
import { useAuth } from './context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Award, Shield } from 'lucide-react';
import { seedDatabase } from './services/seedService';

export default function App() {
  const { user, role, loading: authLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    seedDatabase();
  }, []);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Admin States
  const [adminMenu, setAdminMenu] = useState('overview');

  const handleAddToCart = (product: Product, quantity: number, observations: string) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing && existing.type === 'unit') {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        priceRaw: product.priceRaw,
        image: product.image,
        quantity,
        unit: product.unit,
        type: product.type,
        observations
      }];
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  if (authLoading) return null;

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!user) {
    return <AuthScreen />;
  }

  if (!role) {
    return <ProfileSelection />;
  }

  if (role === 'manager') {
    return (
      <AdminLayout 
        activeMenu={adminMenu} 
        onMenuChange={setAdminMenu}
        onLogout={() => {}}
      >
        {adminMenu === 'overview' && <DashboardOverview />}
        {adminMenu === 'products' && <ProductManagement />}
        {adminMenu === 'promotions' && <PromotionsManagement />}
        {adminMenu === 'financial' && <FinancialManagement />}
        {(adminMenu !== 'overview' && adminMenu !== 'products' && adminMenu !== 'promotions' && adminMenu !== 'financial') && (
          <div className="flex flex-col items-center justify-center h-full text-sage-400">
            <Shield className="opacity-10 mb-4" size={64} />
            <p className="text-lg font-bold">Funcionalidade em desenvolvimento</p>
          </div>
        )}
      </AdminLayout>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60]"
          >
            <ProductDetails 
              product={selectedProduct} 
              onBack={() => setSelectedProduct(null)} 
              onAddToCart={handleAddToCart}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[70]"
          >
            <Cart 
              items={cartItems}
              onBack={() => setIsCartOpen(false)}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen max-w-lg mx-auto bg-earth-50 shadow-2xl relative overflow-x-hidden">
        <Header onCartClick={() => setIsCartOpen(true)} cartCount={cartItems.length} />
        
        <main>
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Hero />
                <Categories />
                <FeaturedProducts />
                <WellnessKits />
              </motion.div>
            )}

            {activeTab === 'catalog' && (
              <motion.div
                key="catalog"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Catalog onProductSelect={setSelectedProduct} />
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Profile />
              </motion.div>
            )}

            {(activeTab !== 'home' && activeTab !== 'catalog' && activeTab !== 'profile') && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-40 text-sage-400"
              >
                <div className="w-20 h-20 bg-sage-50 rounded-full flex items-center justify-center mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Award size={40} className="opacity-20" />
                  </motion.div>
                </div>
                <p className="text-lg font-bold">Em breve...</p>
                <p className="text-sm font-medium">Esta funcionalidade está sendo preparada.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Mobile-first constraints shadow for desktop view */}
        <div className="hidden lg:block fixed inset-0 pointer-events-none border-[32px] border-black/5 rounded-[64px] z-[-1]" />
      </div>
    </>
  );
}
