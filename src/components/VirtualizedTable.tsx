
import React from 'react';
import { FixedSizeList as List } from 'react-window';
import { UserData } from '@/types/users';
import { Button } from '@/components/ui/button';
import { Check, Pause, Box, Trash2 } from 'lucide-react';

interface VirtualizedTableProps {
  data: UserData[];
  onActivate: (id: string, email: string) => void;
  onDeactivate: (id: string) => void;
  onDelete: (id: string) => void;
  onAlloc: (id: string) => void;
}

const ROW_HEIGHT = 60;

const VirtualizedTable: React.FC<VirtualizedTableProps> = ({
  data,
  onActivate,
  onDeactivate,
  onDelete,
  onAlloc
}) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const userData = data[index];
    if (!userData) return null;

    return (
      <div style={style} className="flex items-center border-b hover:bg-gray-50 px-6">
        <div className="w-[10%]">{userData.user.id_client}</div>
        <div className="w-[15%]">{userData.user.nom_client}</div>
        <div className="w-[15%]">{userData.user.prenom_client}</div>
        <div className="w-[20%]">{userData.user.email_client}</div>
        <div className="w-[15%]">{userData.user.telephone_client}</div>
        <div className="w-[15%]">{new Date(userData.user.createdat_client).toLocaleDateString()}</div>
        <div className="w-[10%]">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            userData.user.status_client === '1' 
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {userData.user.status_client === '1' ? "Actif" : "Inactif"}
          </span>
        </div>
        <div className="w-[20%] flex gap-2">
          {userData.user.status_client === '0' && (
            <Button
              size="sm"
              onClick={() => onActivate(userData.user.id_client, userData.user.email_client)}
              className="bg-green-500 hover:bg-green-600"
            >
              <Check className="h-4 w-4 mr-1" />
              Activer
            </Button>
          )}
          {userData.user.status_client === '1' && (
            <>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDeactivate(userData.user.id_client)}
              >
                <Pause className="h-4 w-4 mr-1" />
                Désactiver
              </Button>
              <Button
                size="sm"
                onClick={() => onAlloc(userData.user.id_client)}
              >
                <Box className="h-4 w-4 mr-1" />
                Allouer
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(userData.user.id_client)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Supprimer
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="border rounded-md">
      <div className="flex items-center bg-gray-50 px-6 py-3 border-b font-medium text-gray-500">
        <div className="w-[10%]">ID</div>
        <div className="w-[15%]">Nom</div>
        <div className="w-[15%]">Prénom</div>
        <div className="w-[20%]">Email</div>
        <div className="w-[15%]">Téléphone</div>
        <div className="w-[15%]">Date de création</div>
        <div className="w-[10%]">Statut</div>
        <div className="w-[20%]">Actions</div>
      </div>
      <List
        height={600}
        itemCount={data.length}
        itemSize={ROW_HEIGHT}
        width="100%"
      >
        {Row}
      </List>
    </div>
  );
};

export default VirtualizedTable;
