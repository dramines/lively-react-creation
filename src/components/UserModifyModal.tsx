
/**
 * UserModifyModal.tsx
 * 
 * Description (FR):
 * Ce composant affiche une boîte de dialogue modale pour modifier
 * les informations d'un utilisateur existant. Il intègre le formulaire
 * d'utilisateur (UserForm) en mode édition et gère la soumission
 * des modifications.
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UserForm } from '@/components/UserForm';
import { UserData } from '@/components/UserItem';

/**
 * Interface de props pour la modal de modification d'utilisateur
 * 
 * Définit:
 * - L'utilisateur à modifier
 * - L'état d'ouverture
 * - Les gestionnaires d'événements pour modifier l'état et soumettre les données
 */
interface UserModifyModalProps {
  user: UserData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<UserData> & { password?: string }) => void;
}

/**
 * Composant modal pour modifier un utilisateur
 * 
 * Présente un formulaire pré-rempli avec les données de l'utilisateur sélectionné.
 * Gère la fermeture de la modal et la soumission des modifications.
 */
export const UserModifyModal: React.FC<UserModifyModalProps> = ({
  user,
  open,
  onOpenChange,
  onSubmit,
}) => {
  if (!user) return null;

  /**
   * Gère la soumission du formulaire et ferme la modal
   */
  const handleSubmit = (data: Partial<UserData> & { password?: string }) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l'utilisateur ci-dessous
          </DialogDescription>
        </DialogHeader>
        <UserForm 
          initialData={user} 
          onSubmit={handleSubmit} 
          onCancel={() => onOpenChange(false)}
          isEditMode={true}
        />
      </DialogContent>
    </Dialog>
  );
};
