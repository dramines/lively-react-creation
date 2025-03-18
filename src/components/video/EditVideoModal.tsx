
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';

interface EditVideoModalProps {
  video: {
    id_video: string;
    name_video: string;
    descri_video: string;
    url_video: string;
    url_thumbnail: string;
    saison: string;
    cat_video: string;
    created_at: string;
    seasonName?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormValues {
  title: string;
  description: string;
}

export function EditVideoModal({ video, isOpen, onClose, onSuccess }: EditVideoModalProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    defaultValues: {
      title: video.name_video,
      description: video.descri_video,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();
      formData.append('id_video', video.id_video);
      formData.append('title', values.title);
      formData.append('description', values.description);

      const response = await axios.post('https://plateform.draminesaid.com/app/modify_video.php', formData);

      if (response.data.success) {
        toast({
          title: "Succès",
          description: "Vidéo mise à jour avec succès",
        });
        onSuccess();
        onClose();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier la vidéo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose} type="button">Annuler</Button>
              <Button type="submit">Sauvegarder</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
