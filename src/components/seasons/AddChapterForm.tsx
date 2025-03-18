
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addChapter } from '@/api/seasons';
import { fetchSeasons } from '@/api/chapters';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Season } from '@/types/chapters';
import { UploadCloud } from 'lucide-react';

const formSchema = z.object({
  seasonId: z.string().min(1, 'Veuillez sélectionner une saison'),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
});

interface AddChapterFormProps {
  seasonId?: string;
  onSuccess?: () => void;
}

export const AddChapterForm: React.FC<AddChapterFormProps> = ({ 
  seasonId: defaultSeasonId,
  onSuccess 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: seasonsData, isLoading: isLoadingSeasons } = useQuery({
    queryKey: ['seasons'],
    queryFn: fetchSeasons,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      seasonId: defaultSeasonId || '',
      name: '',
    },
  });

  // Update the form's seasonId when defaultSeasonId changes
  useEffect(() => {
    if (defaultSeasonId) {
      form.setValue('seasonId', defaultSeasonId);
    }
  }, [defaultSeasonId, form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!photoFile) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une image pour le chapitre",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await addChapter(values.seasonId, values.name, photoFile);
      
      if (response.success) {
        toast({
          title: "Succès",
          description: "Chapitre ajouté avec succès",
        });
        
        // Invalidate queries to refetch data
        queryClient.invalidateQueries({ queryKey: ['chapters', values.seasonId] });
        
        // Reset form
        form.reset({
          seasonId: values.seasonId, // Keep the selected season
          name: '',
        });
        setPhotoFile(null);
        
        // Clear file input
        const fileInput = document.getElementById('chapter-photo') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast({
          title: "Erreur",
          description: response.message || "Échec de l'ajout du chapitre",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du chapitre:", error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!defaultSeasonId && (
          <FormField
            control={form.control}
            name="seasonId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Saison</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isLoadingSeasons}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une saison" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {seasonsData?.saisons?.map((season: Season) => (
                      <SelectItem key={season.id_saison} value={season.id_saison}>
                        {season.name_saison}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du chapitre</FormLabel>
              <FormControl>
                <Input placeholder="Entrez le nom du chapitre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <FormLabel htmlFor="chapter-photo">Image du chapitre</FormLabel>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input
              id="chapter-photo"
              type="file"
              accept="image/*"
              className="cursor-pointer"
              onChange={handleFileChange}
            />
          </div>
          {photoFile && (
            <p className="text-sm text-muted-foreground">
              Fichier sélectionné: {photoFile.name}
            </p>
          )}
          {!photoFile && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <UploadCloud className="h-4 w-4" /> Veuillez sélectionner une image
            </p>
          )}
        </div>
        
        <Button type="submit" className="w-full" disabled={isSubmitting || !photoFile}>
          {isSubmitting ? 'Ajout en cours...' : 'Ajouter le chapitre'}
        </Button>
      </form>
    </Form>
  );
};
