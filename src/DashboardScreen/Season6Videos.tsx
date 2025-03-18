
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchVideosByCategory } from '@/api/videos';
import { deleteVideo } from '@/api/videos';
import VideoCard from '@/components/video/VideoCard';
import { Skeleton } from '@/components/ui/skeleton';
import { EditVideoModal } from '@/components/video/EditVideoModal';
import { useToast } from '@/hooks/use-toast';
import Modal from './Modal';
import { Video } from '@/types/chapters';

const Season6Videos: React.FC = () => {
  const { toast } = useToast();
  const [videoToEdit, setVideoToEdit] = useState<Video | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fixed values for season 6 and category "chap12cap"
  const seasonId = "6";
  const videoCategory = "chap12cap";

  const { data: videos, isLoading, refetch } = useQuery({
    queryKey: ['videos', 'season6', videoCategory],
    queryFn: () => fetchVideosByCategory(videoCategory, seasonId),
  });

  const handleEditVideo = (video: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setVideoToEdit({
      id_video: video.id,
      saison: video.seasonId,
      cat_video: videoCategory,
      name_video: video.title,
      descri_video: video.description,
      url_video: video.videoUrl,
      url_thumbnail: video.thumbnail,
      created_at: '',
      seasonName: video.seasonName
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteVideo = async () => {
    if (!videoToDelete) return;
    
    try {
      const response = await deleteVideo(videoToDelete);
      
      if (response.success) {
        toast({
          title: "Succès",
          description: "Vidéo supprimée avec succès",
        });
        refetch();
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: response.message || "Échec de la suppression de la vidéo",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
      });
    } finally {
      setVideoToDelete(null);
    }
  };

  const handleVideoClick = (video: any) => {
    // Video player functionality can be added here
    console.log('Video clicked:', video);
  };

  // Map the API response to the format expected by VideoCard
  const mapVideosToCardFormat = (apiVideos: any[]) => {
    return apiVideos?.map((video) => ({
      id: video.id_video,
      title: video.name_video,
      description: video.descri_video,
      videoUrl: video.url_video,
      thumbnail: video.url_thumbnail,
      seasonId: video.saison,
      chapterId: video.id_chapter,
      seasonName: `Season ${video.saison}`
    })) || [];
  };

  if (isLoading) {
    return (
      <div className="p-6 mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(null).map((_, index) => (
          <Skeleton key={`video-skeleton-${index}`} className="h-[300px] w-full" />
        ))}
      </div>
    );
  }

  const formattedVideos = mapVideosToCardFormat(videos || []);

  return (
    <div className="p-6 mt-16 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Videos from Season 6 - Category "chap12cap"</h2>
      </div>

      {formattedVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formattedVideos.map((video) => (
            <VideoCard
              key={`video-${video.id}`}
              video={video}
              onVideoClick={handleVideoClick}
              onDeleteClick={(id) => setVideoToDelete(id)}
              onEditClick={handleEditVideo}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No videos found for this category.</p>
        </div>
      )}

      {/* Edit Video Modal */}
      {videoToEdit && (
        <EditVideoModal
          video={videoToEdit}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setVideoToEdit(null);
          }}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setVideoToEdit(null);
            refetch();
          }}
        />
      )}

      {/* Delete Video Modal */}
      {videoToDelete && (
        <Modal
          action="delete"
          message="Cette vidéo sera supprimée définitivement. Voulez-vous continuer ?"
          onConfirm={handleDeleteVideo}
          onCancel={() => setVideoToDelete(null)}
        />
      )}
    </div>
  );
};

export default Season6Videos;
