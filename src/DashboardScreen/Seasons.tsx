import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSeasons, fetchChapters, fetchSousChapters } from '@/api/chapters';
import { deleteSeason, deleteChapter } from '@/api/seasons';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, ChevronLeft, ChevronRight, Plus, X, PenSquare, Image, Eye } from 'lucide-react';
import { AddSeasonForm } from '@/components/seasons/AddSeasonForm';
import { AddChapterForm } from '@/components/seasons/AddChapterForm';
import { EditSeasonForm } from '@/components/seasons/EditSeasonForm';
import { useToast } from '@/hooks/use-toast';
import Modal from './Modal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Season, Chapter, SousChapter } from '@/types/chapters';
import { EditChapterForm } from '@/components/seasons/EditChapterForm';

const Seasons: React.FC = () => {
  const { toast } = useToast();
  const [seasonToDelete, setSeasonToDelete] = useState<string | null>(null);
  const [chapterToDelete, setChapterToDelete] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [activeView, setActiveView] = useState<'seasons' | 'chapters' | 'souschapters'>('seasons');
  const [seasonToEdit, setSeasonToEdit] = useState<Season | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addSeasonDialogOpen, setAddSeasonDialogOpen] = useState(false);
  const [addChapterDialogOpen, setAddChapterDialogOpen] = useState(false);
  const [addSousChapterDialogOpen, setAddSousChapterDialogOpen] = useState(false);
  const [chapterToEdit, setChapterToEdit] = useState<Chapter | null>(null);
  const [editChapterDialogOpen, setEditChapterDialogOpen] = useState(false);

  const { data: seasonsData, isLoading: isLoadingSeasons, refetch: refetchSeasons } = useQuery({
    queryKey: ['seasons'],
    queryFn: fetchSeasons,
  });

  const { data: chaptersData, isLoading: isLoadingChapters, refetch: refetchChapters } = useQuery({
    queryKey: ['chapters', selectedSeason?.id_saison],
    queryFn: () => fetchChapters(selectedSeason?.id_saison),
    enabled: !!selectedSeason,
  });

  const { data: sousChaptersData, isLoading: isLoadingSousChapters } = useQuery({
    queryKey: ['souschapters', selectedChapter?.id_chapter],
    queryFn: () => fetchSousChapters(selectedChapter?.id_chapter!),
    enabled: !!selectedChapter,
  });

  const filteredChapters = React.useMemo(() => {
    if (!chaptersData?.chapters) return [];
    
    return chaptersData.chapters.filter((chapter: Chapter) => 
      chapter.id_saison === selectedSeason?.id_saison.toString()
    );
  }, [chaptersData?.chapters, selectedSeason?.id_saison]);

  const getChapterImagePath = (chapter: Chapter) => {
    const baseUrl = 'https://draminesaid.com/videos/';
    if (chapter.id_saison === "0") {
      return `${baseUrl}${chapter.photo_chapter}`;
    }
    return `${baseUrl}saisonsimages/${chapter.photo_chapter}`;
  };

  const handleDeleteSeason = async () => {
    if (!seasonToDelete) return;
    
    try {
      const response = await deleteSeason(seasonToDelete);
      
      if (response.success) {
        toast({
          title: "Succès",
          description: "Saison supprimée avec succès",
        });
        await refetchSeasons();
        if (selectedSeason?.id_saison === seasonToDelete) {
          setSelectedSeason(null);
          setActiveView('seasons');
        }
      } else {
        toast({
          title: "Erreur",
          description: response.message || "Échec de la suppression de la saison",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    } finally {
      setSeasonToDelete(null);
    }
  };

  const handleDeleteChapter = async () => {
    if (!chapterToDelete) return;
    
    try {
      const response = await deleteChapter(chapterToDelete);

      if (response.success) {
        toast({
          title: "Succès",
          description: "Chapitre supprimé avec succès",
        });
        await refetchChapters();
        if (selectedChapter?.id_chapter === chapterToDelete) {
          setSelectedChapter(null);
          setActiveView('chapters');
        }
      } else {
        toast({
          title: "Erreur",
          description: "Échec de la suppression du chapitre",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de la suppression du chapitre",
        variant: "destructive",
      });
    } finally {
      setChapterToDelete(null);
    }
  };

  const handleSeasonClick = (season: Season) => {
    setSelectedSeason(season);
    setSelectedChapter(null);
    setActiveView('chapters');
  };

  const handleChapterClick = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setActiveView('souschapters');
  };

  const handleBackToSeasons = () => {
    setSelectedSeason(null);
    setSelectedChapter(null);
    setActiveView('seasons');
  };

  const handleBackToChapters = () => {
    setSelectedChapter(null);
    setActiveView('chapters');
  };

  const handleEditSeason = (season: Season, e: React.MouseEvent) => {
    e.stopPropagation();
    setSeasonToEdit(season);
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setSeasonToEdit(null);
  };

  const handleAddSuccess = () => {
    setAddSeasonDialogOpen(false);
    setAddChapterDialogOpen(false);
    setAddSousChapterDialogOpen(false);
    
    if (activeView === 'seasons') {
      refetchSeasons();
    } else if (activeView === 'chapters') {
      refetchChapters();
    }
  };

  const handleEditChapter = (chapter: Chapter, e: React.MouseEvent) => {
    e.stopPropagation();
    setChapterToEdit(chapter);
    setEditChapterDialogOpen(true);
  };

  const closeEditChapterDialog = () => {
    setEditChapterDialogOpen(false);
    setChapterToEdit(null);
  };

  if (isLoadingSeasons) {
    return (
      <div className="p-6 mt-16 space-y-6">
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (!seasonsData?.saisons) {
    return null;
  }

  const renderActionButtons = () => {
    if (activeView === 'seasons') {
      return (
        <Dialog open={addSeasonDialogOpen} onOpenChange={setAddSeasonDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une saison
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle saison</DialogTitle>
            </DialogHeader>
            <AddSeasonForm onSuccess={handleAddSuccess} />
          </DialogContent>
        </Dialog>
      );
    } else if (activeView === 'chapters') {
      return (
        <Dialog open={addChapterDialogOpen} onOpenChange={setAddChapterDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un chapitre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau chapitre</DialogTitle>
            </DialogHeader>
            <AddChapterForm seasonId={selectedSeason?.id_saison} onSuccess={handleAddSuccess} />
          </DialogContent>
        </Dialog>
      );
    } else if (activeView === 'souschapters') {
      return (
        <Dialog open={addSousChapterDialogOpen} onOpenChange={setAddSousChapterDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un sous-chapitre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau sous-chapitre</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Formulaire à développer</p>
            </div>
          </DialogContent>
        </Dialog>
      );
    }
    return null;
  };

  return (
    <div className="p-6 mt-16 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          {activeView !== 'seasons' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={activeView === 'chapters' ? handleBackToSeasons : handleBackToChapters}
            >
              <ChevronLeft className="h-4 w-4" />
              {activeView === 'chapters' ? 'Back to Seasons' : 'Back to Chapters'}
            </Button>
          )}
          <h2 className="text-2xl font-bold">
            {activeView === 'seasons' && 'Liste des saisons'}
            {activeView === 'chapters' && `Chapitres: ${selectedSeason?.name_saison}`}
            {activeView === 'souschapters' && `Sous-Chapitres: ${selectedChapter?.name_chapter}`}
          </h2>
        </div>
        
        <div className="flex space-x-4">
          {renderActionButtons()}
        </div>
      </div>

      {activeView === 'seasons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seasonsData?.saisons.map((season) => (
            <Card 
              key={`season-${season.id_saison}`}
              className="bg-dashboard-card border-border/40 relative hover:shadow-md transition-shadow"
            >
              <div className="absolute top-2 right-2 flex gap-2 z-10">
                <button
                  onClick={(e) => handleEditSeason(season, e)}
                  className="p-1.5 rounded-full bg-white/90 hover:bg-white shadow transition-colors"
                >
                  <PenSquare className="h-4 w-4 text-blue-500" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSeasonToDelete(season.id_saison);
                  }}
                  className="p-1.5 rounded-full bg-white/90 hover:bg-white shadow transition-colors"
                >
                  <X className="h-4 w-4 text-red-500" />
                </button>
              </div>
              
              <div 
                className="cursor-pointer"
                onClick={() => handleSeasonClick(season)}
              >
                <div className="w-full h-40 overflow-hidden">
                  {season.photo_saison ? (
                    <img
                      src={`https://draminesaid.com/videos/${season.photo_saison}`}
                      alt={season.name_saison}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <BookOpen className="h-16 w-16 text-primary" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-center">{season.name_saison}</CardTitle>
                </CardHeader>
                <CardFooter className="pt-0 flex justify-center">
                  <Button variant="ghost" size="sm" className="gap-1">
                    Voir les chapitres <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeView === 'chapters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingChapters ? (
            Array(6).fill(null).map((_, index) => (
              <Skeleton key={`chapter-skeleton-${index}`} className="h-[200px] w-full" />
            ))
          ) : filteredChapters.length > 0 ? (
            filteredChapters.map((chapter, index) => (
              <Card 
                key={`chapter-${chapter.id_chapter}`}
                className="bg-dashboard-card border-border/40 relative hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleChapterClick(chapter)}
              >
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <button
                    onClick={(e) => handleEditChapter(chapter, e)}
                    className="p-1.5 rounded-full bg-white/90 hover:bg-white shadow transition-colors"
                  >
                    <PenSquare className="h-4 w-4 text-blue-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setChapterToDelete(chapter.id_chapter);
                    }}
                    className="p-1.5 rounded-full bg-white/90 hover:bg-white shadow transition-colors"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                </div>
                <div className="w-full aspect-[16/9] overflow-hidden">
                  {chapter.photo_chapter ? (
                    <img
                      src={getChapterImagePath(chapter)}
                      alt={`الحصة ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <BookOpen className="h-12 w-12 text-primary" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg text-center">الحصة {index + 1}</CardTitle>
                </CardHeader>
                <CardFooter className="flex justify-center py-2">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Eye className="h-4 w-4" /> Voir les détails
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <Image className="h-16 w-16 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Aucun chapitre trouvé</h3>
              <p className="mt-2 text-muted-foreground">
                Il n'y a pas de chapitres disponibles pour cette saison.
              </p>
            </div>
          )}
        </div>
      )}

      {activeView === 'souschapters' && (
        <div className="space-y-6">
          {isLoadingSousChapters ? (
            Array(3).fill(null).map((_, index) => (
              <Skeleton key={`souschapter-skeleton-${index}`} className="h-[200px] w-full" />
            ))
          ) : sousChaptersData && Object.keys(sousChaptersData).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(sousChaptersData).map((souschapter: SousChapter) => (
                <Card 
                  key={`souschapter-${souschapter.id_souschapter}`}
                  className="bg-dashboard-card border-border/40 relative hover:shadow-md transition-shadow"
                >
                  <div className="w-full aspect-[16/9] overflow-hidden">
                    {souschapter.image_url ? (
                      <img
                        src={`https://draminesaid.com/videos/${souschapter.image_url}`}
                        alt={`Sous-chapitre ${souschapter.id_souschapter}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10">
                        <Image className="h-12 w-12 text-primary" />
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">Sous-chapitre {souschapter.id_souschapter}</CardTitle>
                    <CardDescription>
                      Type: {souschapter.tovideopage}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Image className="h-16 w-16 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Aucun sous-chapitre trouvé</h3>
              <p className="mt-2 text-muted-foreground">
                Il n'y a pas de sous-chapitres disponibles pour ce chapitre.
              </p>
            </div>
          )}
        </div>
      )}

      {seasonToDelete && (
        <Modal
          action="delete"
          message="Cette saison sera supprimée définitivement. Voulez-vous continuer ?"
          onConfirm={handleDeleteSeason}
          onCancel={() => setSeasonToDelete(null)}
        />
      )}

      {chapterToDelete && (
        <Modal
          action="delete"
          message="Ce chapitre sera supprimé définitivement. Voulez-vous continuer ?"
          onConfirm={handleDeleteChapter}
          onCancel={() => setChapterToDelete(null)}
        />
      )}

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la saison</DialogTitle>
          </DialogHeader>
          {seasonToEdit && <EditSeasonForm season={seasonToEdit} onClose={closeEditDialog} />}
        </DialogContent>
      </Dialog>

      {/* Add the EditChapterForm Dialog */}
      <Dialog open={editChapterDialogOpen} onOpenChange={setEditChapterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le chapitre</DialogTitle>
          </DialogHeader>
          {chapterToEdit && (
            <EditChapterForm 
              chapter={chapterToEdit} 
              onClose={closeEditChapterDialog}
              onSuccess={() => {
                refetchChapters();
                closeEditChapterDialog();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Seasons;
