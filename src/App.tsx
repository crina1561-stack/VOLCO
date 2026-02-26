import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import SearchModal from './pages/SearchModal';
import CookieConsent from './components/CookieConsent';
import LegalPage from './pages/LegalPage';
import VendorMarketplacePage from './pages/VendorMarketplacePage';
import { CheckCircle } from 'lucide-react';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageData, setPageData] = useState<string | undefined>();
  const [searchOpen, setSearchOpen] = useState(false);
  const { loading } = useAuth();

  const navigate = (page: string, data?: string) => {
    setCurrentPage(page);
    setPageData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Se încarcă...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    if (currentPage === 'login') {
      return <AuthPage onNavigate={navigate} />;
    }

    return (
      <>
        <Header
          onNavigate={navigate}
          currentPage={currentPage}
          onSearchOpen={() => setSearchOpen(true)}
        />
        {currentPage === 'home' && <HomePage onNavigate={navigate} />}
        {currentPage === 'products' && <ProductsPage onNavigate={navigate} />}
        {currentPage === 'laptops' && <ProductsPage onNavigate={navigate} categorySlug="laptopuri" />}
        {currentPage === 'desktops' && <ProductsPage onNavigate={navigate} categorySlug="calculatoare-desktop" />}
        {currentPage === 'monitors' && <ProductsPage onNavigate={navigate} categorySlug="monitoare" />}
        {currentPage === 'peripherals' && <ProductsPage onNavigate={navigate} categorySlug="periferice" />}
        {currentPage === 'components' && <ProductsPage onNavigate={navigate} categorySlug="componente-pc" />}
        {currentPage === 'offers' && <ProductsPage onNavigate={navigate} />}
        {currentPage === 'category' && pageData && <ProductsPage onNavigate={navigate} categorySlug={pageData} />}
        {currentPage === 'product' && pageData && <ProductDetailPage productSlug={pageData} onNavigate={navigate} />}
        {currentPage === 'cart' && <CartPage onNavigate={navigate} />}
        {currentPage === 'checkout' && <CheckoutPage onNavigate={navigate} />}
        {currentPage === 'profile' && <ProfilePage onNavigate={navigate} />}
        {currentPage === 'orders' && <ProfilePage onNavigate={navigate} />}
        {currentPage === 'vendor-marketplace' && <VendorMarketplacePage onNavigate={navigate} />}
        {currentPage === 'favorites' && <ProfilePage onNavigate={navigate} />}
        {currentPage === 'despre' && <LegalPage slug="despre-noi" onNavigate={navigate} />}
        {currentPage === 'contact' && <LegalPage slug="contact" onNavigate={navigate} />}
        {currentPage === 'politica-confidentialitate' && <LegalPage slug="politica-confidentialitate" onNavigate={navigate} />}
        {currentPage.startsWith('legal/') && <LegalPage slug={currentPage.replace('legal/', '')} onNavigate={navigate} />}
        {currentPage === 'order-success' && (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
              <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Comandă Plasată cu Succes!</h1>
              <p className="text-gray-600 mb-8">Mulțumim pentru comandă. Vei primi un email de confirmare în curând și o factură pe email.</p>
              <button
                onClick={() => navigate('orders')}
                className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold mb-3 w-full"
              >
                Vezi Comanda
              </button>
              <button
                onClick={() => navigate('home')}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold w-full"
              >
                Înapoi la Pagina Principală
              </button>
            </div>
          </div>
        )}
        <Footer onNavigate={navigate} />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderPage()}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={navigate}
      />
      <CookieConsent />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <AppContent />
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
