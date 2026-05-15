import { motion } from 'motion/react';
import { Star, Plus, ShieldCheck, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { subscribeProducts } from '../../services/firestoreService';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeProducts((data) => {
      setProducts(data.slice(0, 4)); // Show only first 4 on home
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-sage-500" size={32} />
      </div>
    );
  }

  return (
    <section className="px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-serif italic text-sage-950 leading-none">Oportunidades</h3>
        <button className="text-sage-500 text-xs font-black uppercase tracking-widest">Negociar Todos</button>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-10">
        {products.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx, duration: 0.8 }}
            className="group"
          >
            <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden mb-5 shadow-2xl shadow-sage-950/5 bg-white border border-sage-50">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-115 grayscale-[20%] group-hover:grayscale-0"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-sage-950/80 backdrop-blur-md text-gold rounded-xl text-[8px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border border-white/10">
                <ShieldCheck size={12} strokeWidth={3} />
                {product.tag || 'Novo'}
              </div>
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-4 right-4 w-12 h-12 bg-white text-sage-950 rounded-2xl flex items-center justify-center shadow-lg transition-all border border-sage-100"
              >
                <Plus size={24} />
              </motion.button>
            </div>
            
            <div className="px-2">
              <div className="flex items-center gap-1.5 mb-2">
                <Star size={14} className="fill-gold text-gold" />
                <span className="text-[10px] font-black text-copper/40 tracking-widest uppercase">{product.rating || '5.0'} Avaliação Técnica</span>
              </div>
              <h4 className="text-md font-serif italic text-sage-950 leading-tight mb-2 line-clamp-2 h-12 group-hover:text-sage-600 transition-colors">{product.name}</h4>
              <p className="text-sm font-black text-sage-600 tracking-tight">{product.price}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
