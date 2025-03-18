import React from 'react';
import { XCircle, PenSquare } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  seasonId?: string;
  chapterId?: string;
  seasonName?: string; // Add this property to match what's passed from MainContent
}

interface VideoCardProps {
  video: Video;
  onVideoClick: (video: Video) => void;
  onDeleteClick: (id: string) => void;
  onEditClick: (video: Video, e: React.MouseEvent) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onVideoClick,
  onDeleteClick,
  onEditClick,
}) => {
  const getThumbnailPath = (thumbnailUrl: string, seasonId?: string) => {
    const baseUrl = 'https://draminesaid.com/videos/';
    if (seasonId === "0") {
      return `${baseUrl}${thumbnailUrl}`;
    }
    return `${baseUrl}saisonsimages/${thumbnailUrl}`;
  };

  return (
    <div className="bg-dashboard-card rounded-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02] relative flex flex-col">
      <div
        className="relative aspect-video"
        onClick={() => onVideoClick(video)}
      >
        <img
          src={getThumbnailPath(video.thumbnail, video.seasonId)}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <div className="bg-white rounded-full p-2 shadow hover:shadow-lg transition-shadow">
            <XCircle
              className="w-5 h-5 text-red-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick(video.id);
              }}
            />
          </div>
          <div className="bg-white rounded-full p-2 shadow hover:shadow-lg transition-shadow">
            <PenSquare
              className="w-5 h-5 text-blue-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onEditClick(video, e);
              }}
            />
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold mb-2 text-black">{video.title}</h3>
        <p className="text-sm text-black mb-4">{video.description}</p>
        {video.seasonName && (
          <span className="text-xs text-gray-500 mt-auto">{video.seasonName}</span>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
