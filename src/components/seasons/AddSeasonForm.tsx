
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addSeason } from '@/api/seasons';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  name_saison: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  photo_saison: z.instanceof(File).optional(),
  havechapters_saisons: z.string().default("0"),
  about_link: z.string().url("Veuillez entrer une URL valide").optional().or(z.literal("")),
});

interface AddSeasonFormProps {
  onSuccess?: () => void;
}

export const AddSeasonForm: React.FC<AddSeasonFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_saison: '',
      havechapters_saisons: "0",
      about_link: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      form.setValue('photo_saison', file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name_saison', values.name_saison);
      formData.append('havechapters_saisons', values.havechapters_saisons);
      
      if (values.about_link) {
        formData.append('about_link', values.about_link);
      }
      
      if (values.photo_saison) {
        formData.append('photo_saison', values.photo_saison);
      }
      
      const response = await addSeason(formData);
      
      if (response.success) {
        toast({
          title: "Succès",
          description: "Saison ajoutée avec succès",
        });
        
        // Invalidate queries to refetch data
        queryClient.invalidateQueries({ queryKey: ['seasons'] });
        
        // Reset form
        form.reset();
        setPhotoPreview(null);
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast({
          title: "Erreur",
          description: response.message || "Échec de l'ajout de la saison",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding season:", error);
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
        <FormField
          control={form.control}
          name="name_saison"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la saison</FormLabel>
              <FormControl>
                <Input placeholder="Entrez le nom de la saison" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Image de la saison</FormLabel>
          <FormControl>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </FormControl>
          <FormDescription>
            Choisissez une image pour la saison
          </FormDescription>
          
          {photoPreview && (
            <div className="mt-2 relative w-full aspect-video rounded-md overflow-hidden">
              <img 
                src={photoPreview} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </FormItem>

        <FormField
          control={form.control}
          name="havechapters_saisons"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Possède des chapitres</FormLabel>
                <FormDescription>
                  Activez cette option si cette saison contient des chapitres
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value === "1"}
                  onCheckedChange={(checked) => {
                    field.onChange(checked ? "1" : "0");
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="about_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lien d'information</FormLabel>
              <FormControl>
                <Input placeholder="https://exemple.com/page" {...field} />
              </FormControl>
              <FormDescription>
                URL vers une page d'information sur cette saison (optionnel)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Ajout en cours...' : 'Ajouter la saison'}
        </Button>
      </form>
    </Form>
  );
};
