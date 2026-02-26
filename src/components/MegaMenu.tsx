import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface MegaMenuProps {
  onNavigate: (page: string, slug?: string) => void;
}

interface SubCategory {
  name: string;
  slug: string;
  items?: string[];
}

interface MenuCategory {
  name: string;
  slug: string;
  icon: string;
  subcategories: SubCategory[];
  featured?: string[];
}

const menuData: MenuCategory[] = [
  {
    name: 'Telefoane & Tablete',
    slug: 'telefoane-tablete',
    icon: '📱',
    subcategories: [
      {
        name: 'Telefoane Mobile',
        slug: 'telefoane-mobile',
        items: ['iPhone', 'Samsung Galaxy', 'Xiaomi', 'OPPO', 'OnePlus', 'Google Pixel']
      },
      {
        name: 'Tablete',
        slug: 'tablete',
        items: ['iPad', 'Samsung Tab', 'Huawei MatePad', 'Lenovo Tab']
      },
      {
        name: 'Accesorii Telefoane',
        slug: 'accesorii-telefoane',
        items: ['Huse', 'Folii protectie', 'Incarcatoare', 'Casti wireless', 'Suporturi auto']
      },
      {
        name: 'Smartwatch-uri',
        slug: 'smartwatch-uri',
        items: ['Apple Watch', 'Samsung Galaxy Watch', 'Huawei Watch', 'Xiaomi Mi Band']
      }
    ],
    featured: ['iPhone 15 Pro Max', 'Samsung S24 Ultra', 'iPad Pro']
  },
  {
    name: 'Laptopuri',
    slug: 'laptopuri',
    icon: '💻',
    subcategories: [
      {
        name: 'Laptopuri Gaming',
        slug: 'laptopuri-gaming',
        items: ['ASUS ROG', 'MSI Gaming', 'Lenovo Legion', 'Acer Predator', 'HP Omen']
      },
      {
        name: 'Laptopuri Business',
        slug: 'laptopuri-business',
        items: ['Dell Latitude', 'HP EliteBook', 'Lenovo ThinkPad', 'ASUS ExpertBook']
      },
      {
        name: 'Ultrabook-uri',
        slug: 'ultrabook-uri',
        items: ['MacBook Air', 'Dell XPS', 'HP Spectre', 'ASUS ZenBook']
      },
      {
        name: 'Accesorii Laptop',
        slug: 'accesorii-laptop',
        items: ['Genti laptop', 'Mouse-uri', 'Standuri', 'Coolere', 'Docking station']
      }
    ],
    featured: ['MacBook Pro M3', 'ASUS ROG Strix', 'Dell XPS 15']
  },
  {
    name: 'Calculatoare & Componente',
    slug: 'calculatoare-componente',
    icon: '🖥️',
    subcategories: [
      {
        name: 'Desktop PC',
        slug: 'desktop-pc',
        items: ['PC Gaming', 'PC Office', 'Workstation', 'Mini PC']
      },
      {
        name: 'Placi Video',
        slug: 'placi-video',
        items: ['NVIDIA RTX 4090', 'RTX 4080', 'RTX 4070', 'AMD Radeon']
      },
      {
        name: 'Procesoare',
        slug: 'procesoare',
        items: ['Intel Core i9', 'Intel Core i7', 'AMD Ryzen 9', 'AMD Ryzen 7']
      },
      {
        name: 'Memorii RAM',
        slug: 'memorii-ram',
        items: ['DDR5', 'DDR4', 'Corsair', 'Kingston', 'G.Skill']
      },
      {
        name: 'Placi de baza',
        slug: 'placi-baza',
        items: ['ASUS', 'MSI', 'Gigabyte', 'ASRock']
      },
      {
        name: 'SSD & HDD',
        slug: 'ssd-hdd',
        items: ['SSD NVMe', 'SSD SATA', 'HDD', 'SSD Extern']
      }
    ],
    featured: ['RTX 4090', 'Intel i9-14900K', 'AMD Ryzen 9 7950X']
  },
  {
    name: 'TV & Audio-Video',
    slug: 'tv-audio-video',
    icon: '📺',
    subcategories: [
      {
        name: 'Televizoare',
        slug: 'televizoare',
        items: ['TV 4K', 'TV 8K', 'TV OLED', 'TV QLED', 'Smart TV']
      },
      {
        name: 'Soundbar-uri',
        slug: 'soundbar-uri',
        items: ['Samsung Soundbar', 'LG Soundbar', 'Sony Soundbar', 'Bose']
      },
      {
        name: 'Boxe',
        slug: 'boxe',
        items: ['Boxe portabile', 'Sisteme audio', 'Boxe inteligente', 'Subwoofer']
      },
      {
        name: 'Casti',
        slug: 'casti',
        items: ['Casti over-ear', 'Casti in-ear', 'Casti gaming', 'Casti sport']
      },
      {
        name: 'Proiectoare',
        slug: 'proiectoare',
        items: ['Proiectoare 4K', 'Proiectoare gaming', 'Proiectoare business']
      }
    ],
    featured: ['Samsung OLED 77"', 'LG C3', 'Sony Bravia XR']
  },
  {
    name: 'Gaming',
    slug: 'gaming',
    icon: '🎮',
    subcategories: [
      {
        name: 'Console',
        slug: 'console',
        items: ['PlayStation 5', 'Xbox Series X', 'Nintendo Switch', 'Steam Deck']
      },
      {
        name: 'Jocuri Console',
        slug: 'jocuri-console',
        items: ['PS5 Games', 'Xbox Games', 'Switch Games']
      },
      {
        name: 'Accesorii Gaming',
        slug: 'accesorii-gaming',
        items: ['Controller', 'Volan gaming', 'Scaune gaming', 'Birou gaming']
      },
      {
        name: 'Monitoare Gaming',
        slug: 'monitoare-gaming',
        items: ['144Hz', '240Hz', '4K Gaming', 'Ultrawide', 'Curved']
      }
    ],
    featured: ['PS5 Slim', 'Xbox Series X', 'ASUS ROG Monitor']
  },
  {
    name: 'Electrocasnice',
    slug: 'electrocasnice',
    icon: '🏠',
    subcategories: [
      {
        name: 'Mari',
        slug: 'electrocasnice-mari',
        items: ['Frigidere', 'Masini de spalat', 'Cuptoare', 'Aragaze', 'Uscatoare']
      },
      {
        name: 'Mici',
        slug: 'electrocasnice-mici',
        items: ['Aspiratoare', 'Cafetiere', 'Blendere', 'Mixere', 'Roboți de bucătărie']
      },
      {
        name: 'Aer Conditionat',
        slug: 'aer-conditionat',
        items: ['AC Split', 'AC Portabil', 'AC Inverter']
      },
      {
        name: 'Ingrijire personala',
        slug: 'ingrijire-personala',
        items: ['Aparate de ras', 'Uscatoare de par', 'Placi de indreptat', 'Epilatoare']
      }
    ],
    featured: ['Samsung Family Hub', 'Dyson V15', 'Philips Airfryer']
  },
  {
    name: 'Parfumuri & Cosmetice',
    slug: 'parfumuri-cosmetice',
    icon: '💄',
    subcategories: [
      {
        name: 'Parfumuri Femei',
        slug: 'parfumuri-femei',
        items: ['Chanel', 'Dior', 'Lancome', 'Versace', 'Calvin Klein']
      },
      {
        name: 'Parfumuri Barbati',
        slug: 'parfumuri-barbati',
        items: ['Dior Sauvage', 'Bleu de Chanel', 'Armani Code', 'Paco Rabanne']
      },
      {
        name: 'Cosmetice',
        slug: 'cosmetice',
        items: ['Machiaj', 'Ingrijire ten', 'Ingrijire corp', 'Ingrijire par']
      },
      {
        name: 'Seturi cadou',
        slug: 'seturi-cadou',
        items: ['Seturi parfum', 'Seturi cosmetice', 'Seturi barbierit']
      }
    ],
    featured: ['Dior Sauvage', 'Chanel No 5', 'Lancome La Vie Est Belle']
  },
  {
    name: 'Fashion & Accesorii',
    slug: 'fashion-accesorii',
    icon: '👔',
    subcategories: [
      {
        name: 'Imbracaminte',
        slug: 'imbracaminte',
        items: ['Haine barbati', 'Haine femei', 'Haine copii', 'Haine sport']
      },
      {
        name: 'Incaltaminte',
        slug: 'incaltaminte',
        items: ['Adidasi', 'Pantofi eleganti', 'Sandale', 'Ghete', 'Incaltaminte sport']
      },
      {
        name: 'Accesorii',
        slug: 'accesorii-fashion',
        items: ['Ceasuri', 'Genti', 'Portofele', 'Ochelari', 'Curele', 'Esarfe']
      },
      {
        name: 'Bijuterii',
        slug: 'bijuterii',
        items: ['Inele', 'Coliere', 'Bratari', 'Cercei']
      }
    ],
    featured: ['Nike Air Max', 'Adidas Ultraboost', 'Guess Bags']
  },
  {
    name: 'Rechizite Școlare',
    slug: 'rechizite-scolare',
    icon: '📚',
    subcategories: [
      {
        name: 'Ghiozdane & Genți',
        slug: 'ghiozdane-genti',
        items: ['Ghiozdane școlare', 'Rucsacuri', 'Genți sport', 'Penar']
      },
      {
        name: 'Cărți & Caiete',
        slug: 'carti-caiete',
        items: ['Caiete dictando', 'Caiete matematică', 'Agende', 'Carnete notițe', 'Registre']
      },
      {
        name: 'Instrumente de Scris',
        slug: 'instrumente-scris',
        items: ['Pixuri', 'Creioane', 'Markere', 'Stabilo', 'Corectoare', 'Stilouri']
      },
      {
        name: 'Papetărie',
        slug: 'papetarie',
        items: ['Hârtie', 'Bibliorafturi', 'Dosare', 'Folii protectie', 'Etichete']
      },
      {
        name: 'Accesorii Școlare',
        slug: 'accesorii-scolare',
        items: ['Rigle', 'Compas', 'Echer', 'Radiere', 'Ascutitori', 'Capsator']
      },
      {
        name: 'Artă & Desen',
        slug: 'arta-desen',
        items: ['Creioane colorate', 'Acuarele', 'Pensule', 'Plastilină', 'Foi desen']
      }
    ],
    featured: ['Ghiozdan Star Wars', 'Set Creioane Faber-Castell', 'Caiet A4 Oxford']
  }
];

