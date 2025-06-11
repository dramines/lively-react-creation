
import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const VideoGallery = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const videos = [
    {
      id: 1,
      title: "L'aventure de Lucas",
      thumbnail: "/video1-thumb.jpg",
      videoUrl: "/video1.mp4"
    },
    {
      id: 2,
      title: "Emma et le dragon magique",
      thumbnail: "/video2-thumb.jpg", 
      videoUrl: "/video2.mp4"
    },
    {
      id: 3,
      title: "Le voyage de Noah",
      thumbnail: "/video3-thumb.jpg",
      videoUrl: "/video3.mp4"
    }
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/6 w-32 h-32 bg-sweet-mint rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-1/5 w-24 h-24 bg-pastel-lavender rounded-full opacity-20 animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-powder-pink rounded-full opacity-15 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-16 right-1/3 w-28 h-28 bg-pastel-blue rounded-full opacity-25 animate-bounce" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Title with decorative line */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-700 mb-4 font-baloo">
            Faites vivre l'aventure à votre Héros
          </h2>
          
          {/* Decorative line element */}
          <div className="flex items-center justify-center">
            <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-transparent to-sweet-mint rounded-full"></div>
            <div className="w-3 h-3 bg-sweet-mint rounded-full mx-3 shadow-lg"></div>
            <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-sweet-mint via-pastel-lavender to-light-coral rounded-full"></div>
            <div className="w-3 h-3 bg-light-coral rounded-full mx-3 shadow-lg"></div>
            <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-light-coral to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {videos.map((video) => (
            <div 
              key={video.id}
              className="group relative bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border border-white/50"
              onClick={() => setSelectedVideo(video.videoUrl)}
            >
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-pastel-blue to-pastel-lavender">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
                    <Play className="w-6 h-6 md:w-8 md:h-8 text-slate-700 ml-1" />
                  </div>
                </div>

                {/* Sparkle Effect */}
                <div className="absolute top-4 right-4 w-4 h-4 bg-pale-yellow rounded-full opacity-80 animate-ping"></div>
                <div className="absolute bottom-4 left-4 w-3 h-3 bg-sweet-mint rounded-full opacity-60 animate-pulse" style={{animationDelay: '0.5s'}}></div>
              </div>

              {/* Video Info */}
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-slate-700 group-hover:text-pastel-lavender transition-colors duration-300 font-baloo">
                  {video.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl w-[95vw] max-w-[95vw] sm:w-full p-0 bg-black border-none">
          <div className="relative aspect-video">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-300"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            
            {selectedVideo && (
              <video
                src={selectedVideo}
                controls
                autoPlay
                className="w-full h-full rounded-lg"
              >
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default VideoGallery;
