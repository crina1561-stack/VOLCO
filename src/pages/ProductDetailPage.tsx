import { useEffect, useState } from 'react';
import { Star, ShoppingCart, Heart, Shield, Truck, Award, Check, Package, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, ProductVariant, Review } from '../types';
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
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
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

      const { data: variantsData } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', prod.id)
        .order('display_order');

      if (variantsData) {
        prod.variants = variantsData as unknown as ProductVariant[];
      }

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

  const handleVariantSelect = (type: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const getVariantsByType = (type: string): ProductVariant[] => {
    if (!product?.variants) return [];
    return product.variants.filter(v => v.type === type);
  };

  const getUniqueVariantTypes = (): string[] => {
    if (!product?.variants) return [];
    return Array.from(new Set(product.variants.map(v => v.type)));
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

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product!.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + product!.images.length) % product!.images.length);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0A2540]"></div>
      </div>
    );
  }

  const displayPrice = product.discount_price || product.price;
  const hasDiscount = product.discount_price !== null;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
    : 0;

  const variantTypes = getUniqueVariantTypes();

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 border-b">
        <div className="max-w-[1400px] mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button onClick={() => onNavigate('home')} className="hover:text-[#0A2540]">Acasă</button>
            <span>/</span>
            {product.category && (
              <>
                <button onClick={() => onNavigate('category', product.category.slug)} className="hover:text-[#0A2540]">
                  {product.category.name}
                </button>
                <span>/</span>
              </>
            )}
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <div className="sticky top-24">
              <div className="relative bg-white rounded-2xl overflow-hidden group">
                {hasDiscount && (
                  <div className="absolute top-6 left-6 z-20">
                    <div className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold text-xl shadow-xl">
                      -{discountPercentage}%
                    </div>
                  </div>
                )}

                <button
                  onClick={toggleFavorite}
                  className={`absolute top-6 right-6 z-20 p-3 rounded-full transition shadow-lg ${
                    isFavorite(product.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white/90 backdrop-blur text-gray-700 hover:bg-red-500 hover:text-white'
                  }`}
                >
                  <Heart
                    size={24}
                    className={isFavorite(product.id) ? 'fill-current' : ''}
                  />
                </button>

                <div className="relative aspect-square bg-gray-50">
                  <img
                    src={product.images[currentImage] || 'https://images.pexels.com/photos/7974/pexels-photo.jpg'}
                    alt={product.name}
                    className="w-full h-full object-contain p-8"
                  />

                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                        currentImage === index ? 'border-[#0A2540] shadow-lg' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="space-y-6">
              <div>
                {product.brand && (
                  <div className="text-sm text-gray-500 mb-2">{product.brand.name}</div>
                )}
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
              </div>

              <div className="flex items-center gap-4 pb-6 border-b">
                <div className="flex items-center gap-2">
                  {renderStars(Math.round(product.average_rating || product.rating), 18)}
                  <span className="text-lg font-semibold text-gray-900">{(product.average_rating || product.rating).toFixed(1)}</span>
                </div>
                <button onClick={() => setActiveTab('reviews')} className="text-sm text-gray-500 hover:text-[#0A2540]">
                  ({product.review_count} review-uri)
                </button>
              </div>

              {variantTypes.map(type => {
                const variants = getVariantsByType(type);
                if (variants.length === 0) return null;

                return (
                  <div key={type}>
                    <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">{type}</label>
                    <div className="flex flex-wrap gap-2.5">
                      {variants.map((variant) => {
                        const isSelected = selectedVariants[type] === variant.value;
                        const isColor = type.toLowerCase().includes('culoare') || type.toLowerCase().includes('color');

                        return (
                          <button
                            key={variant.id}
                            onClick={() => handleVariantSelect(type, variant.value)}
                            disabled={!variant.is_available}
                            className={`relative transition-all ${
                              isColor
                                ? 'w-14 h-14 rounded-full border-4'
                                : 'px-6 py-3.5 rounded-xl border-2 font-semibold min-w-[80px]'
                            } ${
                              isSelected
                                ? 'border-[#0A2540] shadow-lg scale-105'
                                : 'border-gray-200 hover:border-[#0A2540] hover:shadow-md'
                            } ${!variant.is_available ? 'opacity-30 cursor-not-allowed' : ''}`}
                            style={isColor && variant.is_available ? {
                              backgroundColor: isSelected ? 'transparent' : variant.value.toLowerCase(),
                              borderColor: isSelected ? '#0A2540' : variant.value.toLowerCase()
                            } : undefined}
                          >
                            {!isColor && (
                              <span className={isSelected ? 'text-[#0A2540]' : 'text-gray-900'}>
                                {variant.value}
                              </span>
                            )}
                            {!variant.is_available && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className={`w-full h-0.5 bg-gray-400 transform rotate-45 ${isColor ? 'rounded-full' : ''}`}></div>
                              </div>
                            )}
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#0A2540] rounded-full flex items-center justify-center">
                                <Check size={12} className="text-white" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div className="py-6 border-y">
                {hasDiscount && (
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl text-gray-400 line-through">{product.price.toFixed(2)} RON</span>
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-bold">-{discountPercentage}%</span>
                  </div>
                )}
                <div className="text-5xl font-bold text-[#0A2540] mb-1">
                  {displayPrice.toFixed(2)} <span className="text-3xl">RON</span>
                </div>
                <p className="text-sm text-gray-500">TVA inclus</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {product.stock_quantity > 0 ? (
                    <>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-600 font-semibold">În stoc ({product.stock_quantity} buc)</span>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-red-600 font-semibold">Stoc epuizat</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Truck size={20} />
                  <span>Livrare gratuită în 24-48h</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Shield size={20} />
                  <span>Garanție {product.warranty_months || 24} luni</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-5 py-3 hover:bg-gray-100 font-bold text-xl transition"
                  >
                    -
                  </button>
                  <span className="px-8 py-3 font-bold text-lg border-x-2 border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="px-5 py-3 hover:bg-gray-100 font-bold text-xl transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="w-full bg-[#0A2540] text-white py-5 rounded-xl hover:bg-[#0d3659] transition font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
              >
                <ShoppingCart size={24} />
                Adaugă în coș
              </button>

              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <Truck size={28} className="mx-auto text-blue-600 mb-2" />
                  <p className="text-xs font-semibold text-gray-700">Livrare rapidă</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl text-center">
                  <Package size={28} className="mx-auto text-green-600 mb-2" />
                  <p className="text-xs font-semibold text-gray-700">Deschidere colet</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl text-center">
                  <Award size={28} className="mx-auto text-purple-600 mb-2" />
                  <p className="text-xs font-semibold text-gray-700">Retur 30 zile</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="border-b mb-8">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-4 px-2 font-bold transition relative text-lg ${
                  activeTab === 'description'
                    ? 'text-[#0A2540] border-b-4 border-[#0A2540]'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Descriere
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-4 px-2 font-bold transition relative text-lg ${
                  activeTab === 'specs'
                    ? 'text-[#0A2540] border-b-4 border-[#0A2540]'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Specificații
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 px-2 font-bold transition relative text-lg ${
                  activeTab === 'reviews'
                    ? 'text-[#0A2540] border-b-4 border-[#0A2540]'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Review-uri ({reviews.length})
              </button>
            </div>
          </div>

          {activeTab === 'description' && (
            <div className="max-w-4xl">
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-4xl">
              {product.specifications && Object.entries(product.specifications).map(([key, value], index) => (
                <div key={key} className={`flex py-4 ${index % 2 === 0 ? 'bg-gray-50' : ''} px-6 rounded-lg`}>
                  <span className="font-semibold text-gray-900 w-1/3">{key}</span>
                  <span className="text-gray-700 w-2/3">{String(value)}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-4xl space-y-8">
              {user && (
                <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
                  <h3 className="font-bold text-xl text-gray-900 mb-6">Scrie un review</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Rating</label>
                      {renderStars(reviewRating, 28, true, setReviewRating)}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Review</label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={5}
                        className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A2540] focus:border-transparent text-base"
                        placeholder="Spune-ne ce părere ai despre acest produs..."
                      />
                    </div>
                    <button
                      onClick={handleSubmitReview}
                      disabled={submittingReview || !reviewText.trim()}
                      className="w-full bg-[#0A2540] text-white py-4 rounded-xl hover:bg-[#0d3659] transition font-bold disabled:opacity-50"
                    >
                      {submittingReview ? 'Se trimite...' : 'Publică review'}
                    </button>
                  </div>
                </div>
              )}

              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{review.user_profile?.full_name || 'Utilizator'}</p>
                          <div className="flex items-center gap-3 mt-2">
                            {renderStars(review.rating, 16)}
                            <span className="text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString('ro-RO', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-base leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Star size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">Acest produs nu are review-uri încă</p>
                </div>
              )}
            </div>
          )}
        </div>

        {similarProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Produse similare</h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
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
