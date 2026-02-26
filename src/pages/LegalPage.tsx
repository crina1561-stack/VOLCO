import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FileText, Shield, Scale, Home } from 'lucide-react';

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
        return <FileText size={48} className="text-[#0A2540]" />;
      case 'protectia-datelor':
      case 'gdpr':
        return <Shield size={48} className="text-[#0A2540]" />;
      case 'anpc':
        return <Scale size={48} className="text-[#0A2540]" />;
      default:
        return <FileText size={48} className="text-[#0A2540]" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0A2540]"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pagina nu a fost găsită</h2>
          <button
            onClick={() => onNavigate('home')}
            className="text-[#0A2540] hover:underline"
          >
            Înapoi la pagina principală
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#0A2540] to-[#0d3659] py-12">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition"
          >
            <Home size={20} />
            Acasă
          </button>
          <div className="flex items-center gap-6">
            <div className="bg-white/10 p-4 rounded-2xl">
              {getIcon()}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{content.title}</h1>
              <p className="text-white/80">
                Ultima actualizare: {new Date(content.updated_at).toLocaleDateString('ro-RO')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            {content.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('#')) {
                const level = paragraph.match(/^#+/)?.[0].length || 1;
                const text = paragraph.replace(/^#+\s*/, '');
                const HeadingTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
                return (
                  <HeadingTag
                    key={index}
                    className="font-bold text-gray-900 mt-8 mb-4"
                  >
                    {text}
                  </HeadingTag>
                );
              }

              if (paragraph.trim().match(/^\d+\./)) {
                return (
                  <h3 key={index} className="font-bold text-xl text-gray-900 mt-6 mb-3">
                    {paragraph}
                  </h3>
                );
              }

              if (paragraph.trim().startsWith('-') || paragraph.trim().startsWith('✓')) {
                const items = paragraph.split('\n').filter(item => item.trim());
                return (
                  <ul key={index} className="list-none space-y-2 my-4">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <span className="text-green-600 mt-1">
                          {item.trim().startsWith('✓') ? '✓' : '•'}
                        </span>
                        <span>{item.replace(/^[-✓]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                );
              }

              return (
                <p key={index} className="text-gray-700 leading-relaxed mb-4">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <button
            onClick={() => onNavigate('home')}
            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition group"
          >
            <Home className="mx-auto mb-3 text-[#0A2540] group-hover:scale-110 transition" size={32} />
            <h3 className="font-semibold text-gray-900 mb-1">Acasă</h3>
            <p className="text-sm text-gray-600">Înapoi la pagina principală</p>
          </button>

          <button
            onClick={() => onNavigate('products')}
            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition group"
          >
            <FileText className="mx-auto mb-3 text-[#0A2540] group-hover:scale-110 transition" size={32} />
            <h3 className="font-semibold text-gray-900 mb-1">Produse</h3>
            <p className="text-sm text-gray-600">Explorează catalogul</p>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition group"
          >
            <Shield className="mx-auto mb-3 text-[#0A2540] group-hover:scale-110 transition" size={32} />
            <h3 className="font-semibold text-gray-900 mb-1">Contul Meu</h3>
            <p className="text-sm text-gray-600">Comenzi și setări</p>
          </button>
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-2">Ai întrebări?</h3>
          <p className="text-gray-700 mb-4">
            Echipa noastră este disponibilă pentru a te ajuta.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:contact@volco.ro"
              className="text-[#0A2540] hover:underline font-semibold"
            >
              contact@volco.ro
            </a>
            <a
              href="tel:+40800123456"
              className="text-[#0A2540] hover:underline font-semibold"
            >
              +40 800 123 456
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
