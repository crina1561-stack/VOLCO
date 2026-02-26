import { ShoppingCart, User, Heart, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onSearchOpen: () => void;
}

export default function Header({ onNavigate, currentPage, onSearchOpen }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <span>Transport gratuit pentru comenzi peste 500 RON</span>
          <div className="flex gap-4">
            <button onClick={() => onNavigate('contact')} className="hover:text-blue-400 transition">Contact</button>
            <button onClick={() => onNavigate('despre')} className="hover:text-blue-400 transition">Despre Noi</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg font-bold text-2xl shadow-lg hover:shadow-xl transition-shadow">
              NextPC
            </div>
          </button>

          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Caută produse, categorii, branduri..."
                onClick={onSearchOpen}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
              />
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onSearchOpen}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Search size={24} />
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <User size={24} />
                  <span className="hidden md:inline">Contul Meu</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border py-2 z-50">
                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition"
                    >
                      Profilul Meu
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('orders');
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition"
                    >
                      Comenzile Mele
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('wishlist');
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition"
                    >
                      Lista de Dorințe
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        signOut();
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600 transition"
                    >
                      Deconectare
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition"
              >
                <User size={24} />
                <span className="hidden md:inline">Autentificare</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('wishlist')}
              className="p-2 hover:bg-gray-100 rounded-lg transition relative"
            >
              <Heart size={24} />
            </button>

            <button
              onClick={() => onNavigate('cart')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition relative"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
              <span className="hidden md:inline">Coș</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  onNavigate('products');
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 text-left hover:bg-gray-100 rounded-lg transition"
              >
                Toate Produsele
              </button>
              <button
                onClick={() => {
                  onNavigate('categories');
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 text-left hover:bg-gray-100 rounded-lg transition"
              >
                Categorii
              </button>
              <button
                onClick={() => {
                  onNavigate('offers');
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 text-left hover:bg-gray-100 rounded-lg transition"
              >
                Oferte
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="hidden md:flex gap-8 py-3">
            <button
              onClick={() => onNavigate('products')}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Toate Produsele
            </button>
            <button
              onClick={() => onNavigate('laptops')}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Laptopuri
            </button>
            <button
              onClick={() => onNavigate('desktops')}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Desktop
            </button>
            <button
              onClick={() => onNavigate('monitors')}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Monitoare
            </button>
            <button
              onClick={() => onNavigate('peripherals')}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Periferice
            </button>
            <button
              onClick={() => onNavigate('components')}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Componente
            </button>
            <button
              onClick={() => onNavigate('offers')}
              className="text-red-600 hover:text-red-700 font-bold transition"
            >
              Oferte
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
