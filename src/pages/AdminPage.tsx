import { useState, useEffect } from 'react';
import { Package, Users, ShoppingCart, Tag, FileText, Upload, Settings, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    checkAdminAccess();
    fetchStats();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      onNavigate('login');
      return;
    }

    const { data } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (!data) {
      alert('Nu ai acces la panoul de administrare!');
      onNavigate('home');
      return;
    }

    setIsAdmin(true);
  };

  const fetchStats = async () => {
    const [productsRes, ordersRes, usersRes, revenueRes] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id', { count: 'exact', head: true }),
      supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('total_amount')
    ]);

    const totalRevenue = revenueRes.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

    setStats({
      totalProducts: productsRes.count || 0,
      totalOrders: ordersRes.count || 0,
      totalUsers: usersRes.count || 0,
      totalRevenue
    });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0A2540]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#0A2540] to-[#0d3659] text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Panou de Administrare VOLCO</h1>
          <p className="text-blue-100 mt-2">Bine ai venit, Administrator!</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#0A2540]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Produse</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
              </div>
              <Package className="text-[#0A2540]" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Comenzi</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Utilizatori</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
              </div>
              <Users className="text-purple-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Venit Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalRevenue.toFixed(0)} RON</p>
              </div>
              <TrendingUp className="text-yellow-500" size={32} />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeTab === 'dashboard' ? 'bg-blue-50 text-[#0A2540] font-semibold' : 'hover:bg-gray-50'
                  }`}
                >
                  <TrendingUp size={20} />
                  Dashboard
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeTab === 'products' ? 'bg-blue-50 text-[#0A2540] font-semibold' : 'hover:bg-gray-50'
                  }`}
                >
                  <Package size={20} />
                  Produse
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeTab === 'orders' ? 'bg-blue-50 text-[#0A2540] font-semibold' : 'hover:bg-gray-50'
                  }`}
                >
                  <ShoppingCart size={20} />
                  Comenzi
                </button>

                <button
                  onClick={() => setActiveTab('discounts')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeTab === 'discounts' ? 'bg-blue-50 text-[#0A2540] font-semibold' : 'hover:bg-gray-50'
                  }`}
                >
                  <Tag size={20} />
                  Coduri Reducere
                </button>

                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeTab === 'reviews' ? 'bg-blue-50 text-[#0A2540] font-semibold' : 'hover:bg-gray-50'
                  }`}
                >
                  <FileText size={20} />
                  Review-uri
                </button>

                <button
                  onClick={() => setActiveTab('import')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeTab === 'import' ? 'bg-blue-50 text-[#0A2540] font-semibold' : 'hover:bg-gray-50'
                  }`}
                >
                  <Upload size={20} />
                  Import Produse
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeTab === 'settings' ? 'bg-blue-50 text-[#0A2540] font-semibold' : 'hover:bg-gray-50'
                  }`}
                >
                  <Settings size={20} />
                  Setări
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {activeTab === 'dashboard' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
                  <p className="text-gray-600">Statistici și rapoarte despre magazin</p>
                </div>
              )}

              {activeTab === 'products' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Gestiune Produse</h2>
                    <button className="px-6 py-3 bg-[#0A2540] text-white rounded-xl hover:bg-[#0d3659] transition font-semibold">
                      + Adaugă Produs
                    </button>
                  </div>
                  <p className="text-gray-600">Gestionează produsele din magazin</p>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestiune Comenzi</h2>
                  <p className="text-gray-600">Vezi și gestionează toate comenzile</p>
                </div>
              )}

              {activeTab === 'discounts' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Coduri de Reducere</h2>
                    <button className="px-6 py-3 bg-[#0A2540] text-white rounded-xl hover:bg-[#0d3659] transition font-semibold">
                      + Crează Cod
                    </button>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                    <p className="text-sm text-blue-800">
                      <strong>Exemplu:</strong> Cod WELCOME10 pentru 10% reducere la prima comandă
                    </p>
                  </div>
                  <p className="text-gray-600">Creează și gestionează campanii de reduceri</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Moderare Review-uri</h2>
                  <p className="text-gray-600">Aprobă sau respinge review-urile clienților</p>
                </div>
              )}

              {activeTab === 'import' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Import Produse Dropshipping</h2>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                      <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">Încarcă fișier CSV, JSON sau XML</p>
                      <button className="px-6 py-3 bg-[#0A2540] text-white rounded-xl hover:bg-[#0d3659] transition font-semibold">
                        Selectează Fișier
                      </button>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-4">Formate Suportate:</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>✓ CSV - Fișiere cu virgulă separată</li>
                        <li>✓ JSON - Format structurat</li>
                        <li>✓ XML - Import de la furnizori</li>
                        <li>✓ API - Conectare directă cu furnizori dropshipping</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Setări Magazin</h2>
                  <p className="text-gray-600">Configurează setările generale</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
