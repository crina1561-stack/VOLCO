import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string, productSlug?: string) => void;
}

export default function ProductCard({ product, onNavigate }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const displayPrice = product.discount_price || product.price;
  const hasDiscount = product.discount_price !== null;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      onNavigate('login');
      return;
    }
    await addToCart(product.id);
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      onNavigate('login');
      return;
    }

    if (isFavorite(product.id)) {
      await removeFromFavorites(product.id);
    } else {
      await addToFavorites(product.id);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      onClick={() => onNavigate('product', product.slug)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-200 hover:border-[#0A2540] relative"
    >
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-lg">
            -{discountPercentage}%
          </div>
        </div>
      )}

      {product.is_featured && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-[#0A2540] text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-lg">
            TOP
          </div>
        </div>
      )}

      <button
        onClick={toggleFavorite}
        className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition"
      >
        <Heart
          size={20}
          className={isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
        />
      </button>

      <div className="relative overflow-hidden bg-gray-50 p-6 flex items-center justify-center h-64">
        <img
          src={product.images[0] || 'https://images.pexels.com/photos/7974/pexels-photo.jpg'}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-[#0A2540] transition">
          {product.name}
        </h3>

        {product.average_rating > 0 && (
          <div className="flex items-center gap-2 mb-3">
            {renderStars(Math.round(product.average_rating))}
            <span className="text-sm text-gray-600">
              {product.average_rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">
              ({product.review_count} review-uri)
            </span>
          </div>
        )}

        <div className="mb-4">
          {hasDiscount && (
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-sm text-gray-400 line-through">
                {product.price.toFixed(2)} RON
              </span>
            </div>
          )}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {displayPrice.toFixed(2)} RON
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#0A2540] text-white py-3 rounded-xl hover:bg-[#0d3659] transition font-semibold text-sm flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} />
            Adaugă în coș
          </button>
        </div>

        {product.stock_quantity < 10 && product.stock_quantity > 0 && (
          <div className="mt-3 text-center">
            <span className="text-xs text-orange-600 font-semibold">
              Doar {product.stock_quantity} bucăți în stoc!
            </span>
          </div>
        )}

        {product.stock_quantity === 0 && (
          <div className="mt-3 text-center">
            <span className="text-xs text-red-600 font-semibold">
              Stoc epuizat
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
