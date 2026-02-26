import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string, slug?: string) => void;
}

export default function SearchModal({ isOpen, onClose, onNavigate }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchProducts = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*, brand:brands(*), category:categories(*)')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('is_available', true)
        .limit(10);

      if (data) setResults(data as unknown as Product[]);
      setLoading(false);
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  if (!isOpen) return null;

  const handleProductClick = (slug: string) => {
    onNavigate('product', slug);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b flex items-center gap-4">
          <Search className="text-gray-400" size={24} />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Caută produse, categorii, branduri..."
            className="flex-1 text-lg focus:outline-none"
          />
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y">
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.slug)}
                  className="w-full p-4 hover:bg-gray-50 transition flex gap-4 text-left"
                >
                  <img
                    src={product.images[0] || 'https://images.pexels.com/photos/7974/pexels-photo.jpg'}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {product.brand?.name} - {product.category?.name}
                    </p>
                    <p className="font-bold text-blue-600">
                      {(product.discount_price || product.price).toFixed(2)} RON
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="p-8 text-center text-gray-600">
              Nu am găsit produse pentru "{query}"
            </div>
          ) : (
            <div className="p-8 text-center text-gray-600">
              Caută produse după nume, categorie sau brand
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