export default function MegaMenu({ onNavigate }: MegaMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="relative">
      <div className="flex items-center gap-6">
        {menuData.map((category) => (
          <div
            key={category.slug}
            className="relative group"
            onMouseEnter={() => setActiveCategory(category.slug)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <button
              onClick={() => onNavigate('category', category.slug)}
              className="flex items-center gap-2 py-4 text-gray-700 hover:text-red-600 font-medium transition-colors"
            >
              <span className="text-xl">{category.icon}</span>
              <span>{category.name}</span>
            </button>

            {activeCategory === category.slug && (
              <div className="absolute left-0 top-full w-screen max-w-7xl bg-white shadow-2xl border-t-4 border-red-600 z-50 animate-fadeIn">
                <div className="p-8">
                  <div className="grid grid-cols-4 gap-8">
                    {category.subcategories.map((subcat) => (
                      <div key={subcat.slug}>
                        <button
                          onClick={() => onNavigate('category', subcat.slug)}
                          className="font-bold text-gray-900 hover:text-red-600 mb-3 flex items-center gap-1 group/item"
                        >
                          {subcat.name}
                          <ChevronRight size={16} className="group-hover/item:translate-x-1 transition-transform" />
                        </button>
                        {subcat.items && (
                          <ul className="space-y-2">
                            {subcat.items.map((item) => (
                              <li key={item}>
                                <button
                                  onClick={() => onNavigate('products')}
                                  className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                                >
                                  {item}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>

                  {category.featured && category.featured.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-bold text-gray-900 mb-3">Produse Populare</h4>
                      <div className="flex gap-4">
                        {category.featured.map((item) => (
                          <button
                            key={item}
                            onClick={() => onNavigate('products')}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
