import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { ShoppingCart, MessageCircle, Star, ShieldCheck, Zap, Leaf, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { subscribeProducts, subscribeCategories } from '../../services/firestoreService';

export default function Catalog({ onProductSelect }: { onProductSelect?: (p: any) => void }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let prodsReady = false;
    let catsReady = false;

    const unsubProds = subscribeProducts((data) => {
      setProducts(data);
      prodsReady = true;
      if (catsReady) setLoading(false);
    });

    const unsubCats = subscribeCategories((data) => {
      setCategories([{ id: 'all', name: 'Todos' }, ...data]);
      catsReady = true;
      if (prodsReady) setLoading(false);
    });

    return () => {
      unsubProds();
      unsubCats();
    };
  }, []);

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory || p.category === categories.find(c => c.id === activeCategory)?.name);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-sage-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Category Bar */}
      <div className="sticky top-[136px] z-40 bg-earth-50/80 backdrop-blur-md px-6 py-4 border-b border-sage-100 overflow-x-auto no-scrollbar">
        <div className="flex gap-3 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-5 py-2.5 rounded-2xl text-xs font-bold transition-all active:scale-95",
                activeCategory === cat.id 
                  ? "bg-sage-600 text-white organic-shadow" 
                  : "bg-white text-sage-400 hover:text-sage-600 border border-sage-100"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <section className="px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-sage-900 leading-none">Resultados ({filteredProducts.length})</h2>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-white border border-sage-100 flex items-center justify-center text-sage-400">
              <Zap size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-10">
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onProductSelect?.(product)}
              className="group flex flex-col cursor-pointer"
            >
              {/* Product Card Container */}

              <div className="relative flex-1 mb-4">
                <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden organic-shadow bg-white relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <div className={cn(
                      "px-2 py-1 rounded-lg text-[8px] font-bold uppercase tracking-widest flex items-center gap-1 organic-shadow",
                      product.badgeType === 'gold' ? "bg-white/90 text-gold" : 
                      product.badgeType === 'copper' ? "bg-white/90 text-copper" : "bg-sage-500 text-white"
                    )}>
                      {product.badgeType === 'gold' ? <Star size={10} className="fill-gold" /> : <ShieldCheck size={10} />}
                      {product.badge}
                    </div>
                  </div>

                  {/* Actions Over Image */}
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-4 right-4 w-9 h-9 glass text-sage-600 rounded-2xl flex items-center justify-center transition-all"
                  >
                    <MessageCircle size={18} />
                  </motion.button>

                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-4 right-4 w-12 h-12 bg-sage-600 text-white rounded-3xl flex items-center justify-center organic-shadow transition-all"
                  >
                    <ShoppingCart size={22} />
                  </motion.button>
                </div>
              </div>

              {/* Product Info */}
              <div className="px-1">
                <div className="flex items-center gap-1.5 mb-2">
                  <Leaf size={12} className="text-sage-400" />
                  <span className="text-[10px] font-bold text-sage-400 uppercase tracking-wider">
                    {categories.find(c => c.id === product.category)?.name}
                  </span>
                </div>
                <h4 className="text-base font-bold text-sage-900 leading-snug mb-1.5 line-clamp-2 min-h-[44px]">
                  {product.name}
                </h4>
                <p className="text-[11px] text-sage-500 font-medium leading-relaxed mb-3 line-clamp-2 h-8">
                  {product.benefit}
                </p>
                <p className="text-lg font-bold text-sage-600">{product.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
