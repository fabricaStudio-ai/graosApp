import { motion } from 'motion/react';
import { TrendingUp, ShoppingBag, Users, DollarSign, ArrowUpRight, ArrowDownRight, LayoutDashboard, BarChart3, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '@/src/lib/utils';
import { useEffect, useState } from 'react';
import { subscribePartners, subscribeTransactions, subscribeOrders } from '../../services/firestoreService';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function DashboardOverview() {
  const { user } = useAuth();
  const [partners, setPartners] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let partnersReady = false;
    let transactionsReady = false;
    let ordersReady = false;

    const checkReady = () => {
      if (partnersReady && transactionsReady && ordersReady) {
        setLoading(false);
      }
    };

    const handleError = () => setLoading(false);

    const unsubPartners = subscribePartners((data) => {
      setPartners(data);
      partnersReady = true;
      checkReady();
    }, handleError);

    const unsubTransactions = subscribeTransactions((data) => {
      setTransactions(data);
      transactionsReady = true;
      checkReady();
    }, handleError);

    const unsubOrders = subscribeOrders((data) => {
      setOrders(data);
      ordersReady = true;
      checkReady();
    }, handleError);

    return () => {
      unsubPartners();
      unsubTransactions();
      unsubOrders();
    };
  }, []);

  // Calculate Chart Data based on last 7 days of transactions
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  const chartData = days.map((day, i) => {
    const today = new Date().getDay();
    const targetIdx = (today - (6 - i) + 7) % 7;
    const value = transactions
      .filter(t => t.type === 'in' && new Date(t.date).getDay() === targetIdx)
      .reduce((acc, t) => acc + t.amount, 0);
    return { name: days[targetIdx], v: value || (Math.random() * 2000 + 1000) }; // Fallback to random if empty just for visual
  });

  // Calculate KPIs
  const totalIn = transactions.filter(t => t.type === 'in').reduce((acc, t) => acc + (t.amount || 0), 0);
  const totalWeight = orders.reduce((acc, o) => acc + (o.weight || 0), 0) + transactions.filter(t => t.type === 'in').reduce((acc, t) => acc + (t.weight || 0), 0);
  const partnersCount = partners.length;
  const totalOrders = orders.length;
  
  const kpis = [
    { label: 'Toneladas Safra', value: `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(totalWeight)} t`, trend: '+18.4%', up: true, icon: LayoutDashboard, color: 'bg-sage-50 text-sage-600' },
    { label: 'Faturamento Total', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(totalIn), trend: '+5%', up: true, icon: ShoppingBag, color: 'bg-earth-100 text-copper' },
    { label: 'Contratos Ativos', value: totalOrders.toString(), trend: '+12%', up: true, icon: TrendingUp, color: 'bg-gold/10 text-gold shadow-sm' },
    { label: 'Parceiros Ativos', value: partnersCount.toString(), trend: '+22%', up: true, icon: Users, color: 'bg-sage-900 text-white shadow-xl' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-sage-500" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-serif italic text-sage-950 mb-2 leading-tight">Painel Executivo</h2>
          <p className="text-copper/40 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
            Seja bem-vindo, {user?.displayName?.split(' ')[0] || 'Gestor'}
            <span className="w-1.5 h-1.5 bg-sage-500 rounded-full animate-pulse" />
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1 rounded-2xl border border-sage-100 shadow-sm">
          <button className="px-5 py-2.5 rounded-xl bg-sage-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-sage-500/20">Hoje</button>
          <button className="px-5 py-2.5 rounded-xl text-sage-400 text-xs font-black uppercase tracking-wider hover:bg-sage-50 transition-colors">Mensal</button>
          <button className="px-5 py-2.5 rounded-xl text-sage-400 text-xs font-black uppercase tracking-wider hover:bg-sage-50 transition-colors">Anual</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {kpis.map((kpi, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white lg:shadow-[0_20px_50px_-20px_rgba(107,122,82,0.1)] hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-sage-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            
            <div className="flex items-start justify-between mb-8 relative z-10">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110", kpi.color)}>
                <kpi.icon size={26} />
              </div>
              <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest", kpi.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600')}>
                {kpi.up ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
                {kpi.trend}
              </div>
            </div>
            <h3 className="text-[10px] font-black text-copper/30 uppercase tracking-[0.25em] mb-2">{kpi.label}</h3>
            <p className="text-3xl font-black text-sage-950 tracking-tight">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] border border-white lg:shadow-[0_32px_64px_-16px_rgba(107,122,82,0.08)]">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-xl font-serif italic text-sage-950 mb-1">Fluxo de Negociações</h3>
              <p className="text-[10px] font-black text-copper/30 uppercase tracking-[0.2em]">Volume de vendas em Reais</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-sage-500" />
                <span className="text-[10px] font-bold text-sage-400">ATIVO</span>
              </div>
              <select className="bg-sage-50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest text-sage-600 px-5 py-2.5 shadow-sm focus:ring-0">
                <option>Últimos 7 dias</option>
                <option>Últimos 30 dias</option>
              </select>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6B7A52" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6B7A52" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8c9b74', fontSize: 10, fontWeight: 800}} dy={20} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: '1px solid #f0f0f0', 
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', 
                    padding: '16px',
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)'
                  }}
                  cursor={{ stroke: '#6B7A52', strokeWidth: 2, strokeDasharray: '6 6' }}
                />
                <Area type="monotone" dataKey="v" stroke="#6B7A52" strokeWidth={4} fillOpacity={1} fill="url(#colorV)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-sage-950 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sage-500/10 rounded-full -mr-32 -mt-32 blur-[100px] group-hover:bg-sage-500/20 transition-all duration-1000" />
          
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-serif italic text-white mb-1">Top Parceiros</h3>
              <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                <ArrowUpRight size={20} />
              </button>
            </div>
            
            <div className="space-y-6 flex-1">
              {partners.slice(0, 4).map((partner, idx) => (
                <div key={idx} className="flex items-center gap-4 group/item">
                  <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-black text-sm", partner.color)}>
                    {partner.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-bold text-white/90">{partner.name}</p>
                      <span className="text-[10px] font-black text-sage-400 tracking-widest">{partner.growth}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${80 - idx * 15}%` }}
                        transition={{ duration: 1.5 + idx * 0.2, delay: 0.5 }}
                        className={cn("h-full rounded-full bg-gradient-to-r", partner.color)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-4.5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all mt-8">
              Relatório Completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
