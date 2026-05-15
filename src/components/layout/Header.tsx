import { motion } from 'motion/react';
import { ShoppingCart, Search, User, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ onCartClick, cartCount }: { onCartClick: () => void, cartCount: number }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full glass px-6 pt-8 pb-4 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3.5"
        >
          <div className="w-12 h-12 rounded-2xl bg-sage-500 flex items-center justify-center shadow-lg shadow-sage-500/10 border-2 border-white ring-4 ring-sage-50 overflow-hidden">
             {user?.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
             ) : (
                <User size={24} className="text-white" />
             )}
          </div>
          <div>
            <p className="text-[10px] text-copper/40 font-black uppercase tracking-[0.2em]">Parceiro Agro</p>
            <h1 className="text-md font-black text-sage-950 leading-none truncate max-w-[120px]">
              {user?.displayName?.split(' ')[0] || 'Produtor'}
            </h1>
          </div>
        </motion.div>

        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-2xl bg-white border border-sage-100 transition-all text-sage-400 relative hover:shadow-md">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sage-500 rounded-full border-2 border-white" />
          </button>
          <button 
            onClick={onCartClick}
            className="p-2.5 rounded-2xl bg-sage-950 transition-all text-white relative hover:bg-black shadow-lg shadow-sage-950/20"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-white text-[10px] font-black flex items-center justify-center rounded-xl border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative group"
      >
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-sage-300">
          <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Buscar sementes, grãos ou insumos..." 
          className="w-full bg-white/60 border border-sage-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-sage-900 placeholder:text-sage-300 focus:ring-4 focus:ring-sage-500/5 focus:bg-white focus:shadow-lg transition-all outline-none"
        />
      </motion.div>
    </header>
  );
}
