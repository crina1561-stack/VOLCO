import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FileText, Shield, Scale, Home, CheckCircle, Info } from 'lucide-react';

interface LegalPageProps {
  slug: string;
  onNavigate: (page: string) => void;
}

interface LegalContent {
  id: string;
  slug: string;
  title: string;
  content: string;
  meta_description: string;
  updated_at: string;
}

export default function LegalPage({ slug, onNavigate }: LegalPageProps) {
  const [content, setContent] = useState<LegalContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, [slug]);

  const fetchContent = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('legal_pages')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (data) {
      setContent(data as LegalContent);
    }
    setLoading(false);
  };

  const getIcon = () => {
    switch (slug) {
      case 'termeni-conditii':
        return <FileText size={40} className="text-blue-600" />;
      case 'protectia-datelor':
      case 'gdpr':
        return <Shield size={40} className="text-emerald-600" />;
      case 'anpc':
        return <Scale size={40} className="text-amber-600" />;
      default:
        return <FileText size={40} className="text-blue-600" />;
    }
  };

  const getColor = () => {
    switch (slug) {
      case 'termeni-conditii':
        return 'blue';
      case 'protectia-datelor':
      case 'gdpr':
        return 'emerald';
      case 'anpc':
        return 'amber';
      default:
        return 'blue';
    }
  };

  const color = getColor();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Se încarcă...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info size={40} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Pagina nu există</h2>
          <p className="text-gray-600 mb-6">Pagina solicitată nu a putut fi găsită.</p>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            Înapoi acasă
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className={`bg-gradient-to-br from-${color}-600 via-${color}-700 to-${color}-800 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>

        <div className="max-w-5xl mx-auto px-4 py-16 relative">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-8 transition group"
          >
            <Home size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Înapoi la pagina principală</span>
          </button>

          <div className="flex items-start gap-6">
            <div className="bg-white/20 backdrop-blur-sm p-5 rounded-2xl border border-white/30">
              {getIcon()}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                {content.title}
              </h1>
              <p className="text-white/90 text-lg">
                {content.meta_description}
              </p>
              <div className="flex items-center gap-2 mt-4 text-white/80 text-sm">
                <CheckCircle size={16} />
                <span>Ultima actualizare: {new Date(content.updated_at).toLocaleDateString('ro-RO', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12 lg:p-16">
            <div className="prose prose-lg prose-gray max-w-none">
              {content.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('#')) {
                  const level = paragraph.match(/^#+/)?.[0].length || 1;
                  const text = paragraph.replace(/^#+\s*/, '');

                  if (level === 1) {
                    return (
                      <h2
                        key={index}
                        className="text-3xl font-bold text-gray-900 mt-12 mb-6 pb-3 border-b-2 border-gray-200 first:mt-0"
                      >
                        {text}
                      </h2>
                    );
                  } else if (level === 2) {
                    return (
                      <h3
                        key={index}
                        className="text-2xl font-bold text-gray-900 mt-10 mb-4"
                      >
                        {text}
                      </h3>
                    );
                  } else {
                    return (
                      <h4
                        key={index}
                        className="text-xl font-semibold text-gray-800 mt-8 mb-3"
                      >
                        {text}
                      </h4>
                    );
                  }
                }

                if (paragraph.trim().match(/^\d+\./)) {
                  return (
                    <div key={index} className="bg-gray-50 rounded-xl p-6 my-6 border-l-4 border-blue-600">
                      <h3 className="font-bold text-xl text-gray-900 mb-2">
                        {paragraph}
                      </h3>
                    </div>
                  );
                }

                if (paragraph.trim().startsWith('-') || paragraph.trim().startsWith('✓')) {
                  const items = paragraph.split('\n').filter(item => item.trim());
                  return (
                    <ul key={index} className="space-y-3 my-6">
                      {items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-700">
                          <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5 ${
                            item.trim().startsWith('✓') ? 'bg-emerald-500' : 'bg-blue-500'
                          }`}>
                            {item.trim().startsWith('✓') ? '✓' : '•'}
                          </span>
                          <span className="flex-1 leading-relaxed">{item.replace(/^[-✓]\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }

                if (paragraph.trim().length === 0) return null;

                return (
                  <p key={index} className="text-gray-700 leading-relaxed text-lg mb-5">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        <div className={`mt-12 bg-gradient-to-br from-${color}-50 to-${color}-100 border-2 border-${color}-200 rounded-2xl p-8`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 bg-${color}-600 rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Info size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-xl mb-2">Ai întrebări sau nelămuriri?</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Echipa noastră de specialiști este disponibilă pentru a te ajuta cu orice informații suplimentare ai nevoie.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:contact@nextpc.ro"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-${color}-600 text-${color}-700 font-semibold rounded-lg hover:bg-${color}-600 hover:text-white transition`}
                >
                  <span>📧</span>
                  contact@nextpc.ro
                </a>
                <a
                  href="tel:+40800123456"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-${color}-600 text-${color}-700 font-semibold rounded-lg hover:bg-${color}-600 hover:text-white transition`}
                >
                  <span>📞</span>
                  0800 123 456
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <button
            onClick={() => onNavigate('home')}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 text-center transition-all hover:-translate-y-1 border border-gray-100 group"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition">
              <Home className="text-blue-600 group-hover:text-white transition" size={28} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Pagina Principală</h3>
            <p className="text-sm text-gray-600">Înapoi la homepage</p>
          </button>

          <button
            onClick={() => onNavigate('products')}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 text-center transition-all hover:-translate-y-1 border border-gray-100 group"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-600 transition">
              <FileText className="text-emerald-600 group-hover:text-white transition" size={28} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Catalog Produse</h3>
            <p className="text-sm text-gray-600">Explorează oferta noastră</p>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 text-center transition-all hover:-translate-y-1 border border-gray-100 group"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600 transition">
              <Shield className="text-purple-600 group-hover:text-white transition" size={28} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Contul Meu</h3>
            <p className="text-sm text-gray-600">Comenzi și setări</p>
          </button>
        </div>
      </div>
    </div>
  );
}
