import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem('cookieConsent', 'necessary');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t-2 border-[#0A2540] shadow-2xl animate-slideUp">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🍪</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Acest site folosește cookie-uri</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Utilizăm cookie-uri pentru a îmbunătăți experiența ta pe site, a personaliza conținutul și reclamele,
                  a oferi funcții de rețele sociale și a analiza traficul. De asemenea, împărtășim informații despre
                  utilizarea site-ului nostru cu partenerii noștri de social media, publicitate și analiză.
                </p>
                <button className="text-sm text-[#0A2540] hover:underline font-semibold">
                  Citește Politica de Cookie-uri
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={acceptNecessary}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold whitespace-nowrap"
            >
              Doar Necesare
            </button>
            <button
              onClick={acceptAll}
              className="px-6 py-3 bg-[#0A2540] text-white rounded-xl hover:bg-[#0d3659] transition font-semibold whitespace-nowrap"
            >
              Acceptă Toate
            </button>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 md:relative md:top-0 md:right-0 p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
