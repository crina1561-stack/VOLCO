import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { CreditCard, Wallet } from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

export default function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    shippingAddress: {
      street: '',
      city: '',
      county: '',
      postalCode: '',
      country: 'România'
    },
    billingAddress: {
      street: '',
      city: '',
      county: '',
      postalCode: '',
      country: 'România'
    },
    paymentMethod: 'card',
    sameAsBilling: true,
    notes: ''
  });

  const shippingCost = totalPrice >= 500 ? 0 : 29.99;
  const finalTotal = totalPrice + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          order_number: orderNumber,
          status: 'pending',
          total_amount: finalTotal,
          discount_amount: 0,
          shipping_address: formData.sameAsBilling ? formData.billingAddress : formData.shippingAddress,
          billing_address: formData.billingAddress,
          payment_method: formData.paymentMethod,
          payment_status: 'pending',
          notes: formData.notes
        })
        .select()
        .single();

      if (error) throw error;

      for (const item of items) {
        await supabase.from('order_items').insert({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product.price,
          discount_price: item.product.discount_price,
          product_snapshot: {
            name: item.product.name,
            images: item.product.images
          }
        });

        await supabase
          .from('products')
          .update({
            stock_quantity: item.product.stock_quantity - item.quantity,
            sales_count: item.product.sales_count + item.quantity
          })
          .eq('id', item.product_id);
      }

      await clearCart();
      onNavigate('order-success');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('A apărut o eroare la procesarea comenzii. Te rugăm să încerci din nou.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    onNavigate('cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Finalizare Comandă</h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informații de Contact</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nume Complet *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Adresa de Livrare</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Strada și Număr *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shippingAddress.street}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingAddress: { ...formData.shippingAddress, street: e.target.value }
                      })
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Oraș *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shippingAddress.city}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shippingAddress: { ...formData.shippingAddress, city: e.target.value }
                        })
                      }
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Județ *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shippingAddress.county}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shippingAddress: { ...formData.shippingAddress, county: e.target.value }
                        })
                      }
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cod Poștal *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shippingAddress.postalCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shippingAddress: { ...formData.shippingAddress, postalCode: e.target.value }
                        })
                      }
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Metodă de Plată</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-5 h-5 text-blue-600"
                  />
                  <CreditCard size={24} className="text-gray-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Card Bancar</p>
                    <p className="text-sm text-gray-600">Plată securizată prin Stripe</p>
                  </div>
                </label>
                <label className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="ramburs"
                    checked={formData.paymentMethod === 'ramburs'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-5 h-5 text-blue-600"
                  />
                  <Wallet size={24} className="text-gray-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Ramburs</p>
                    <p className="text-sm text-gray-600">Plată la livrare</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Observații (opțional)</h2>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                placeholder="Instrucțiuni speciale pentru livrare..."
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sumar Comandă</h2>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x {(item.product.discount_price || item.product.price).toFixed(2)} RON
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">{totalPrice.toFixed(2)} RON</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Transport</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? 'GRATUIT' : `${shippingCost.toFixed(2)} RON`}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-2xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>{finalTotal.toFixed(2)} RON</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Se procesează...' : 'Plasează Comanda'}
              </button>

              <p className="text-xs text-gray-600 text-center mt-4">
                Prin plasarea comenzii, accepti termenii și condițiile noastre
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
