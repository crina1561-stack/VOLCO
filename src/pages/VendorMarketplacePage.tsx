import { useState } from 'react';
import { Store, Users, TrendingUp, Clock, CheckCircle, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface VendorMarketplacePageProps {
  onNavigate: (page: string) => void;
}

export default function VendorMarketplacePage({ onNavigate }: VendorMarketplacePageProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    company_name: '',
    company_cui: '',
    company_address: '',
    phone: '',
    email: '',
    description: '',
    website: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      onNavigate('login');
      return;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from('vendor_applications')
      .insert({
        user_id: user.id,
        ...formData
      });

    if (!error) {
      setSubmitted(true);
    }

    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Aplicație trimisă!
          </h2>
          <p className="text-gray-600 mb-6">
            Mulțumim pentru interesul acordat! Echipa noastră va analiza aplicația ta și te va contacta în cel mai scurt timp.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="w-full bg-[#0A2540] text-white py-3 rounded-xl hover:bg-[#0d3659] transition font-semibold"
          >
            Înapoi la pagina principală
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#0A2540] via-blue-700 to-cyan-600 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
            <span className="text-white font-semibold">VOLCO Marketplace</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Crește-ți afacerea!
          </h1>
          <p className="text-2xl text-white/90 mb-4 max-w-3xl mx-auto">
            Acces instant la <span className="font-bold">sute de mii de clienți unici</span>, zilnic
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-white text-lg">
            <div className="flex items-center gap-2">
              <CheckCircle size={24} className="text-green-400" />
              <span>Înregistrarea afacerii tale este <strong>gratuită</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={24} className="text-green-400" />
              <span>Ești la doar <strong>câteva click-uri</strong> de vânzări spectaculoase</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              500.000+ Clienți
            </h3>
            <p className="text-gray-600">
              Acces imediat la cea mai mare bază de clienți din România
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={32} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Creștere Rapidă
            </h3>
            <p className="text-gray-600">
              Vânzătorii noștri cresc în medie cu 300% în primul an
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign size={32} className="text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Comision Competitiv
            </h3>
            <p className="text-gray-600">
              Păstrezi majoritatea veniturilor tale, fără costuri ascunse
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              De ce să vinzi pe VOLCO?
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle size={24} className="text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-xl mb-2">
                    Zero costuri inițiale
                  </h3>
                  <p className="text-gray-600">
                    Creează-ți contul gratuit și începe să vinzi imediat, fără investiții inițiale
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Store size={24} className="text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-xl mb-2">
                    Magazin personalizat
                  </h3>
                  <p className="text-gray-600">
                    Creează-ți propriul magazin cu logo, descriere și produse unice
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Clock size={24} className="text-yellow-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-xl mb-2">
                    Plăți rapide
                  </h3>
                  <p className="text-gray-600">
                    Primești banii din vânzări direct în cont, cu procesare în 1-3 zile lucrătoare
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <TrendingUp size={24} className="text-purple-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-xl mb-2">
                    Marketing și promovare
                  </h3>
                  <p className="text-gray-600">
                    Beneficiezi de campaniile noastre de marketing și SEO optimizat
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Aplică acum!
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nume companie *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A2540] focus:border-transparent"
                  placeholder="Ex: SRL TechStore"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CUI (Cod Unic Înregistrare) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company_cui}
                  onChange={(e) => setFormData({ ...formData, company_cui: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A2540] focus:border-transparent"
                  placeholder="Ex: RO12345678"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Adresă sediu social *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company_address}
                  onChange={(e) => setFormData({ ...formData, company_address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A2540] focus:border-transparent"
                  placeholder="Strada, nr, sector/oraș, județ"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A2540] focus:border-transparent"
                    placeholder="+40 700 000 000"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A2540] focus:border-transparent"
                    placeholder="contact@firma.ro"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Website (opțional)
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A2540] focus:border-transparent"
                  placeholder="https://website.ro"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Despre afacerea ta (opțional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A2540] focus:border-transparent"
                  placeholder="Descrie produsele pe care le vinzi..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#0A2540] to-blue-700 text-white py-4 rounded-xl hover:shadow-xl transition font-bold text-lg disabled:opacity-50"
              >
                {submitting ? 'Se trimite...' : 'Trimite aplicația'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Prin trimiterea formularului, accepți{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('legal/termeni-conditii')}
                  className="text-[#0A2540] hover:underline"
                >
                  Termenii și Condițiile
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
