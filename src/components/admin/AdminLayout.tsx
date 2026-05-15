import { motion } from 'motion/react';
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Ticket, 
  BarChart3, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  Menu,
  X,
  Users,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '@/src/context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeMenu: string;
  onMenuChange: (menu: string) => void;
  onLogout: () => void;
}

export default function AdminLayout({ children, activeMenu, onMenuChange }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const { user, logout } = useAuth();

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Ordens de Venda', icon: ShoppingBag },
    { id: 'products', label: 'Catálogo de Grãos', icon: Package },
    { id: 'clients', label: 'Parceiros / Clientes', icon: Users },
    { id: 'promotions', label: 'Campanhas', icon: Ticket },
    { id: 'financial', label: 'Relatório Financeiro', icon: BarChart3 },
    { id: 'support', label: 'Atendimento', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex overflow-hidden relative">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-sage-950/60 backdrop-blur-sm z-[90] transition-opacity duration-500"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "bg-[#1A1C16] h-screen fixed lg:sticky top-0 z-[100] transition-all duration-500 flex flex-col shadow-2xl",
        isSidebarOpen ? "w-72" : "w-0 lg:w-20 overflow-hidden"
      )}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-sage-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-sage-500/10">
              <ShieldCheck size={28} />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <h1 className="font-black text-white italic text-xl leading-none">TAS</h1>
                <span className="text-[10px] uppercase tracking-[0.4em] text-sage-400 font-bold mt-1">Grãos ERP</span>
              </div>
            )}
          </div>
          {/* Mobile Close Button */}
          {isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-sage-400 hover:bg-white/5 rounded-xl transition-all"
            >
              <X size={24} />
            </button>
          )}
        </div>

        <nav className="flex-1 px-4 mt-8 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onMenuChange(item.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl transition-all font-bold text-sm tracking-tight group relative",
                activeMenu === item.id 
                  ? "bg-sage-500/10 text-sage-400" 
                  : "text-sage-100/30 hover:bg-white/5 hover:text-sage-100"
              )}
            >
              {activeMenu === item.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute left-0 w-1 h-6 bg-sage-500 rounded-r-full"
                />
              )}
              <item.icon size={20} className={cn(activeMenu === item.id ? "text-sage-500" : "opacity-50 group-hover:opacity-100")} />
              {isSidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 bg-black/20">
          <button 
            onClick={() => onMenuChange('settings')}
            className="w-full flex items-center gap-4 p-4 text-sage-100/30 font-bold hover:text-sage-100 rounded-xl transition-all mb-2"
          >
            <Settings size={20} />
            {isSidebarOpen && <span>Configurações</span>}
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 p-4 text-red-400/50 font-bold hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Encerrar Sessão</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto flex flex-col">
        {/* Header */}
        <header className="bg-white/70 backdrop-blur-2xl border-b border-sage-100 h-24 sticky top-0 z-50 px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-8">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-10 h-10 flex items-center justify-center text-sage-400 hover:bg-sage-50 rounded-xl transition-all border border-sage-100 shadow-sm"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden lg:flex items-center gap-3 bg-earth-50 px-6 py-3 rounded-2xl w-96 border border-sage-100 transition-all focus-within:bg-white focus-within:shadow-md focus-within:border-sage-200">
              <Search size={18} className="text-sage-300" />
              <input 
                type="text" 
                placeholder="Pesquisar registros, parceiros ou ordens..." 
                className="bg-transparent border-none focus:ring-0 text-sm font-bold text-sage-900 placeholder:text-sage-300 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <button className="relative w-10 h-10 flex items-center justify-center text-sage-400 hover:bg-sage-50 rounded-xl transition-all border border-sage-100">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-sage-500 rounded-full border-2 border-white ring-2 ring-sage-500/20"></span>
              </button>
            </div>
            <div className="h-10 w-[1px] bg-sage-100" />
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-sage-950 tracking-tight">{user?.displayName || 'Diretor TAS'}</p>
                <p className="text-[10px] font-black text-copper/50 uppercase tracking-[0.2em] mt-0.5">Nível Administrativo</p>
              </div>
              <div className="w-12 h-12 rounded-[1.25rem] bg-sage-100 overflow-hidden ring-4 ring-sage-50 shadow-sm border border-sage-100 p-0.5">
                <div className="w-full h-full rounded-[1.1rem] overflow-hidden">
                  <img 
                    src={user?.photoURL || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"} 
                    alt="Admin"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-12 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
