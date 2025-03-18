
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ModalProps {
  action: 'accept' | 'reject' | 'activate' | 'deactivate' | 'delete';
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({ action, message, onConfirm, onCancel }) => {
  const getActionText = (action: string) => {
    switch (action) {
      case 'accept': return 'Accepter';
      case 'reject': return 'Refuser';
      case 'activate': return 'Activer';
      case 'deactivate': return 'Désactiver';
      case 'delete': return 'Supprimer';
      default: return 'Confirmer';
    }
  };

  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className={
              action === 'accept' || action === 'activate' 
                ? 'bg-green-500 hover:bg-green-600' 
                : action === 'deactivate'
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-red-500 hover:bg-red-600'
            }
          >
            {getActionText(action)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Modal;
