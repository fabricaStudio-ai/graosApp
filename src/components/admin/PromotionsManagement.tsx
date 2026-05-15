import { motion } from 'motion/react';
import { Plus, Ticket, Users, Package, ChevronRight, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useEffect, useState } from 'react';
import { subscribeCoupons } from '../../services/firestoreService';

export default function PromotionsManagement() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeCoupons((data) => {
      setCoupons(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1 font-serif italic">Incentivos & Campanhas</h2>
        <p className="text-gray-400 font-medium">Gerencie bônus contratuais, cupons de parceiros e incentivos de safra.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coupons Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif italic text-gray-900 flex items-center gap-2">
              <Ticket size={20} className="text-copper" />
              Cupons de Parceiros
            </h3>
            <button className="text-sage-600 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-sage-50 px-4 py-2 rounded-xl border border-sage-100 transition-all">
              <Plus size={16} /> Novo Cupom
            </button>
          </div>

          <div className="space-y-4">
            {coupons.map((coupon, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm",
                    coupon.status === 'Ativo' ? "bg-sage-50 text-sage-600" : "bg-gray-50 text-gray-300"
                  )}>
                    %
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-900">{coupon.code}</h4>
                    <p className="text-xs font-bold text-gray-400 truncate max-w-[150px]">Expira em: {coupon.expires}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center hidden sm:block">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Desconto</p>
                    <p className="font-black text-sage-600">{coupon.discount}</p>
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Usos</p>
                    <p className="font-bold text-gray-900">{coupon.usage}</p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                    <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-all"><ChevronRight size={16} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Loyalty & Kits Column */}
        <div className="space-y-8">
          <div className="bg-sage-900 rounded-[2.5rem] p-8 text-white organic-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Users size={20} className="text-sage-400" />
              Programa de Fidelidade
            </h4>
            <p className="text-xs text-sage-300 font-medium mb-6 leading-relaxed">Configuração global para recompensas de clientes recorrentes.</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
                <span className="text-sm font-bold">1 ponto gasto =</span>
                <span className="font-black">R$ 0,05</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
                <span className="text-sm font-bold">Resgate mínimo</span>
                <span className="font-black">500 pts</span>
              </div>
            </div>
            
            <button className="w-full bg-sage-500 text-white mt-8 py-4 rounded-2xl font-bold hover:bg-sage-600 transition-all">
              Editar Configurações
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package size={20} className="text-copper" />
              Kits Bem-Estar
            </h4>
            <div className="space-y-4">
              {[
                { name: 'Kit Imunidade', items: '3 produtos', price: 'R$ 89,00' },
                { name: 'Kit Café da Manhã', items: '5 produtos', price: 'R$ 120,00' },
              ].map((kit, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{kit.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{kit.items}</p>
                  </div>
                  <span className="font-black text-sage-600 text-sm whitespace-nowrap">{kit.price}</span>
                </div>
              ))}
              <button className="w-full border-2 border-dashed border-gray-100 text-gray-400 py-4 rounded-2xl font-bold text-sm hover:border-sage-200 hover:text-sage-600 transition-all flex items-center justify-center gap-2">
                <Plus size={18} /> Novo Kit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
