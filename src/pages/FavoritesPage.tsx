import { Heart, ShoppingCart, Trash2, Home, TrendingUp } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';

interface FavoritesPageProps {
  onNavigate: (page: string, id?: string) => void;
}

export default function FavoritesPage({ onNavigate }: FavoritesPageProps) {
  const { favorites, removeFromFavorites, loading } = useFavorites();
  const { addToCart } = useCart();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = async (productId: string) => {
    setRemovingId(productId);
    await removeFromFavorites(productId);
    setRemovingId(null);
  };

  const handleAddToCart = (productId: string, name: string) => {
    addToCart({
      id: productId,
      name: name,
      price: favorites.find(p => p.id === productId)?.price || 0,
      quantity: 1,
      image: favorites.find(p => p.id === productId)?.images?.[0] || '',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Se încarcă favoritele...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50">
      <div className="bg-gradient-to-r from-pink-600 via-red-600 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 py-16 relative">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-8 transition group"
          >
            <Home size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Înapoi acasă</span>
          </button>

          <div className="flex items-center gap-6">
            <div className="bg-white/20 backdrop-blur-sm p-5 rounded-2xl border border-white/30">
              <Heart size={48} className="text-white" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Produse Favorite
              </h1>
              <p className="text-white/90 text-lg">
                {favorites.length === 0
                  ? 'Nu ai adăugat încă produse la favorite'
                  : `${favorites.length} ${favorites.length === 1 ? 'produs salvat' : 'produse salvate'}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {favorites.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-16 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={64} className="text-pink-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Lista ta de favorite este goală
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Adaugă produse la favorite pentru a le salva și accesa rapid mai târziu!
            </p>
            <button
              onClick={() => onNavigate('products')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-600 to-red-600 text-white font-bold rounded-xl hover:shadow-xl transition"
            >
              <TrendingUp size={20} />
              Descoperă Produse
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 overflow-hidden group"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.images?.[0] || '/placeholder.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => handleRemove(product.id)}
                      disabled={removingId === product.id}
                      className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                    >
                      {removingId === product.id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-600 border-t-transparent"></div>
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-white px-6 py-2 rounded-full text-gray-900 font-bold">
                          Stoc Epuizat
                        </span>
                      </div>
                    )}
                    {product.discount && product.discount > 0 && (
                      <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{product.discount}%
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="mb-3">
                      {product.brand && (
                        <span className="text-sm font-semibold text-pink-600 uppercase tracking-wide">
                          {product.brand.name}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition">
                      {product.name}
                    </h3>

                    <div className="flex items-baseline gap-2 mb-4">
                      {product.discount && product.discount > 0 ? (
                        <>
                          <span className="text-2xl font-bold text-gray-900">
                            {(product.price * (1 - product.discount / 100)).toFixed(2)} RON
                          </span>
                          <span className="text-lg text-gray-500 line-through">
                            {product.price.toFixed(2)} RON
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-gray-900">
                          {product.price.toFixed(2)} RON
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onNavigate('product', product.id)}
                        className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-300 transition"
                      >
                        Detalii
                      </button>
                      <button
                        onClick={() => handleAddToCart(product.id, product.name)}
                        disabled={product.stock === 0}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-pink-600 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={18} />
                        Adaugă
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-gradient-to-br from-pink-100 to-red-100 border-2 border-pink-200 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart size={24} className="text-white" fill="currentColor" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-xl mb-2">
                    Continuă Explorarea
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Descoperă mai multe produse și construiește-ți colecția de favorite!
                  </p>
                  <button
                    onClick={() => onNavigate('products')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-pink-600 text-pink-700 font-semibold rounded-lg hover:bg-pink-600 hover:text-white transition"
                  >
                    <TrendingUp size={20} />
                    Vezi Toate Produsele
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
