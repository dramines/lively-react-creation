import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Text, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { savePersonalization, getPersonalizations } from '@/utils/personalizationStorage';

interface PersonalizationButtonProps {
  productId: number;
  onSave: (text: string) => void;
  initialText?: string;
}

const PersonalizationButton = ({ productId, onSave, initialText = '' }: PersonalizationButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState(initialText);

  const handleSave = () => {
    if (text.trim()) {
      savePersonalization(productId, text.trim());
      onSave(text.trim());
      setIsOpen(false);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-full bg-white text-[#700100] border-2 border-[#700100] hover:bg-[#700100] hover:text-white transition-all duration-300"
        >
          <Text className="mr-2 h-5 w-5" />
          {text ? 'Modifier la personnalisation' : 'Personnaliser votre produit'}
        </Button>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif text-[#700100]">
              Personnalisation du produit
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <Textarea
              placeholder="Ajoutez votre texte personnalisé ici..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[100px] p-3 text-black bg-white border-2 border-gray-200 focus:border-[#700100] focus:ring-[#700100] rounded-md resize-none"
            />
            <Button
              onClick={handleSave}
              className="w-full bg-[#700100] hover:bg-[#590000] text-white transition-all duration-300"
            >
              <Save className="mr-2 h-5 w-5" />
              Enregistrer la personnalisation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PersonalizationButton;