import { motion } from 'motion/react';
import { Gift, ArrowRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { subscribeProducts } from '../../services/firestoreService';

export default function WellnessKits() {
  const [kits, setKits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeProducts((data) => {
      const filteredKits = data.filter(p => p.category === 'Kits');
      setKits(filteredKits.length > 0 ? filteredKits : data.slice(0, 2)); // Fallback to first products if no kits
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null;
  return (
    <section className="px-6 py-8 pb-32">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-sage-900 leading-none">Kits Bem-Estar</h3>
        <button className="flex items-center gap-1 text-sage-500 text-sm font-bold">
          Ver mais
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {kits.map((kit, idx) => (
          <motion.div
            key={kit.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + (0.1 * idx) }}
            className="group relative overflow-hidden rounded-[2.5rem] organic-shadow bg-white flex flex-col"
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={kit.image} 
                alt={kit.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl glass text-sage-900 text-[10px] font-bold uppercase tracking-widest">
                <Gift size={14} className="text-gold" />
                Combo Especial
              </div>
            </div>
            
            <div className="p-6">
              <h4 className="text-lg font-bold text-sage-900 mb-1">{kit.name}</h4>
              <p className="text-xs text-sage-400 font-medium mb-4">{kit.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-sage-600">{kit.price}</span>
                <button className="bg-sage-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold organic-shadow active:scale-95 transition-all">
                  Quero este Kit
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
