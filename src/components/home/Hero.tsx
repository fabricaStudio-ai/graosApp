import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative px-6 pt-10 pb-16 overflow-hidden">
      <div className="relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-sage-500/5 border border-sage-500/10 text-sage-600 font-black text-[10px] tracking-[0.2em] uppercase mb-8"
        >
          <Sparkles size={14} className="text-gold" />
          Tecnologia & Confiança no Campo
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-[2.75rem] font-serif italic text-sage-950 leading-[1.1] mb-6 tracking-tight"
        >
          Conectando o agro <br />
          <span className="text-sage-600">ao futuro do Brasil</span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-copper/60 font-medium leading-relaxed mb-10 max-w-[320px] text-lg"
        >
          Alta performance em grãos e sementes selecionadas no coração do agronegócio.
        </motion.p>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.3 }}
           className="flex items-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-sage-600 text-white px-10 py-5 rounded-[1.5rem] flex items-center gap-3 shadow-xl shadow-sage-600/20 font-black uppercase text-xs tracking-widest transition-all"
          >
            Ver Catálogo
            <ArrowRight size={20} />
          </motion.button>
          
          <button className="w-14 h-14 rounded-[1.5rem] border-2 border-sage-100 flex items-center justify-center text-sage-600 hover:bg-sage-50 transition-colors">
            <ArrowRight size={24} className="-rotate-45" />
          </button>
        </motion.div>
      </div>

      {/* Decorative background elements - Premium Agro Style */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-sage-500/20 rounded-full blur-[100px]"
      />
      
      <div className="absolute top-20 right-[-15%] w-72 h-72 opacity-20 pointer-events-none rotate-[15deg] grayscale transition-all duration-1000">
        <img 
          src="https://images.pexels.com/photos/259280/pexels-photo-259280.jpeg?auto=format&fit=crop&q=80&w=800" 
          alt="Agriculture"
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
    </section>
  );
}
