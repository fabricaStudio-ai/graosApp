import { motion } from 'motion/react';
import { Home, Search, ShoppingBag, User, Tag, ClipboardList, MessageCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useState } from 'react';

const tabs = [
  { id: 'home', icon: Home, label: 'Início' },
  { id: 'catalog', icon: Search, label: 'Grãos' },
  { id: 'promo', icon: Tag, label: 'Ofertas' },
  { id: 'orders', icon: ClipboardList, label: 'Ordens' },
  { id: 'profile', icon: User, label: 'Conta' },
];

export default function Navbar({ activeTab, onTabChange }: { activeTab: string, onTabChange: (id: string) => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-6 md:pb-8">
      {/* WhatsApp FAB - Premium Style */}
      <div className="flex justify-end px-8 mb-6">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-14 h-14 bg-sage-950 text-white rounded-[1.5rem] flex items-center justify-center shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)] pointer-events-auto border border-white/10"
          onClick={() => window.open('https://wa.me/5500000000000', '_blank')}
        >
          <MessageCircle size={24} className="text-gold" />
        </motion.button>
      </div>

      <nav className="px-6">
        <div className="max-w-md mx-auto bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(107,122,82,0.15)] border border-white p-2 pointer-events-auto flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "relative flex flex-col items-center justify-center flex-1 h-14 rounded-2xl transition-all duration-500",
                  isActive ? "text-sage-600" : "text-copper/30"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-sage-500/10 rounded-2xl"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
                  />
                )}
                <Icon size={20} className={cn("relative z-10 transition-transform", isActive ? "scale-110" : "group-hover:scale-110")} />
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-[0.1em] relative z-10 transition-all duration-500 mt-1",
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                )}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
