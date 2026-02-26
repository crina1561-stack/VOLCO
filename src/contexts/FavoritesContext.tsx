import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { Product } from '../types';

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (productId: string) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    setLoading(true);
    const { data: favoritesData } = await supabase
      .from('favorites')
      .select(`
        id,
        product:products(*, brand:brands(*), category:categories(*))
      `)
      .eq('user_id', user.id);

    if (favoritesData) {
      const products = favoritesData
        .map((fav: any) => fav.product)
        .filter((p: any) => p !== null) as Product[];
      setFavorites(products);
    }
    setLoading(false);
  };

  const addToFavorites = async (productId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: user.id, product_id: productId });

    if (!error) {
      await fetchFavorites();
    }
  };

  const removeFromFavorites = async (productId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (!error) {
      setFavorites(favorites.filter(p => p.id !== productId));
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some(p => p.id === productId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
