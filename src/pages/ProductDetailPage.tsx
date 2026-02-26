import { useEffect, useState } from 'react';
import { Star, ShoppingCart, Heart, Shield, Truck, Award, ChevronLeft, ChevronRight, Check, TrendingUp, Package, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, Review } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import ProductCard from '../components/ProductCard';

interface ProductDetailPageProps {
  productSlug: string;
  onNavigate: (page: string, slug?: string) => void;
}

export default function ProductDetailPage({ productSlug, onNavigate }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  useEffect(() => {
    fetchProduct();
  }, [productSlug]);

  const fetchProduct = async () => {
    const { data: productData } = await supabase
      .from('products')
      .select('*, brand:brands(*), category:categories(*)')
      .eq('slug', productSlug)
      .maybeSingle();

    if (productData) {
      const prod = productData as unknown as Product;
      setProduct(prod);

      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*, user_profile:user_profiles(full_name)')
        .eq('product_id', prod.id)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (reviewsData) setReviews(reviewsData as unknown as Review[]);

      if (prod.category_id) {
        const { data: similarData } = await supabase
          .from('products')
          .select('*, brand:brands(*), category:categories(*)')
          .eq('category_id', prod.category_id)
          .neq('id', prod.id)
          .limit(6);

        if (similarData) setSimilarProducts(similarData as unknown as Product[]);
      }
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !product) return;

    setSubmittingReview(true);
    const { error } = await supabase.from('reviews').insert({
      product_id: product.id,
      user_id: user.id,
      rating: reviewRating,
      comment: reviewText,
      is_approved: false
    });

    if (!error) {
      setReviewText('');
      setReviewRating(5);
      alert('Review-ul tău a fost trimis și va fi publicat după aprobare!');
    }
    setSubmittingReview(false);
  };

  const handleAddToCart = async () => {
    if (!user) {
      onNavigate('login');
      return;
    }
    if (product) {
      await addToCart(product.id, quantity);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      onNavigate('login');
      return;
    }
    if (product) {
      if (isFavorite(product.id)) {
        await removeFromFavorites(product.id);
      } else {
        await addToFavorites(product.id);
      }
    }
  };

  const renderStars = (rating: number, size: number = 16, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} ${interactive ? 'cursor-pointer hover:fill-yellow-400 hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0A2540]"></div>
      </div>
    );
  }

  const displayPrice = product.discount_price || product.price;
  const hasDiscount = product.discount_price !== null;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => onNavigate('home')} className="hover:text-[#0A2540]">Acasă</button>
            <span>/</span>
            <button onClick={() => onNavigate('products')} className="hover:text-[#0A2540]">Produse</button>
            {product.category && (
              <>
                <span>/</span>
                <button onClick={() => onNavigate('category', product.category.slug)} className="hover:text-[#0A2540]">
                  {product.category.name}
                </button>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900 font-semibold">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="relative bg-gray-50 rounded-xl p-8 mb-4">
                    {hasDiscount && (
                      <div className="absolute top-4 left-4 z-10">
                        <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
                          -{discountPercentage}%
                        </div>
                      </div>
                    )}
                    <img
                      src={product.images[currentImage] || 'https://images.pexels.com/photos/7974/pexels-photo.jpg'}
                      alt={product.name}
                      className="w-full h-96 object-contain"
                    />
                  </div>

                  <div className="flex gap-2 overflow-x-auto">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          currentImage === index ? 'border-[#0A2540]' : 'border-gray-200'
                        }`}
                      >
                        <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      {product.brand && (
                        <p className="text-sm text-gray-600 mb-1">Brand: <span className="font-semibold text-[#0A2540]">{product.brand.name}</span></p>
                      )}
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                    <div className="flex items-center gap-2">
                      {renderStars(Math.round(product.average_rating))}
                      <span className="text-sm font-semibold text-gray-900">{product.average_rating.toFixed(1)}</span>
                    </div>
                    <span className="text-sm text-gray-600">({product.review_count} review-uri)</span>
                  </div>

                  <div className="mb-6">
                    {hasDiscount && (
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg text-gray-400 line-through">{product.price.toFixed(2)} RON</span>
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-bold">-{discountPercentage}%</span>
                      </div>
                    )}
                    <div className="text-4xl font-bold text-red-600 mb-2">
                      {displayPrice.toFixed(2)} <span className="text-2xl">RON</span>
                    </div>
                    <p className="text-sm text-gray-600">TVA inclus</p>
                  </div>

                  <div className="space-y-3 mb-6 pb-6 border-b">
                    <div className="flex items-center gap-3 text-sm">
                      {product.stock_quantity > 0 ? (
                        <>
                          <Check size={18} className="text-green-600" />
                          <span className="text-green-600 font-semibold">În stoc - {product.stock_quantity} bucăți disponibile</span>
                        </>
                      ) : (
                        <>
                          <Clock size={18} className="text-red-600" />
                          <span className="text-red-600 font-semibold">Stoc epuizat</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Truck size={18} className="text-blue-600" />
                      <span className="text-gray-700">Livrare <span className="font-semibold">24-48h</span> în toată România</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Shield size={18} className="text-purple-600" />
                      <span className="text-gray-700">Garanție <span className="font-semibold">{product.warranty_months} luni</span></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-6 py-2 font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 mb-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock_quantity === 0}
                      className="flex-1 bg-[#0A2540] text-white py-4 rounded-xl hover:bg-[#0d3659] transition font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart size={24} />
                      Adaugă în coș
                    </button>
                    <button
                      onClick={toggleFavorite}
                      className={`px-6 py-4 rounded-xl border-2 transition ${
                        isFavorite(product.id)
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 hover:border-red-500'
                      }`}
                    >
                      <Heart
                        size={24}
                        className={isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                      />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <Truck size={24} className="mx-auto text-blue-600 mb-1" />
                      <p className="text-xs text-gray-700 font-semibold">Livrare rapidă</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <Shield size={24} className="mx-auto text-green-600 mb-1" />
                      <p className="text-xs text-gray-700 font-semibold">Garanție extinsă</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <div className="border-b mb-6">
                <div className="flex gap-6">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`pb-4 px-2 font-semibold transition relative ${
                      activeTab === 'description'
                        ? 'text-[#0A2540] border-b-2 border-[#0A2540]'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Descriere
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`pb-4 px-2 font-semibold transition relative ${
                      activeTab === 'specs'
                        ? 'text-[#0A2540] border-b-2 border-[#0A2540]'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Specificații
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-4 px-2 font-semibold transition relative ${
                      activeTab === 'reviews'
                        ? 'text-[#0A2540] border-b-2 border-[#0A2540]'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Review-uri ({reviews.length})
                  </button>
                </div>
              </div>

              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="space-y-3">
                  {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex py-3 border-b last:border-0">
                      <span className="font-semibold text-gray-700 w-1/3">{key}</span>
                      <span className="text-gray-600 w-2/3">{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {user && (
                    <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
                      <h3 className="font-bold text-lg text-gray-900 mb-4">Scrie un review</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                          {renderStars(reviewRating, 24, true, setReviewRating)}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Review</label>
                          <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A2540] focus:border-transparent"
                            placeholder="Spune-ne ce părere ai despre acest produs..."
                          />
                        </div>
                        <button
                          onClick={handleSubmitReview}
                          disabled={submittingReview || !reviewText.trim()}
                          className="w-full bg-[#0A2540] text-white py-3 rounded-xl hover:bg-[#0d3659] transition font-semibold disabled:opacity-50"
                        >
                          {submittingReview ? 'Se trimite...' : 'Publică review'}
                        </button>
                      </div>
                    </div>
                  )}

                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold text-gray-900">{review.user_profile?.full_name || 'Utilizator'}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {renderStars(review.rating, 14)}
                                <span className="text-sm text-gray-500">
                                  {new Date(review.created_at).toLocaleDateString('ro-RO')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Star size={48} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-600">Acest produs nu are review-uri încă</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h3 className="font-bold text-lg text-gray-900 mb-4">De ce VOLCO?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Livrare gratuită</p>
                    <p className="text-xs text-gray-600">Comenzi peste 500 RON</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Package size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Deschidere colet</p>
                    <p className="text-xs text-gray-600">Verificare la livrare</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Garanție extinsă</p>
                    <p className="text-xs text-gray-600">Până la 36 luni</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Retur 30 zile</p>
                    <p className="text-xs text-gray-600">Fără complicații</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Produse similare</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((product) => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
