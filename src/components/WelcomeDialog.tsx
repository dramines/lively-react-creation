import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-[#2a98cb]/10 to-[#d175a1]/10 border-2 border-[#2a98cb]/20 p-8">
        <DialogHeader>
          <DialogTitle className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Sparkles className="absolute -top-8 -left-4 h-6 w-6 text-[#fdeb1d]" />
              <span className="text-4xl font-bold bg-gradient-to-r from-[#2a98cb] to-[#d175a1] bg-clip-text text-transparent">
                Bienvenue!
              </span>
              <Sparkles className="absolute -top-8 -right-4 h-6 w-6 text-[#fdeb1d]" />
            </motion.div>
          </DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center space-y-6"
        >
          <p className="text-xl text-[#040404] font-medium">
            Découvrez l'élégance à la française
          </p>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#2a98cb]/20 to-[#d175a1]/20 blur-lg" />
            <p className="relative text-lg text-[#040404]/80 leading-relaxed">
              Plongez dans un univers où le raffinement rencontre l'innovation. 
              Notre collection exclusive incarne l'essence du style français.
            </p>
          </div>
          <div className="pt-6">
            <button
              onClick={() => setIsOpen(false)}
              className="px-8 py-3 bg-gradient-to-r from-[#2a98cb] to-[#d175a1] text-white rounded-full 
                         hover:shadow-lg hover:shadow-[#2a98cb]/20 transition-all duration-300
                         text-lg font-medium transform hover:scale-105"
            >
              Explorer la Collection
            </button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}