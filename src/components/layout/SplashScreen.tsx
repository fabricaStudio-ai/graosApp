import { motion, AnimatePresence } from 'motion/react';
import { Leaf } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible ] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for exit animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-sage-500 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Animated Background Elements */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 180]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-sage-400/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.5, 1],
              rotate: [0, -90, -180]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-sage-600/30 rounded-full blur-3xl"
          />

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              damping: 12,
              stiffness: 100,
              duration: 0.8 
            }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center organic-shadow mb-6">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Leaf size={48} className="text-sage-500" />
              </motion.div>
            </div>
            
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-white tracking-tight"
            >
              Tas Grãos
            </motion.h1>
            
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sage-100 font-medium text-sm mt-2 tracking-widest uppercase"
            >
              Nutrição Natural
            </motion.p>
          </motion.div>

          {/* Loading bar */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
