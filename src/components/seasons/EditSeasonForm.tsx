
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { modifySeason } from '@/api/seasons';
import { Season } from '@/types/chapters';

interface EditSeasonFormProps {
  season: Season;
  onClose: () => void;
}

export const EditSeasonForm: React.FC<EditSeasonFormProps> = ({ season, onClose }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState(season.name_saison);
  const [photo, setPhoto] = useState<File | null>(null);
  const [hasChapters, setHasChapters] = useState(season.havechapters_saisons === "1");
  const [aboutLink, setAboutLink] = useState(season.about_link || '');
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    season.photo_saison ? `https://draminesaid.com/videos/${season.photo_saison}` : null
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la saison est requis",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('id_saison', season.id_saison);
      formData.append('name_saison', name);
      formData.append('havechapters_saisons', hasChapters ? "1" : "0");
      
      if (aboutLink) {
        formData.append('about_link', aboutLink);
      }
      
      if (photo) {
        formData.append('photo_saison', photo);
      }
      
      const response = await modifySeason(formData);
      
      if (response.success) {
        toast({
          title: "Succès",
          description: "Saison modifiée avec succès",
        });
        queryClient.invalidateQueries({ queryKey: ['seasons'] });
        onClose();
      } else {
        toast({
          title: "Erreur",
          description: response.message || "Échec de la modification de la saison",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error modifying season:", error);
      toast({
        title: "Erreur",
        description: "Échec de la modification de la saison",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom de la saison</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Entrez le nom de la saison"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="photo">Image de la saison (facultatif)</Label>
        <Input
          id="photo"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        
        {photoPreview && (
          <div className="mt-2 relative w-full aspect-video rounded-md overflow-hidden">
            <img 
              src={photoPreview} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="hasChapters" className="text-base">Possède des chapitres</Label>
          <p className="text-sm text-muted-foreground">
            Activez cette option si cette saison contient des chapitres
          </p>
        </div>
        <Switch
          id="hasChapters"
          checked={hasChapters}
          onCheckedChange={setHasChapters}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="aboutLink">Lien d'information (facultatif)</Label>
        <Input
          id="aboutLink"
          value={aboutLink}
          onChange={(e) => setAboutLink(e.target.value)}
          placeholder="https://exemple.com/page"
        />
        <p className="text-sm text-muted-foreground">
          URL vers une page d'information sur cette saison
        </p>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Modification en cours..." : "Modifier la saison"}
        </Button>
      </div>
    </form>
  );
};
