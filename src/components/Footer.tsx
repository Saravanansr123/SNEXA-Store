import { Facebook, Instagram, Twitter } from 'lucide-react';
import ShiningTextSection from "../components/ShiningTextSection";
interface FooterProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const Footer = ({ onNavigate }: FooterProps) => {
  return (
    <footer className="bg-black border-t border-black-200">
      {/* ================= ShiningTextSection (NEW) ================= */}
      <ShiningTextSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl text-white font-light tracking-wider mb-4">SNEXA</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Premium fashion for everyone. Discover the latest trends and timeless classics.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <button onClick={() => onNavigate('products', { category: 'womens' })} className="hover:text-rose-400 transition-colors">
                  Womens
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products', { category: 'mens' })} className="hover:text-rose-400 transition-colors">
                  Mens
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products', { category: 'kids' })} className="hover:text-rose-400 transition-colors">
                  Kids
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products', { category: 'maternity' })} className="hover:text-rose-400 transition-colors">
                  Maternity
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <button className="hover:text-rose-400 transition-colors">Contact Us</button>
              </li>
              <li>
                <button className="hover:text-rose-400 transition-colors">Shipping & Returns</button>
              </li>
              <li>
                <button className="hover:text-rose-400 transition-colors">Size Guide</button>
              </li>
              <li>
                <button className="hover:text-rose-400 transition-colors">FAQ</button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-full hover:bg-rose-50 hover:text-rose-400 transition-all shadow-sm"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-full hover:bg-rose-50 hover:text-rose-400 transition-all shadow-sm"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-full hover:bg-rose-50 hover:text-rose-400 transition-all shadow-sm"
              >
                <Twitter size={20} />
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Subscribe to our newsletter for exclusive offers and updates.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>&copy; 2025 SNEXA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
