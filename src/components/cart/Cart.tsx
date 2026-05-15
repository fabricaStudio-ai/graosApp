import { motion } from 'motion/react';
import { ChevronLeft, Trash2, Plus, Minus, ShoppingBag, MessageSquare } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export interface CartItem {
  id: number;
  name: string;
  price: string;
  priceRaw: number;
  image: string;
  quantity: number;
  unit: string;
  type: 'unit' | 'weight';
  observations?: string;
}

interface CartProps {
  items: CartItem[];
  onBack: () => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export default function Cart({ items, onBack, onUpdateQuantity, onRemove }: CartProps) {
  const subtotal = items.reduce((acc, item) => {
    const itemTotal = item.type === 'weight' ? (item.priceRaw * item.quantity / 100) : (item.priceRaw * item.quantity);
    return acc + itemTotal;
  }, 0);

  const discount = subtotal > 100 ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  const handleCheckout = () => {
    const itemsList = items.map(item => {
      const q = item.type === 'weight' ? `${item.quantity}g` : `${item.quantity}un`;
      return `- ${item.name} (${q}): R$ ${item.type === 'weight' ? (item.priceRaw * item.quantity / 100).toFixed(2) : (item.priceRaw * item.quantity).toFixed(2)}`;
    }).join('\n');

    const message = `Olá, equipe Tas Grãos! Gostaria de finalizar o seguinte pedido de produtos naturais:\n\n${itemsList}\n\nSubtotal: R$ ${subtotal.toFixed(2)}\nDesconto: R$ ${discount.toFixed(2)}\nTotal: R$ ${total.toFixed(2)}\n\nAguardo confirmação!`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5500000000000?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[70] bg-earth-50 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="px-6 py-8 flex items-center justify-between glass sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sage-900 organic-shadow active:scale-95 transition-all"
          >
            <ChevronLeft size={22} />
          </button>
          <h2 className="text-xl font-bold text-sage-900">Meu Carrinho</h2>
        </div>
        <div className="w-10 h-10 bg-sage-100 rounded-xl flex items-center justify-center text-sage-600">
          <ShoppingBag size={20} />
        </div>
      </header>

      {/* Cart Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-sage-400 gap-4">
            <div className="w-20 h-20 bg-sage-50 rounded-full flex items-center justify-center">
              <ShoppingBag size={40} className="opacity-20" />
            </div>
            <p className="font-bold text-lg">Carrinho Vazio</p>
            <button 
              onClick={onBack}
              className="px-6 py-2 bg-sage-600 text-white rounded-xl text-sm font-bold"
            >
              Começar a Comprar
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {items.map((item, idx) => (
              <motion.div
                key={`${item.id}-${idx}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl p-4 flex gap-4 organic-shadow relative overflow-hidden"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h4 className="text-sm font-bold text-sage-900 mb-1 leading-tight">{item.name}</h4>
                    <p className="text-[10px] text-sage-400 font-bold uppercase tracking-wider">{item.unit}</p>
                    {item.observations && (
                      <p className="text-[10px] text-copper font-medium mt-1 italic line-clamp-1">Obs: {item.observations}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-sage-600">
                      R$ {item.type === 'weight' ? (item.priceRaw * item.quantity / 100).toFixed(2) : (item.priceRaw * item.quantity).toFixed(2)}
                    </p>
                    
                    <div className="flex items-center gap-3 bg-sage-50 px-2 py-1 rounded-xl">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, Math.max(item.type === 'weight' ? 100 : 1, item.quantity - (item.type === 'weight' ? 100 : 1)))}
                        className="text-sage-400"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-xs font-bold text-sage-900 w-6 text-center">
                        {item.type === 'weight' ? `${item.quantity/100}` : item.quantity}
                      </span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity + (item.type === 'weight' ? 100 : 1))}
                        className="text-sage-400"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => onRemove(item.id)}
                  className="absolute top-2 right-2 p-2 text-sage-200 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {items.length > 0 && (
        <div className="glass px-6 py-8 pb-10 border-t border-white/20">
          <div className="flex flex-col gap-3 mb-6 font-bold text-sage-900">
            <div className="flex justify-between text-sm">
              <span className="text-sage-400">Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-sage-500">
                <span className="flex items-center gap-2 italic">
                  Desconto (Cupom Bem-Estar)
                </span>
                <span>- R$ {discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg mt-2 pt-4 border-t border-sage-100">
              <span>Total</span>
              <span className="text-sage-600 font-extrabold text-2xl">R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCheckout}
            className="w-full bg-[#25D366] text-white rounded-[2rem] py-5 organic-shadow flex items-center justify-center gap-3 font-bold text-lg shadow-xl shadow-green-500/20"
          >
            <MessageSquare size={24} />
            Finalizar no WhatsApp
          </motion.button>
        </div>
      )}
    </div>
  );
}
