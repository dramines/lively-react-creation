
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSeasons } from '@/api/chapters';
import { fetchComments, deleteComment } from '@/api/comments';
import { Comment, Season } from '@/types/chapters';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Modal from './Modal';

const Comments = () => {
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
  
  // Fetch seasons data
  const { data: seasonsData } = useQuery({
    queryKey: ['seasons'],
    queryFn: fetchSeasons,
  });
  
  // Fetch comments data
  const { 
    data: commentsData, 
    refetch: refetchComments,
    isLoading: isLoadingComments
  } = useQuery({
    queryKey: ['comments', selectedSeason],
    queryFn: () => fetchComments(selectedSeason !== 'all' ? selectedSeason : undefined),
  });

  // Fix: Ensure we have seasons array
  const seasons = seasonsData?.saisons || [];
  
  console.log('Comments data:', commentsData);
  
  const handleSeasonChange = (value: string) => {
    setSelectedSeason(value);
  };
  
  const handleDeleteClick = (comment: Comment) => {
    setCommentToDelete(comment);
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!commentToDelete) return;
    
    try {
      const response = await deleteComment(commentToDelete.id_comment);
      if (response.success) {
        toast({
          title: "Succès",
          description: "Le commentaire a été supprimé avec succès",
        });
        refetchComments();
      } else {
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression du commentaire",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du commentaire",
        variant: "destructive",
      });
    }
    
    setIsDeleteModalOpen(false);
    setCommentToDelete(null);
  };
  
  return (
    <div className="p-6 mt-16">
      <Card className="bg-white border-border/40">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-2xl font-bold">Commentaires</CardTitle>
            <div className="w-full md:w-64">
              <Select value={selectedSeason} onValueChange={handleSeasonChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par saison" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les saisons</SelectItem>
                  {seasons && seasons.map((season: Season) => (
                    <SelectItem key={season.id_saison} value={season.id_saison}>
                      {season.name_saison}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingComments ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            commentsData && commentsData.comments && commentsData.comments.length > 0 ? (
              <div className="space-y-4">
                {commentsData.comments.map((comment: Comment) => (
                  <div 
                    key={comment.id_comment} 
                    className="p-4 border border-border/40 rounded-lg relative"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{comment.user_name}</h3>
                        <p className="text-sm text-muted-foreground">{comment.created_at}</p>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => handleDeleteClick(comment)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-base">{comment.comment_text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Aucun commentaire trouvé
              </div>
            )
          )}
        </CardContent>
      </Card>
      
      {isDeleteModalOpen && (
        <Modal
          action="delete"
          message="Êtes-vous sûr de vouloir supprimer ce commentaire ?"
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setCommentToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default Comments;
