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
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-5 py-2 rounded-xl font-black text-2xl mb-4 inline-block shadow-lg">
              VOLCO
            </div>
            <p className="text-gray-400 mb-4">
              Magazinul tău de încredere pentru electronice, tehnologie și lifestyle premium.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-red-600 transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-red-600 transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-red-600 transition">
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
                <span>+40 123 456 789</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} />
                <span>contact@volco.ro</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2024 VOLCO. Toate drepturile rezervate.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <button className="hover:text-white transition">Cookies</button>
            <button className="hover:text-white transition">Protecția Datelor</button>
            <button className="hover:text-white transition">GDPR</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
