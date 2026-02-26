import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <img
              src="/ChatGPT_Image_20_nov._2025,_05_46_43 copy.png"
              alt="VOLCO Logo"
              className="h-24 md:h-32 w-auto mb-4"
            />
            <p className="text-gray-400 mb-4">
              Magazinul tău de încredere pentru electronice, tehnologie și lifestyle premium.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-[#0A2540] transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-[#0A2540] transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-[#0A2540] transition">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Categorii</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button onClick={() => onNavigate('laptops')} className="hover:text-white transition">
                  Laptopuri
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('desktops')} className="hover:text-white transition">
                  Desktop
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('monitors')} className="hover:text-white transition">
                  Monitoare
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('components')} className="hover:text-white transition">
                  Componente PC
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Informații</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button onClick={() => onNavigate('despre')} className="hover:text-white transition">
                  Despre Noi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition">
                  Contact
                </button>
              </li>
              <li>
                <button className="hover:text-white transition">
                  Politica de Confidențialitate
                </button>
              </li>
              <li>
                <button className="hover:text-white transition">
                  Termeni și Condiții
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <MapPin size={18} />
                <span>București, România</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <a href="tel:+40800123456" className="hover:text-white transition">
                  +40 800 123 456
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} />
                <a href="mailto:contact@volco.ro" className="hover:text-white transition">
                  contact@volco.ro
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">📦</div>
              <p className="text-sm font-semibold text-white mb-1">Deschiderea coletului</p>
              <p className="text-xs text-gray-400">la livrare</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">↩️</div>
              <p className="text-sm font-semibold text-white mb-1">30 de zile</p>
              <p className="text-xs text-gray-400">drept de retur</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">💳</div>
              <p className="text-sm font-semibold text-white mb-1">Plata in rate</p>
              <p className="text-xs text-gray-400">fara dobanda</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🛡️</div>
              <p className="text-sm font-semibold text-white mb-1">Garantii</p>
              <p className="text-xs text-gray-400">si service</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <p className="text-gray-400 text-sm">
              © 2024 VOLCO. Toate drepturile rezervate.
            </p>
            <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-gray-400 justify-center md:justify-end">
              <button
                onClick={() => onNavigate('legal/termeni-conditii')}
                className="hover:text-white transition"
              >
                Termeni si conditii
              </button>
              <button
                onClick={() => onNavigate('legal/protectia-datelor')}
                className="hover:text-white transition"
              >
                Protecția Datelor
              </button>
              <button
                onClick={() => onNavigate('legal/gdpr')}
                className="hover:text-white transition"
              >
                GDPR
              </button>
              <button
                onClick={() => onNavigate('legal/anpc')}
                className="hover:text-white transition"
              >
                A.N.P.C.
              </button>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">
              PROTECŢIA CONSUMATORILOR - A.N.P.C. – SAL (Solutionarea Alternativa a Litigiilor)
            </p>
            <p className="text-xs text-gray-500">
              VOLCO S.R.L. | CUI: RO12345678 | J40/1234/2024 | contact@volco.ro | +40 800 123 456
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
