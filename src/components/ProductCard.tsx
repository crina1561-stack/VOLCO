import { ShoppingCart, Heart, Star, TrendingUp } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string, productSlug?: string) => void;
}

export default function ProductCard({ product, onNavigate }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);

  const displayPrice = product.discount_price || product.price;
  const hasDiscount = product.discount_price !== null;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      onNavigate('login');
      return;
    }
    await addToCart(product.id);
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      onNavigate('login');
      return;
    }

    if (isInWishlist) {
      await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', product.id);
      setIsInWishlist(false);
    } else {
      await supabase
        .from('wishlist')
        .insert({ user_id: user.id, product_id: product.id });
      setIsInWishlist(true);
    }
  };

  return (
    <div
      onClick={() => onNavigate('product', product.slug)}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-100 hover:border-blue-200"
    >
      <div className="relative overflow-hidden bg-gray-50">
        <img
          src={product.images[0] || 'https://images.pexels.com/photos/7974/pexels-photo.jpg'}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              -{product.discount_percentage}%
            </span>
          )}
          {product.is_new && (
            <span className="bg-gradient-to-r from-green-600 to-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              NOU
            </span>
          )}
          {product.is_featured && (
            <span className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
              <TrendingUp size={14} />
              TOP
            </span>
          )}
        </div>

        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
        >
          <Heart
            size={20}
            className={isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </button>

        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white px-4 py-2 rounded-lg font-bold text-gray-800">
              STOC EPUIZAT
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        {product.brand && (
          <p className="text-sm text-gray-500 font-medium mb-1">{product.brand.name}</p>
        )}

        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-blue-600 transition">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="fill-yellow-400 text-yellow-400" size={16} />
            <span className="font-medium text-gray-800">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-gray-500">({product.review_count} review-uri)</span>
        </div>

        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mb-3 text-sm text-gray-600 space-y-1">
            {Object.entries(product.specifications).slice(0, 2).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-500">{key}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-3 mt-3">
          <div className="flex items-end gap-2 mb-3">
            {hasDiscount && (
              <span className="text-gray-400 line-through text-sm">
                {product.price.toFixed(2)} RON
              </span>
            )}
            <span className="text-2xl font-bold text-gray-900">
              {displayPrice.toFixed(2)} RON
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group-hover:scale-[1.02]"
          >
            <ShoppingCart size={20} />
            Adaugă în Coș
          </button>
        </div>

        {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
          <p className="text-xs text-orange-600 mt-2 font-medium">
            Doar {product.stock_quantity} în stoc!
          </p>
        )}
      </div>
    </div>
  );
}
