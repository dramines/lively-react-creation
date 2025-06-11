
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Baby, Save, Trash2 } from 'lucide-react';

interface Child {
  id: number;
  name: string;
  age: number;
  booksCount: number;
}

interface ChildEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: Child | null;
  onSave: (child: Child) => void;
  onDelete: (childId: number) => void;
}

const ChildEditModal = ({ isOpen, onClose, child, onSave, onDelete }: ChildEditModalProps) => {
  const [name, setName] = useState(child?.name || '');
  const [age, setAge] = useState(child?.age || 3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!child) return;
    
    onSave({
      ...child,
      name,
      age
    });
    onClose();
  };

  const handleDelete = () => {
    if (!child) return;
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${child.name} ?`)) {
      onDelete(child.id);
      onClose();
    }
  };

  if (!child) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[95vw] max-w-[95vw] sm:w-full bg-white border-2 border-slate-200 mx-2">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl font-bold text-slate-800 px-2">
            Modifier {child.name}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 px-2 sm:px-0">
          <div className="space-y-2">
            <Label htmlFor="childName" className="text-slate-700 font-semibold flex items-center text-sm sm:text-base">
              <Baby className="w-4 h-4 mr-2 text-pink-500" />
              Prénom
            </Label>
            <Input
              id="childName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-slate-200 focus:border-pink-400 focus:ring-pink-400 text-sm sm:text-base"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="childAge" className="text-slate-700 font-semibold text-sm sm:text-base">
              Âge
            </Label>
            <Input
              id="childAge"
              type="number"
              min="2"
              max="12"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value))}
              className="border-slate-200 focus:border-pink-400 focus:ring-pink-400 text-sm sm:text-base"
              required
            />
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button 
              type="submit" 
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl text-sm sm:text-base"
            >
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
            
            <Button 
              type="button"
              onClick={handleDelete}
              variant="outline"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 font-semibold py-3 rounded-xl text-sm sm:text-base"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChildEditModal;
