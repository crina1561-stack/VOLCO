import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export default function CartPage({ onNavigate }: CartPageProps) {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Coșul tău este gol</h2>
          <p className="text-gray-600 mb-6">Adaugă produse pentru a continua</p>
          <button
            onClick={() => onNavigate('products')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Continuă cumpărăturile
          </button>
        </div>
      </div>
    );
  }

  const shippingCost = totalPrice >= 500 ? 0 : 29.99;
  const finalTotal = totalPrice + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Coșul Tău</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const price = item.product.discount_price || item.product.price;
              return (
                <div key={item.id} className="bg-white rounded-xl shadow-md p-6 flex gap-6">
                  <img
                    src={item.product.images[0] || 'https://images.pexels.com/photos/7974/pexels-photo.jpg'}
                    alt={item.product.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{item.product.name}</h3>

                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-2xl font-bold text-gray-900">
                        {price.toFixed(2)} RON
                      </span>
                      {item.product.discount_price && (
                        <span className="text-gray-400 line-through">
                          {item.product.price.toFixed(2)} RON
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock_quantity}
                          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    {item.quantity >= item.product.stock_quantity && (
                      <p className="text-xs text-orange-600 mt-2">
                        Cantitate maximă disponibilă
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {(price * item.quantity).toFixed(2)} RON
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sumar comandă</h2>

              <div className="space-y-4 mb-6">
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
                {totalPrice < 500 && (
                  <p className="text-sm text-blue-600">
                    Mai adaugă {(500 - totalPrice).toFixed(2)} RON pentru transport gratuit
                  </p>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>{finalTotal.toFixed(2)} RON</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('checkout')}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition mb-3"
              >
                Finalizează Comanda
              </button>

              <button
                onClick={() => onNavigate('products')}
                className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Continuă cumpărăturile
              </button>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Livrare Gratuită</h3>
                <p className="text-sm text-gray-600">Pentru comenzi peste 500 RON</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
