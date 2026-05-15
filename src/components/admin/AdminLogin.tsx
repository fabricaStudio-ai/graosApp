import { motion } from 'motion/react';
import React, { useState } from 'react';
import { Lock, Mail, ChevronRight } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified login logic
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] organic-shadow p-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-sage-600 rounded-2xl flex items-center justify-center text-white mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-black text-sage-900 italic">Tas Grãos <span className="text-sage-500 font-medium not-italic">Gestor</span></h1>
          <p className="text-sage-400 text-sm font-medium mt-1">Acesso restrito ao painel administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-sage-900 uppercase tracking-widest px-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-300" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tasgraos.com"
                className="w-full bg-sage-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-sage-500 transition-all font-medium text-sage-900"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-sage-900 uppercase tracking-widest px-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-300" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-sage-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-sage-500 transition-all font-medium text-sage-900"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-sage-900 text-white py-5 rounded-[2rem] font-bold text-lg flex items-center justify-center gap-2 group hover:bg-sage-800 transition-all"
          >
            Entrar no Painel
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-10 text-center">
          <button className="text-xs font-bold text-sage-400 hover:text-sage-600 transition-colors">
            Esqueceu a senha? Entre em contato com o suporte técnico.
          </button>
        </div>
      </motion.div>
    </div>
  );
}
