import { useState, useEffect } from 'react';
import { User, Package, FileText, Shield, MapPin, CreditCard, Heart, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { supabase } from '../lib/supabase';
import { Order } from '../types';
import ProductCard from '../components/ProductCard';

interface ProfilePageProps {
  onNavigate: (page: string, slug?: string) => void;
}

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      onNavigate('login');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          product:products(*)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setOrders(data as unknown as Order[]);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'În așteptare';
      case 'processing':
        return 'În procesare';
      case 'shipped':
        return 'Expediată';
      case 'delivered':
        return 'Livrată';
      case 'cancelled':
        return 'Anulată';
      default:
        return status;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Contul Meu</h1>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.email?.[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{user.email}</p>
                  <p className="text-sm text-gray-500">Client VOLCO</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'orders'
                      ? 'bg-red-50 text-red-600 font-semibold'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Package size={20} />
                  <span>Comenzile Mele</span>
                </button>

                <button
                  onClick={() => setActiveTab('warranties')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'warranties'
                      ? 'bg-red-50 text-red-600 font-semibold'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Shield size={20} />
                  <span>Garanții</span>
                </button>

                <button
                  onClick={() => setActiveTab('invoices')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'invoices'
                      ? 'bg-red-50 text-red-600 font-semibold'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <FileText size={20} />
                  <span>Facturi</span>
                </button>

                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'addresses'
                      ? 'bg-red-50 text-red-600 font-semibold'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <MapPin size={20} />
                  <span>Adrese</span>
                </button>

                <button
                  onClick={() => setActiveTab('payment')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'payment'
                      ? 'bg-red-50 text-red-600 font-semibold'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <CreditCard size={20} />
                  <span>Metode de plată</span>
                </button>

                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'favorites'
                      ? 'bg-red-50 text-red-600 font-semibold'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Heart size={20} />
                  <span>Favorite ({favorites.length})</span>
                </button>

                <button
                  onClick={() => onNavigate('wishlist')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 transition"
                >
                  <Heart size={20} />
                  <span>Lista de dorințe</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'settings'
                      ? 'bg-red-50 text-red-600 font-semibold'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Settings size={20} />
                  <span>Setări</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Comenzile Mele</h2>

                {loading ? (
                  <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Se încarcă comenzile...</p>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6 border-b bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm text-gray-600">Comanda #{order.order_number}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                Plasată pe {new Date(order.created_at).toLocaleDateString('ro-RO', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                              <p className="text-2xl font-bold text-gray-900 mt-2">
                                {order.total_amount.toFixed(2)} RON
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          {order.order_items && order.order_items.length > 0 && (
                            <div className="space-y-4">
                              {order.order_items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                  <img
                                    src={item.product_snapshot?.images?.[0] || 'https://images.pexels.com/photos/7974/pexels-photo.jpg'}
                                    alt={item.product_snapshot?.name || 'Product'}
                                    className="w-20 h-20 object-cover rounded-lg"
                                  />
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">{item.product_snapshot?.name}</h4>
                                    <p className="text-sm text-gray-600">Cantitate: {item.quantity}</p>
                                    <p className="text-sm font-semibold text-gray-900 mt-1">
                                      {(item.discount_price || item.price).toFixed(2)} RON
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-3 mt-6 pt-6 border-t">
                            <button className="px-6 py-2.5 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition font-semibold">
                              Urmărește comanda
                            </button>
                            {order.invoice_number && (
                              <button className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold">
                                Descarcă factura
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <Package size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Nu ai comenzi încă</h3>
                    <p className="text-gray-600 mb-6">Descoperă produsele noastre și plasează prima comandă</p>
                    <button
                      onClick={() => onNavigate('products')}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                    >
                      Explorează produsele
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'warranties' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Garanții Produse</h2>
                <div className="bg-white rounded-xl shadow-md p-8">
                  <div className="text-center py-8">
                    <Shield size={64} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Toate garanțiile produselor tale comandate vor apărea aici</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'invoices' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Facturile Mele</h2>
                <div className="bg-white rounded-xl shadow-md p-8">
                  <div className="text-center py-8">
                    <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Facturile tale vor apărea aici după plasarea comenzilor</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Adresele Mele</h2>
                <div className="bg-white rounded-xl shadow-md p-8">
                  <div className="text-center py-8">
                    <MapPin size={64} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-6">Nu ai adrese salvate</p>
                    <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold">
                      Adaugă adresă nouă
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Metode de Plată</h2>
                <div className="bg-white rounded-xl shadow-md p-8">
                  <div className="text-center py-8">
                    <CreditCard size={64} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-6">Nu ai metode de plată salvate</p>
                    <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold">
                      Adaugă card nou
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Produsele Mele Favorite</h2>
                {favorites.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((product) => (
                      <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-md p-8">
                    <div className="text-center py-8">
                      <Heart size={64} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-6">Nu ai produse favorite</p>
                      <button
                        onClick={() => onNavigate('products')}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                      >
                        Descoperă produse
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Setări Cont</h2>
                <div className="bg-white rounded-xl shadow-md p-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={user.email || ''}
                        disabled
                        className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nume complet</label>
                      <input
                        type="text"
                        placeholder="Introdu numele tău"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon</label>
                      <input
                        type="tel"
                        placeholder="Introdu numărul de telefon"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="pt-4">
                      <button className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold">
                        Salvează modificările
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
