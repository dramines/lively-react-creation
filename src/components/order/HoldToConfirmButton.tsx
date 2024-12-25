import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';

interface HoldToConfirmButtonProps {
  onConfirm: () => void;
}

export const HoldToConfirmButton = ({ onConfirm }: HoldToConfirmButtonProps) => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const holdDuration = 3000; // 3 seconds
  const intervalDuration = 100; // Update every 100ms

  const startHolding = () => {
    setIsHolding(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += (intervalDuration / holdDuration) * 100;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsHolding(false);
        setProgress(0);
        onConfirm();
      } else {
        setProgress(currentProgress);
      }
    }, intervalDuration);

    const cleanup = () => {
      clearInterval(interval);
      setIsHolding(false);
      setProgress(0);
    };

    document.addEventListener('mouseup', cleanup);
    document.addEventListener('touchend', cleanup);

    return cleanup;
  };

  const stopHolding = () => {
    setIsHolding(false);
    setProgress(0);
  };

  return (
    <div className="relative w-full">
      <motion.button
        onMouseDown={startHolding}
        onMouseUp={stopHolding}
        onTouchStart={startHolding}
        onTouchEnd={stopHolding}
        className="w-full bg-[#700100] text-white py-6 rounded-lg text-lg relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative z-10 flex items-center justify-center">
          <CreditCard className="mr-2" size={20} />
          Maintenir pour confirmer la commande
        </div>
        <motion.div
          className="absolute left-0 top-0 h-full bg-[#591C1C]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </motion.button>
    </div>
  );
};