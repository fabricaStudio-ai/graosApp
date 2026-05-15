import { motion } from 'motion/react';
import { Briefcase, Sprout, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { cn } from '@/src/lib/utils';

export default function ProfileSelection() {
  const { setRole, user } = useAuth();

  return (
    <div className="min-h-screen bg-earth-50 relative overflow-hidden flex flex-col items-center justify-center px-6 py-12">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale-[40%] opacity-10"
          style={{ backgroundImage: 'url("https://images.pexels.com/photos/259280/pexels-photo-259280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-earth-50 via-earth-50/90 to-sage-500/10" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-10 h-10 bg-sage-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-sage-500/20">
              <span className="text-lg font-black tracking-tighter">TAS</span>
            </div>
            <span className="text-lg font-medium tracking-[0.2em] text-copper uppercase">Grãos</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-serif italic text-sage-950 mb-4 tracking-tight">
            Olá, <span className="text-sage-600">{user?.displayName?.split(' ')[0] || 'Produtor'}</span>
          </h1>
          <p className="text-copper/60 font-medium text-lg leading-relaxed">
            Como você deseja navegar na plataforma hoje?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Manager Card */}
          <motion.button
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setRole('manager')}
            className="group relative bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/60 shadow-xl shadow-sage-950/5 text-left transition-all overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-sage-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center text-sage-600 mb-8 group-hover:bg-sage-600 group-hover:text-white transition-all duration-500">
              <ShieldCheck size={32} />
            </div>
            
            <h3 className="text-2xl font-serif italic text-sage-950 mb-3 group-hover:text-sage-600 transition-colors">Gestor</h3>
            <p className="text-copper/60 font-medium text-sm leading-relaxed mb-8">
              Acesse o painel administrativo e gerencie toda operação da TAS Grãos com visão analítica completa.
            </p>
            
            <div className="flex items-center gap-2 text-sage-700 font-black uppercase text-[10px] tracking-widest">
              Acessar Painel
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>

          {/* Client Card */}
          <motion.button
             whileHover={{ y: -8, scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             onClick={() => setRole('client')}
            className="group relative bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/60 shadow-xl shadow-sage-950/5 text-left transition-all overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="w-16 h-16 bg-earth-100 rounded-2xl flex items-center justify-center text-copper mb-8 group-hover:bg-copper group-hover:text-white transition-all duration-500">
              <Sprout size={32} />
            </div>
            
            <h3 className="text-2xl font-serif italic text-sage-950 mb-3 group-hover:text-copper transition-colors">Cliente</h3>
            <p className="text-copper/60 font-medium text-sm leading-relaxed mb-8">
              Explore produtos selecionados, promoções exclusivas e gerencie suas negociações agrícolas.
            </p>
            
            <div className="flex items-center gap-2 text-copper font-black uppercase text-[10px] tracking-widest">
              Explorar Loja
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        </div>

        <div className="mt-20 text-center opacity-30">
          <p className="text-[10px] uppercase tracking-[0.4em] font-black text-copper">
            TAS Grãos • Seleção de Ambiente Seguro
          </p>
        </div>
      </motion.div>
    </div>
  );
}
