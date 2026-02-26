import { useState, useEffect } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Review {
  id: string;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  user_profiles: {
    full_name: string;
  };
}

interface ProductReviewsProps {
  productId: string;
  onNavigate: (page: string) => void;
}

export default function ProductReviews({ productId, onNavigate }: ProductReviewsProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from('product_reviews')
      .select(`
        *,
        user_profiles(full_name)
      `)
      .eq('product_id', productId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (data) setReviews(data as unknown as Review[]);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      onNavigate('login');
      return;
    }

    setLoading(true);

    await supabase.from('product_reviews').insert({
      product_id: productId,
      user_id: user.id,
      rating,
      title,
      comment,
      status: 'pending'
    });

    setLoading(false);
    setShowReviewForm(false);
    alert('Review-ul tău a fost trimis și va fi moderat în curând!');
    setTitle('');
    setComment('');
    setRating(5);
  };

  const renderStars = (rating: number, interactive = false, onRate?: (r: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRate && onRate(star)}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
          >
            <Star
              size={20}
              className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Review-uri Clienți</h2>
        {user && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-6 py-3 bg-[#0A2540] text-white rounded-xl hover:bg-[#0d3659] transition font-semibold"
          >
            {showReviewForm ? 'Anulează' : 'Scrie Review'}
          </button>
        )}
      </div>

      {showReviewForm && (
        <div className="bg-blue-50 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Scrie un Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rating
              </label>
              {renderStars(rating, true, setRating)}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Titlu
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#0A2540]"
                placeholder="Rezumă experiența ta"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Comentariu
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#0A2540]"
                placeholder="Spune-ne mai multe despre produs..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#0A2540] text-white rounded-xl hover:bg-[#0d3659] transition font-semibold disabled:opacity-50"
            >
              {loading ? 'Se trimite...' : 'Trimite Review'}
            </button>
          </form>
        </div>
      )}

      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#0A2540] rounded-full flex items-center justify-center text-white font-bold">
                      {review.user_profiles?.full_name?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{review.user_profiles?.full_name || 'Utilizator'}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString('ro-RO')}
                      </p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>
                {review.verified_purchase && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    ✓ Cumpărare Verificată
                  </span>
                )}
              </div>

              <h4 className="font-bold text-gray-900 mb-2">{review.title}</h4>
              <p className="text-gray-700 mb-4">{review.comment}</p>

              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0A2540] transition">
                <ThumbsUp size={16} />
                Util ({review.helpful_count})
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <p className="text-gray-600">Acest produs nu are încă review-uri. Fii primul care lasă un review!</p>
        </div>
      )}
    </div>
  );
}
