import { useState, useEffect } from 'react';
import { ArrowRight, TrendingUp, Sparkles } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

const heroImages = [
  'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'https://images.pexels.com/photos/3682293/pexels-photo-3682293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'https://images.pexels.com/photos/1300550/pexels-photo-1300550.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
];

export const HomePage = ({ onNavigate }: HomePageProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    {
      name: 'Womens',
      slug: 'womens',
      image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Elegant & Timeless',
    },
    {
      name: 'Mens',
      slug: 'mens',
      image: 'https://images.pexels.com/photos/2897883/pexels-photo-2897883.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Modern & Sophisticated',
    },
    {
      name: 'Kids',
      slug: 'kids',
      image: 'https://images.pexels.com/photos/7869083/pexels-photo-7869083.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Playful & Comfortable',
    },
    {
      name: 'Maternity',
      slug: 'maternity',
      image: 'https://images.pexels.com/photos/3807758/pexels-photo-3807758.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Comfortable & Stylish',
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative h-[85vh] overflow-hidden bg-gradient-to-br from-rose-50 via-white to-amber-50">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-4xl mx-auto">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ${
                  index === currentImageIndex
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-95'
                }`}
              >
                <img
                  src={image}
                  alt={`Hero ${index + 1}`}
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-rose-400 animate-fade-in">
            <Sparkles size={16} />
            New Collection
          </div>

          <h1 className="text-5xl md:text-7xl font-light tracking-wide mb-6 animate-fade-in-up text-gray-800">
            Fall Winter <span className="font-normal">2025</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl animate-fade-in-up animation-delay-200 leading-relaxed">
            Discover the latest trends and timeless classics in our new seasonal collection
          </p>

          <button
            onClick={() => onNavigate('products')}
            className="group px-8 py-4 bg-rose-400 text-white rounded-full hover:bg-rose-500 transition-all transform hover:scale-105 hover:shadow-lg flex items-center gap-2 font-medium animate-fade-in-up animation-delay-400"
          >
            Shop Now
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImageIndex
                  ? 'bg-rose-400 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light mb-4 flex items-center justify-center gap-3">
            <TrendingUp className="text-rose-400" />
            Shop by Category
          </h2>
          <p className="text-gray-600">Explore our curated collections</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.slug}
              onClick={() => onNavigate('products', { category: category.slug })}
              className="group relative overflow-hidden rounded-2xl cursor-pointer transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <div className="aspect-[3/4] relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-light mb-1 group-hover:translate-y-[-4px] transition-transform">
                  {category.name}
                </h3>
                <p className="text-sm text-white/80 mb-3">{category.description}</p>
                <div className="flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore Collection
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-rose-50 to-amber-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-light mb-6">Premium Quality, Timeless Style</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Every piece in our collection is carefully curated to bring you the perfect blend of comfort,
                style, and quality. From everyday essentials to statement pieces, find everything you need
                to express your unique style.
              </p>
              <button
                onClick={() => onNavigate('products')}
                className="px-8 py-3 bg-rose-400 text-white rounded-full hover:bg-rose-500 transition-all transform hover:scale-105 font-medium inline-flex items-center gap-2"
              >
                Discover More
                <ArrowRight size={18} />
              </button>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3755755/pexels-photo-3755755.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Fashion"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};
