
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Chapter } from '@/types/chapters';
import { modifyChapter } from '@/api/chapters';

const formSchema = z.object({
  name_chapter: z.string().min(1, 'Le nom du chapitre est requis'),
  photo_chapter: z.instanceof(FileList).optional(),
});

interface EditChapterFormProps {
  chapter: Chapter;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditChapterForm = ({ chapter, onClose, onSuccess }: EditChapterFormProps) => {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_chapter: chapter.name_chapter,
      photo_chapter: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append('id_chapter', chapter.id_chapter);
      formData.append('name_chapter', values.name_chapter);

      if (values.photo_chapter?.[0]) {
        formData.append('photo_chapter', values.photo_chapter[0]);
      }

      const response = await modifyChapter(formData);

      if (response.success) {
        toast({
          title: 'Succès',
          description: 'Le chapitre a été modifié avec succès',
        });
        onSuccess();
        onClose();
      } else {
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la modification du chapitre',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la modification du chapitre',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name_chapter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du chapitre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="photo_chapter"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Image du chapitre</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onChange(e.target.files)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">
            Enregistrer
          </Button>
        </div>
      </form>
    </Form>
  );
};

