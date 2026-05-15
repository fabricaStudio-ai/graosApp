import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { subscribeCategories } from '../../services/firestoreService';
import * as LucideIcons from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeCategories((data) => {
      setCategories(data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <section className="px-6 py-6 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-serif italic text-sage-950 leading-none">Negócios</h3>
        <button className="text-sage-500 text-xs font-black uppercase tracking-widest">Ver Tudo</button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar">
        {categories.map((cat, idx) => {
          // Dynamic icon resolution
          const IconName = cat.icon as keyof typeof LucideIcons;
          const Icon = (LucideIcons[IconName] as React.ElementType) || LucideIcons.Package;
          
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="flex flex-col items-center gap-4 min-w-[84px] group"
            >
              <div className={cn(
                "w-20 h-20 rounded-[2rem] flex items-center justify-center border-2 border-white shadow-xl shadow-sage-950/5 transition-all duration-500 group-hover:-translate-y-2 group-active:scale-95 group-hover:shadow-2xl",
                cat.color
              )}>
                <Icon size={28} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-sage-800 text-center">{cat.name}</span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
