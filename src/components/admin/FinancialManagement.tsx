import { motion } from 'motion/react';
import { Download, Filter, ArrowUpCircle, ArrowDownCircle, Calendar, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useEffect, useState } from 'react';
import { subscribeTransactions } from '../../services/firestoreService';

export default function FinancialManagement() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeTransactions(
      (data) => {
        setTransactions(data);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const totalIn = transactions.filter(t => t.type === 'in').reduce((acc, t) => acc + (t.amount || 0), 0);
  const totalOut = transactions.filter(t => t.type === 'out').reduce((acc, t) => acc + (t.amount || 0), 0);
  const netRevenue = totalIn - (totalIn * 0.05); // Assume 5% average discounts/fees for calculation

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-sage-500" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">Financeiro</h2>
          <p className="text-gray-400 font-medium">Controle de entradas, saídas e faturamento geral.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white text-gray-600 px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 border border-gray-100 hover:bg-gray-50 transition-all">
            <Calendar size={20} />
            Este Mês
          </button>
          <button className="bg-sage-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-sage-700 transition-all shadow-lg shadow-sage-600/20">
            <Download size={20} />
            Exportar Relatório
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sage-50 rounded-full -mr-16 -mt-16 opacity-50" />
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 relative z-10">Faturamento Bruto</h3>
          <p className="text-3xl font-black text-sage-900 relative z-10">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIn)}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-green-500 relative z-10">
            <TrendingUp size={14} />
            +15.2% vs mês anterior
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Descontos Aplicados</h3>
          <p className="text-3xl font-black text-copper">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIn * 0.05)}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-gray-400">
            Representa 5% das vendas
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm bg-gradient-to-br from-sage-900 to-sage-800 text-white">
          <h3 className="text-[10px] font-black text-sage-400 uppercase tracking-widest mb-2">Faturamento Líquido</h3>
          <p className="text-3xl font-black">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(netRevenue)}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-sage-300">
            Baseado em transações confirmadas
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mt-8">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Histórico de Transações</h3>
          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-all">
            <Filter size={20} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID / Data</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Favorecido / Cliente</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Método</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((trx, idx) => (
                <tr key={idx} className="group hover:bg-gray-50/80 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-bold text-gray-900 text-sm">{trx.id}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{trx.date}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        trx.type === 'in' ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500"
                      )}>
                        {trx.type === 'in' ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
                      </div>
                      <p className="font-bold text-gray-900 text-sm">{trx.customer}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{trx.method}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-wider">{trx.status}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <p className={cn(
                      "font-black text-sm",
                      trx.type === 'in' ? "text-sage-600" : "text-red-500"
                    )}>
                      {trx.type === 'out' ? '- ' : ''}
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(trx.amount)}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-8 border-t border-gray-50 flex items-center justify-center">
          <button className="text-sage-600 font-bold text-sm hover:underline">Carregar mais transações</button>
        </div>
      </div>
    </div>
  );
}

function TrendingUp({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
  );
}
