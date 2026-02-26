import { useEffect, useState } from 'react';
import { Star, ShoppingCart, Heart, Shield, Truck, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, Review } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
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
  const { addToCart } = useCart();
  const { user } = useAuth();

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
        .order('created_at', { ascending: false });

      if (reviewsData) setReviews(reviewsData as unknown as Review[]);

      if (prod.category_id) {
        const { data: similarData } = await supabase
          .from('products')
          .select('*, brand:brands(*), category:categories(*)')
          .eq('category_id', prod.category_id)
          .neq('id', prod.id)
          .eq('is_available', true)
          .limit(4);

        if (similarData) setSimilarProducts(similarData as unknown as Product[]);
      }

      await supabase
        .from('products')
        .update({ views: prod.views + 1 })
        .eq('id', prod.id);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      onNavigate('login');
      return;
    }
    await addToCart(product!.id, quantity);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Se încarcă produsul...</p>
        </div>
      </div>
    );
  }

  const displayPrice = product.discount_price || product.price;
  const hasDiscount = product.discount_price !== null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => onNavigate('products')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ChevronLeft size={20} />
          Înapoi la produse
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="relative mb-4 bg-gray-50 rounded-xl overflow-hidden">
                <img
                  src={product.images[currentImage] || 'https://images.pexels.com/photos/7974/pexels-photo.jpg'}
                  alt={product.name}
                  className="w-full h-[500px] object-cover"
                />
                {hasDiscount && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg">
                    -{product.discount_percentage}%
                  </div>
                )}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImage((currentImage - 1 + product.images.length) % product.images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={() => setCurrentImage((currentImage + 1) % product.images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        index === currentImage ? 'border-blue-600' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              {product.brand && (
                <p className="text-blue-600 font-semibold mb-2">{product.brand.name}</p>
              )}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                  <span className="font-semibold text-gray-800">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-600">({product.review_count} review-uri)</span>
              </div>

              <div className="border-t border-b py-6 mb-6">
                <div className="flex items-end gap-4 mb-2">
                  {hasDiscount && (
                    <span className="text-2xl text-gray-400 line-through">
                      {product.price.toFixed(2)} RON
                    </span>
                  )}
                  <span className="text-5xl font-bold text-gray-900">
                    {displayPrice.toFixed(2)} RON
                  </span>
                </div>
                {hasDiscount && (
                  <p className="text-green-600 font-semibold">
                    Economisești {(product.price - displayPrice).toFixed(2)} RON
                  </p>
                )}
              </div>

              <div className="mb-6">
                {product.stock_quantity > 0 ? (
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    În stoc ({product.stock_quantity} disponibile)
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600 font-semibold">
                    <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                    Stoc epuizat
                  </div>
                )}
              </div>

              <div className="flex gap-4 mb-8">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-gray-100 transition"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="px-4 py-3 hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={24} />
                  Adaugă în Coș
                </button>

                <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-red-500 hover:text-red-500 transition">
                  <Heart size={24} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Truck className="mx-auto mb-2 text-blue-600" size={32} />
                  <p className="text-sm font-semibold">Livrare Rapidă</p>
                  <p className="text-xs text-gray-600">24-48 ore</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Shield className="mx-auto mb-2 text-green-600" size={32} />
                  <p className="text-sm font-semibold">Garanție</p>
                  <p className="text-xs text-gray-600">Până la 3 ani</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Award className="mx-auto mb-2 text-yellow-600" size={32} />
                  <p className="text-sm font-semibold">Original</p>
                  <p className="text-xs text-gray-600">100% autentic</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex gap-4 border-b mb-6">
            {['description', 'specs', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold transition ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'description' && 'Descriere'}
                {tab === 'specs' && 'Specificații'}
                {tab === 'reviews' && `Review-uri (${reviews.length})`}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700">{key}</span>
                  <span className="text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{review.user_profile?.full_name || 'Utilizator'}</p>
                        <div className="flex items-center gap-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString('ro-RO')}
                      </span>
                    </div>
                    {review.title && <h4 className="font-semibold mb-2">{review.title}</h4>}
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600">Acest produs nu are încă review-uri.</p>
              )}
            </div>
          )}
        </div>

        {similarProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Produse Similare</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
