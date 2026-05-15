import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Chrome, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { cn } from '@/src/lib/utils';

export default function AuthScreen() {
  const { login, register, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'signup') {
        await register(email, password, name);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Erro ao entrar com Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-6 py-12 bg-[#F6F4EF]">
      {/* Premium Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale-[20%] opacity-15"
          style={{ backgroundImage: 'url("https://images.pexels.com/photos/1112080/pexels-photo-1112080.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-earth-50/90 via-earth-50/40 to-sage-500/10" />
      </div>

      {/* Decorative Organic Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{ x: [0, 20, 0], y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] -left-20 w-[40rem] h-[40rem] bg-sage-500/5 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 30, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-20 w-[45rem] h-[45rem] bg-gold/5 rounded-full blur-[120px]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-xl relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-12 bg-sage-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sage-500/20">
              <span className="text-xl font-black tracking-tighter">TAS</span>
            </div>
            <div className="h-8 w-[1px] bg-sage-200" />
            <span className="text-xl font-medium tracking-[0.2em] text-copper uppercase">Grãos</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-serif italic text-sage-950 mb-4 tracking-tight leading-[1.1]">
            Conectando o agro <br />
            <span className="text-sage-600">ao futuro</span>
          </h1>
          <p className="text-copper/60 font-medium text-lg md:text-xl max-w-[400px] mx-auto leading-relaxed">
            Acesse sua plataforma de negócios agrícolas.
          </p>
        </div>

        {/* Login Card - Glassmorphism */}
        <div className="bg-white/40 backdrop-blur-3xl rounded-[2.5rem] p-10 md:p-14 border border-white/60 shadow-[0_32px_64px_-16px_rgba(107,122,82,0.12)] relative overflow-hidden group">
          {/* Subtle gold line at top */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-5 bg-red-50/50 backdrop-blur-sm text-red-700 text-xs font-bold rounded-2xl border border-red-100/50 flex items-start gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait" initial={false}>
              {mode === 'signup' && (
                <motion.div
                  key="signup-fields"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-2"
                >
                  <label className="text-[10px] font-black text-copper/40 uppercase tracking-[0.25em] px-2 block ml-1">Identificação</label>
                  <div className="relative group/input">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-copper/20 group-focus-within/input:text-sage-500 transition-all" size={18} />
                    <input 
                      type="text" 
                      placeholder="Nome completo ou Razão Social"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/50 border-2 border-transparent rounded-2xl py-4.5 pl-14 pr-6 text-sm font-bold text-sage-900 placeholder:text-copper/20 focus:bg-white focus:border-sage-200/50 focus:outline-none transition-all shadow-sm focus:shadow-md"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-copper/40 uppercase tracking-[0.25em] px-2 block ml-1">E-mail Corporativo</label>
              <div className="relative group/input">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-copper/20 group-focus-within/input:text-sage-500 transition-all" size={18} />
                <input 
                  type="email" 
                  placeholder="usuario@tasgraos.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/50 border-2 border-transparent rounded-2xl py-4.5 pl-14 pr-6 text-sm font-bold text-sage-900 placeholder:text-copper/20 focus:bg-white focus:border-sage-200/50 focus:outline-none transition-all shadow-sm focus:shadow-md"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black text-copper/40 uppercase tracking-[0.25em] block ml-1">Senha de Acesso</label>
                {mode === 'login' && (
                  <button type="button" className="text-[10px] font-bold text-sage-500 uppercase tracking-widest hover:text-sage-700 transition-colors">Recuperar</button>
                )}
              </div>
              <div className="relative group/input">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-copper/20 group-focus-within/input:text-sage-500 transition-all" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/50 border-2 border-transparent rounded-2xl py-4.5 pl-14 pr-6 text-sm font-bold text-sage-900 placeholder:text-copper/20 focus:bg-white focus:border-sage-200/50 focus:outline-none transition-all shadow-sm focus:shadow-md"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={cn(
                "w-full bg-sage-500 hover:bg-sage-600 disabled:bg-sage-200 text-white font-black py-5.5 rounded-2xl flex items-center justify-center gap-3 transition-all mt-8 shadow-xl shadow-sage-500/20 active:scale-[0.98]",
                loading && "opacity-80"
              )}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  <span className="tracking-[0.15em] uppercase text-xs">Entrar na Plataforma</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sage-200/30"></div>
            </div>
            <div className="relative flex justify-center text-[9px] uppercase font-bold">
              <span className="bg-transparent px-5 text-copper/30 tracking-[0.4em]">Autenticação Alternativa</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white/60 border-2 border-white/40 hover:border-sage-200 hover:bg-white disabled:opacity-50 text-sage-800 font-bold py-4.5 rounded-2xl flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-sm"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm border border-sage-50">
              <Chrome size={18} className="text-sage-600" />
            </div>
            <span className="text-[11px] uppercase tracking-[0.15em] font-black">Continuar com Google</span>
          </button>
        </div>

        {/* Footer Toggle */}
        <motion.div 
          layout
          className="text-center mt-10 text-sm font-medium text-copper/50"
        >
          {mode === 'login' ? 'Novo parceiro comercial?' : 'Já possui credenciais?'}
          <button 
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError(null);
            }}
            className="ml-2 text-sage-900 font-black hover:text-sage-600 transition-colors underline underline-offset-8 decoration-sage-200"
          >
            {mode === 'login' ? 'Solicitar Acesso' : 'Efetuar Login'}
          </button>
        </motion.div>

        {/* Brand Footer */}
        <div className="mt-20 text-center opacity-30 select-none pointer-events-none">
          <p className="text-[10px] uppercase tracking-[0.4em] font-black text-copper">
            TAS Grãos &copy; 2026 • Tecnologia & Confiança no Campo
          </p>
        </div>
      </motion.div>
    </div>
  );
}
