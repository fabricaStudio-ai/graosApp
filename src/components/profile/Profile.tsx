import { motion } from 'motion/react';
import { User as UserIcon, Award, Ticket, Settings, ChevronRight, LogOut, Heart, MapPin, Bell } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function Profile() {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const points = userData?.points || 0;
  const nextReward = 500;
  const percentage = Math.min((points / nextReward) * 100, 100);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      };
      fetchUserData();
    }
  }, [user]);

  return (
    <div className="min-h-screen pb-32 px-6 pt-8">
      {/* User Header */}
      <div className="flex flex-col items-center mb-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-[2.5rem] bg-sage-500 flex items-center justify-center border-4 border-white organic-shadow mb-4 overflow-hidden text-white"
        >
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="User profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <UserIcon size={48} />
          )}
        </motion.div>
        <h2 className="text-xl font-extrabold text-sage-900">{user?.displayName || 'Usuário'}</h2>
        <p className="text-sm text-sage-400 font-bold uppercase tracking-widest">
          {userData?.type === 'premium' ? 'Membro Premium' : 'Membro Standard'}
        </p>
      </div>

      {/* Loyalty / Health Points Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[2.5rem] p-6 organic-shadow mb-8 border border-sage-50"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center text-sage-600">
              <Award size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-sage-900 leading-none">Pontos de Saúde</h3>
              <p className="text-[10px] text-sage-400 font-bold uppercase mt-1">Fidelidade Tas Grãos</p>
            </div>
          </div>
          <p className="text-2xl font-black text-sage-600">{points}</p>
        </div>

        <div className="relative h-3 bg-sage-50 rounded-full mb-4 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-y-0 left-0 bg-sage-500 rounded-full"
          />
        </div>
        
        <div className="flex justify-between items-center text-[11px] font-bold">
          <span className="text-sage-400 uppercase tracking-wider">Faltam {nextReward - points} pontos</span>
          <span className="text-sage-600">Próxima Recompensa: R$ 20 OFF</span>
        </div>
      </motion.div>

      {/* Coupons Section */}
      <section className="mb-8">
        <h3 className="text-lg font-bold text-sage-900 mb-6 flex items-center gap-2">
          <Ticket size={20} className="text-gold" />
          Meus Cupons
        </h3>
        <div className="space-y-4">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden bg-white rounded-3xl p-5 border-l-8 border-copper organic-shadow flex items-center justify-between"
          >
            <div>
              <h4 className="text-sm font-extrabold text-sage-900 mb-1">CLIENTE FIEL</h4>
              <p className="text-xs text-sage-500 font-medium">Ganhe 10% OFF em grãos e sementes.</p>
            </div>
            <div className="bg-copper/10 px-3 py-2 rounded-xl">
              <span className="text-xs font-black text-copper">USAREI</span>
            </div>
          </motion.div>

          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden bg-white rounded-3xl p-5 border-l-8 border-gold/40 organic-shadow flex items-center justify-between opacity-60"
          >
            <div>
              <h4 className="text-sm font-extrabold text-sage-900 mb-1">PRIMEIRACOMPRA</h4>
              <p className="text-xs text-sage-500 font-medium whitespace-nowrap">Código já utilizado.</p>
            </div>
            <div className="bg-sage-50 px-3 py-2 rounded-xl">
              <span className="text-xs font-black text-sage-300">USADO</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Settings */}
      <section className="bg-white rounded-[2.5rem] p-4 organic-shadow">
        {[
          { icon: Heart, label: 'Produtos Favoritos', color: 'text-red-400' },
          { icon: MapPin, label: 'Endereços de Entrega', color: 'text-sage-400' },
          { icon: Bell, label: 'Notificações', color: 'text-sage-400' },
          { icon: Settings, label: 'Configurações', color: 'text-sage-400' },
        ].map((item, idx) => (
          <button 
            key={idx}
            className="w-full flex items-center justify-between p-4 hover:bg-sage-50 transition-colors rounded-2xl group"
          >
            <div className="flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center", item.color)}>
                <item.icon size={20} />
              </div>
              <span className="text-sm font-bold text-sage-800">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-sage-200 group-hover:text-sage-400 transition-colors" />
          </button>
        ))}
        <button 
          onClick={() => logout()}
          className="w-full flex items-center gap-4 p-4 mt-2 text-red-500/60 font-bold text-sm hover:bg-red-50 rounded-2xl transition-colors"
        >
          <LogOut size={20} />
          Sair da Conta
        </button>
      </section>
    </div>
  );
}
