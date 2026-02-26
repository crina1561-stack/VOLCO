import { ShoppingCart, User, Heart, Search, Menu, X, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import MegaMenu from './MegaMenu';

interface HeaderProps {
  onNavigate: (page: string, slug?: string) => void;
  currentPage: string;
  onSearchOpen: () => void;
}

export default function Header({ onNavigate, currentPage, onSearchOpen }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span>Livrare în toată România</span>
            </div>
            <a
              href="tel:+40800123456"
              className="hidden md:flex items-center gap-2 hover:text-[#0A2540] transition"
            >
              <Phone size={14} />
              <span>0800 123 456</span>
            </a>
          </div>
          <div className="flex gap-4">
            <button onClick={() => onNavigate('despre')} className="hover:text-[#0A2540] transition">Despre Noi</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-[#0A2540] transition">Contact</button>
            <button className="hover:text-[#0A2540] transition">Ajutor</button>
          </div>
        </div>
      </div>

      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <button onClick={() => onNavigate('home')} className="flex items-center group">
              <img
                src="/ChatGPT_Image_20_nov._2025,_05_46_43 copy.png"
                alt="VOLCO Logo"
                className="h-32 md:h-40 w-auto group-hover:scale-105 transition-transform"
              />
            </button>

            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Caută peste 100.000 de produse..."
                  onClick={onSearchOpen}
                  className="w-full pl-12 pr-32 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#0A2540] transition text-base"
                />
                <Search className="absolute left-4 top-4 text-gray-400" size={20} />
                <button
                  onClick={onSearchOpen}
                  className="absolute right-2 top-2 px-6 py-2 bg-[#0A2540] text-white rounded-xl hover:bg-[#0d3659] transition font-semibold"
                >
                  Caută
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onSearchOpen}
                className="md:hidden p-2.5 hover:bg-gray-100 rounded-xl transition"
              >
                <Search size={22} />
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 rounded-xl transition border border-gray-200"
                  >
                    <User size={20} />
                    <div className="hidden lg:block text-left">
                      <div className="text-xs text-gray-500">Bună,</div>
                      <div className="text-sm font-semibold text-gray-900">Contul Meu</div>
                    </div>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border py-2 z-50">
                      <div className="px-4 py-3 border-b">
                        <p className="font-semibold text-gray-900">Contul Meu</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          onNavigate('profile');
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition text-sm"
                      >
                        Profilul Meu
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('orders');
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition text-sm"
                      >
                        Comenzile Mele
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('wishlist');
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition text-sm"
                      >
                        Lista de Dorințe
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('returns');
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition text-sm"
                      >
                        Returnări
                      </button>
                      <hr className="my-2" />
                      <button
                        onClick={() => {
                          signOut();
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-blue-50 text-[#0A2540] transition text-sm font-medium"
                      >
                        Deconectare
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => onNavigate('login')}
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 rounded-xl transition border border-gray-200"
                >
                  <User size={20} />
                  <div className="hidden lg:block text-left">
                    <div className="text-xs text-gray-500">Bună,</div>
                    <div className="text-sm font-semibold text-gray-900">Intră în cont</div>
                  </div>
                </button>
              )}

              <button
                onClick={() => onNavigate('wishlist')}
                className="hidden md:flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 rounded-xl transition border border-gray-200 relative"
              >
                <Heart size={20} />
                <span className="text-sm font-medium">Favorite</span>
              </button>

              <button
                onClick={() => onNavigate('cart')}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0A2540] to-[#0d3659] text-white rounded-xl hover:shadow-lg transition-all relative font-semibold"
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                    {totalItems}
                  </span>
                )}
                <span className="hidden md:inline">Coș</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition"
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
                  className="px-4 py-3 text-left hover:bg-gray-50 rounded-xl transition font-medium"
                >
                  Toate Produsele
                </button>
                <button
                  onClick={() => {
                    onNavigate('categories');
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 text-left hover:bg-gray-50 rounded-xl transition font-medium"
                >
                  Categorii
                </button>
                <button
                  onClick={() => {
                    onNavigate('offers');
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 text-left hover:bg-gray-50 rounded-xl transition font-medium text-[#0A2540]"
                >
                  Oferte Speciale
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-8 text-white font-semibold">
            <button onClick={() => onNavigate('category', 'telefoane-tablete')} className="flex items-center gap-2 hover:scale-110 transition-transform">
              <span className="text-2xl">📱</span>
              <span className="text-sm">Telefoane & Tablete</span>
            </button>
            <button onClick={() => onNavigate('category', 'laptopuri')} className="flex items-center gap-2 hover:scale-110 transition-transform">
              <span className="text-2xl">💻</span>
              <span className="text-sm">Laptopuri</span>
            </button>
            <button onClick={() => onNavigate('category', 'calculatoare-componente')} className="flex items-center gap-2 hover:scale-110 transition-transform">
              <span className="text-2xl">🖥️</span>
              <span className="text-sm">PC & Componente</span>
            </button>
            <button onClick={() => onNavigate('category', 'tv-audio-video')} className="flex items-center gap-2 hover:scale-110 transition-transform">
              <span className="text-2xl">📺</span>
              <span className="text-sm">TV & Audio</span>
            </button>
            <button onClick={() => onNavigate('category', 'gaming')} className="flex items-center gap-2 hover:scale-110 transition-transform">
              <span className="text-2xl">🎮</span>
              <span className="text-sm">Gaming</span>
            </button>
            <button onClick={() => onNavigate('category', 'electrocasnice')} className="flex items-center gap-2 hover:scale-110 transition-transform">
              <span className="text-2xl">🏠</span>
              <span className="text-sm">Electrocasnice</span>
            </button>
            <button onClick={() => onNavigate('category', 'parfumuri-cosmetice')} className="flex items-center gap-2 hover:scale-110 transition-transform">
              <span className="text-2xl">💄</span>
              <span className="text-sm">Parfumuri</span>
            </button>
            <button onClick={() => onNavigate('category', 'fashion-accesorii')} className="flex items-center gap-2 hover:scale-110 transition-transform">
              <span className="text-2xl">👔</span>
              <span className="text-sm">Fashion</span>
            </button>
            <button onClick={() => onNavigate('category', 'rechizite-scolare')} className="flex items-center gap-2 hover:scale-110 transition-transform">
              <span className="text-2xl">📚</span>
              <span className="text-sm">Rechizite</span>
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:block bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <MegaMenu onNavigate={onNavigate} />
        </div>
      </div>

      <div className="bg-red-50 border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <button
              onClick={() => onNavigate('offers')}
              className="text-[#0A2540] font-bold hover:text-[#0d3659] transition flex items-center gap-2"
            >
              <span className="bg-[#0A2540] text-white px-2 py-1 rounded text-xs font-black">HOT</span>
              Super Oferte - Până la -50%
            </button>
            <div className="hidden md:flex gap-6 text-gray-600">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Livrare Gratuită peste 500 RON
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Garanție Extinsă
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Retur 30 zile
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
