import { useEffect, useState } from 'react';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, Brand, Category } from '../types';
import ProductCard from '../components/ProductCard';

interface ProductsPageProps {
  onNavigate: (page: string, slug?: string) => void;
  categorySlug?: string;
}

export default function ProductsPage({ onNavigate, categorySlug }: ProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    brands: [] as string[],
    categories: [] as string[],
    priceMin: 0,
    priceMax: 50000,
    inStock: false,
    onSale: false,
    rating: 0
  });

  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    fetchData();
  }, [categorySlug]);

  useEffect(() => {
    applyFilters();
  }, [products, filters, sortBy]);

  const fetchData = async () => {
    setLoading(true);

    let query = supabase
      .from('products')
      .select('*, brand:brands(*), category:categories(*)')
      .eq('is_available', true);

    if (categorySlug) {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .maybeSingle();

      if (category) {
        query = query.eq('category_id', category.id);
      }
    }

    const [productsRes, brandsRes, categoriesRes] = await Promise.all([
      query,
      supabase.from('brands').select('*').order('name'),
      supabase.from('categories').select('*').order('name')
    ]);

    if (productsRes.data) setProducts(productsRes.data as unknown as Product[]);
    if (brandsRes.data) setBrands(brandsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);

    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (filters.brands.length > 0) {
      filtered = filtered.filter(p => p.brand && filters.brands.includes(p.brand.id));
    }

    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => p.category && filters.categories.includes(p.category.id));
    }

    filtered = filtered.filter(p => {
      const price = p.discount_price || p.price;
      return price >= filters.priceMin && price <= filters.priceMax;
    });

    if (filters.inStock) {
      filtered = filtered.filter(p => p.stock_quantity > 0);
    }

    if (filters.onSale) {
      filtered = filtered.filter(p => p.discount_price !== null);
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(p => p.rating >= filters.rating);
    }

    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
        break;
      case 'price_desc':
        filtered.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.sales_count - a.sales_count);
        break;
    }

    setFilteredProducts(filtered);
  };

  const toggleFilter = (type: 'brands' | 'categories', id: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(id)
        ? prev[type].filter(item => item !== id)
        : [...prev[type], id]
    }));
  };

  const clearFilters = () => {
    setFilters({
      brands: [],
      categories: [],
      priceMin: 0,
      priceMax: 50000,
      inStock: false,
      onSale: false,
      rating: 0
    });
  };

  const activeFiltersCount =
    filters.brands.length +
    filters.categories.length +
    (filters.inStock ? 1 : 0) +
    (filters.onSale ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0) +
    (filters.priceMin > 0 || filters.priceMax < 50000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {categorySlug ? 'Produse din categoria selectată' : 'Toate Produsele'}
          </h1>
          <p className="text-gray-600">{filteredProducts.length} produse găsite</p>
        </div>

        <div className="flex gap-8">
          <div className={`${filtersOpen ? 'block' : 'hidden'} md:block fixed md:relative inset-0 md:inset-auto z-40 md:z-0`}>
            <div className="md:hidden fixed inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
            <div className="md:w-64 w-80 bg-white rounded-xl shadow-lg p-6 h-screen md:h-auto overflow-y-auto relative md:sticky top-4">
              <div className="flex justify-between items-center mb-6 md:hidden">
                <h2 className="text-xl font-bold">Filtre</h2>
                <button onClick={() => setFiltersOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="flex justify-between items-center mb-6 hidden md:flex">
                <h2 className="text-xl font-bold">Filtre</h2>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-700">
                    Șterge tot
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    Preț (RON)
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin}
                      onChange={(e) => setFilters({ ...filters, priceMin: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax}
                      onChange={(e) => setFilters({ ...filters, priceMax: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-3">Branduri</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {brands.map((brand) => (
                      <label key={brand.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={filters.brands.includes(brand.id)}
                          onChange={() => toggleFilter('brands', brand.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{brand.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-3">Categorii</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category.id)}
                          onChange={() => toggleFilter('categories', category.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-3">Rating Minim</h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="radio"
                          name="rating"
                          checked={filters.rating === rating}
                          onChange={() => setFilters({ ...filters, rating })}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{rating}+ stele</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Doar produse în stoc</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={filters.onSale}
                      onChange={(e) => setFilters({ ...filters, onSale: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Doar produse la reducere</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-wrap gap-4 justify-between items-center">
              <button
                onClick={() => setFiltersOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <SlidersHorizontal size={20} />
                Filtre
                {activeFiltersCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sortează după:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="relevance">Relevanță</option>
                  <option value="newest">Cele mai noi</option>
                  <option value="popular">Cele mai vândute</option>
                  <option value="rating">Rating</option>
                  <option value="price_asc">Preț crescător</option>
                  <option value="price_desc">Preț descrescător</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-lg h-96 animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <p className="text-xl text-gray-600 mb-4">Nu am găsit produse care să corespundă criteriilor tale.</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Resetează filtrele
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
