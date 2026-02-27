import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MegaMenuProps {
  onNavigate: (page: string, slug?: string) => void;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  parent_id: string | null;
  subcategories?: Category[];
}

export default function MegaMenu({ onNavigate }: MegaMenuProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);

    const { data: mainCategories } = await supabase
      .from('categories')
      .select('*')
      .is('parent_id', null)
      .order('display_order');

    if (mainCategories) {
      const categoriesWithSubs = await Promise.all(
        mainCategories.map(async (cat) => {
          const { data: subs } = await supabase
            .from('categories')
            .select('*')
            .eq('parent_id', cat.id)
            .order('display_order');

          return {
            ...cat,
            subcategories: subs || []
          };
        })
      );

      setCategories(categoriesWithSubs);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-6 py-4">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-6 w-28 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-6 w-36 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <div
            key={category.id}
            className="relative group"
            onMouseEnter={() => setActiveCategory(category.slug)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <button
              onClick={() => onNavigate('category', category.slug)}
              className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-red-600 font-medium transition-colors whitespace-nowrap rounded-lg hover:bg-red-50"
            >
              {category.icon && <span className="text-xl">{category.icon}</span>}
              <span>{category.name}</span>
            </button>

            {activeCategory === category.slug && category.subcategories && category.subcategories.length > 0 && (
              <div className="absolute left-0 top-full mt-1 w-screen max-w-4xl bg-white shadow-2xl border border-gray-100 rounded-xl z-50 animate-fadeIn">
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-6">
                    {category.subcategories.map((subcat) => (
                      <div key={subcat.id}>
                        <button
                          onClick={() => {
                            onNavigate('category', subcat.slug);
                            setActiveCategory(null);
                          }}
                          className="font-bold text-gray-900 hover:text-red-600 mb-2 flex items-center gap-1 group/item transition"
                        >
                          {subcat.name}
                          <ChevronRight size={16} className="group-hover/item:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <button
                      onClick={() => {
                        onNavigate('category', category.slug);
                        setActiveCategory(null);
                      }}
                      className="text-sm text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 transition"
                    >
                      Vezi toate din {category.name}
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
