import { motion } from 'motion/react';
import { ChevronLeft, Share2, Plus, Minus, Star, ShieldCheck, Heart, AlertCircle, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/src/lib/utils';

export interface Product {
  id: number;
  name: string;
  price: string;
  priceRaw: number;
  image: string;
  category: string;
  benefit: string;
  rating: number;
  type: 'unit' | 'weight';
  unit: string;
  description: string;
  nutritionalInfo: string;
}

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (p: Product, quantity: number, observations: string) => void;
}

export default function ProductDetails({ product, onBack, onAddToCart }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(product.type === 'weight' ? 100 : 1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [observations, setObservations] = useState('');

  const calculateTotal = () => {
    if (product.type === 'weight') {
      return (product.priceRaw * quantity / 100).toFixed(2);
    }
    return (product.priceRaw * quantity).toFixed(2);
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity, observations);
    onBack();
  };

  const handleIncrement = () => {
    if (product.type === 'weight') {
      setQuantity(prev => prev + 100);
    } else {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (product.type === 'weight') {
      setQuantity(prev => Math.max(100, prev - 100));
    } else {
      setQuantity(prev => Math.max(1, prev - 1));
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-earth-50 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 px-6 py-6 flex items-center justify-between pointer-events-none">
        <button 
          onClick={onBack}
          className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-sage-900 pointer-events-auto active:scale-90 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-3 pointer-events-auto">
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-sage-900 active:scale-90 transition-all"
          >
            <Heart size={20} className={cn(isFavorite && "fill-copper text-copper")} />
          </button>
          <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-sage-900 active:scale-90 transition-all">
            <Share2 size={20} />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Large Image */}
        <div className="relative h-[45vh] overflow-hidden">
          <motion.img 
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-earth-50 via-transparent to-transparent" />
        </div>

        <div className="px-6 -mt-10 relative z-10">
          <div className="bg-white rounded-[3rem] p-8 organic-shadow mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 bg-sage-50 px-2 py-1 rounded-lg">
                <Star size={14} className="fill-gold text-gold" />
                <span className="text-xs font-bold text-sage-600">{product.rating}</span>
              </div>
              <span className="text-[10px] font-bold text-sage-400 uppercase tracking-widest">{product.category}</span>
            </div>

            <h2 className="text-2xl font-bold text-sage-900 leading-tight mb-2">{product.name}</h2>
            <p className="text-sage-400 font-medium mb-6">{product.benefit}</p>

            <div className="flex items-center justify-between mb-8 pb-8 border-b border-sage-50">
              <span className="text-3xl font-bold text-sage-600">{product.price} <span className="text-sm font-medium text-sage-400">/ {product.unit}</span></span>
              
              {/* Quantity Selector */}
              <div className="flex items-center gap-4 bg-sage-50 p-1.5 rounded-2xl">
                <button 
                  onClick={handleDecrement}
                  className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sage-600 organic-shadow active:scale-90 transition-all"
                >
                  <Minus size={18} />
                </button>
                <div className="flex flex-col items-center min-w-[50px]">
                  <span className="text-sm font-bold text-sage-900">{quantity}{product.type === 'weight' ? 'g' : ''}</span>
                </div>
                <button 
                  onClick={handleIncrement}
                  className="w-10 h-10 bg-sage-600 text-white rounded-xl flex items-center justify-center organic-shadow active:scale-90 transition-all"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-sage-900 uppercase tracking-widest mb-3">Sobre o Produto</h3>
              <p className="text-sm text-sage-600 leading-relaxed font-medium">
                {product.description}
              </p>
            </div>

            {/* Nutritional Info */}
            <div className="bg-earth-50 rounded-2xl p-4 flex gap-4 items-start mb-8">
              <AlertCircle size={20} className="text-sage-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-sage-900 mb-1 leading-none uppercase">Informação Nutricional</h4>
                <p className="text-[11px] text-sage-500 font-medium leading-normal italic">
                  {product.nutritionalInfo}
                </p>
              </div>
            </div>

            {/* Observations */}
            <div>
              <h3 className="text-sm font-bold text-sage-900 uppercase tracking-widest mb-3">Observações</h3>
              <textarea 
                placeholder="Ex: Embalar para presente, moer na hora..."
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full bg-earth-50 border-none rounded-2xl p-4 text-sm text-sage-900 placeholder:text-sage-400 focus:ring-2 focus:ring-sage-200 transition-all outline-none min-h-[100px] resize-none"
              />
            </div>
          </div>

          {/* Cross Sell */}
          <section className="mb-8">
            <h3 className="text-lg font-bold text-sage-900 mb-6">Combina com...</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-w-[160px] bg-white rounded-3xl p-4 organic-shadow">
                  <div className="aspect-square rounded-2xl overflow-hidden mb-3">
                    <img 
                      src={`https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&q=80&w=200&sig=${i}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h4 className="text-xs font-bold text-sage-900 mb-1 line-clamp-1">Produto Extra {i}</h4>
                  <p className="text-xs font-bold text-sage-500">R$ 15,90</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Footer Button */}
      <div className="absolute bottom-0 left-0 right-0 glass px-6 py-8 pb-10 border-t border-white/20">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className="w-full bg-sage-600 text-white rounded-[2rem] py-5 organic-shadow flex items-center justify-center gap-3 font-bold text-lg"
        >
          <ShoppingCart size={24} />
          Adicionar • R$ {calculateTotal()}
        </motion.button>
      </div>
    </div>
  );
}
