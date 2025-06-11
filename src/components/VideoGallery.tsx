import { useState, useRef, useEffect } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const VideoGallery = () => {
  const [selectedMedia, setSelectedMedia] = useState<{ type: 'video' | 'image', url: string } | null>(null);
  const [videoThumbnails, setVideoThumbnails] = useState<{ [key: string]: string }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const mediaItems = [
    { id: 1, type: 'video' as const, thumbnail: '', url: '/1.mp4' },
    { id: 2, type: 'image' as const, thumbnail: '/lovable-uploads/751d708c-b32e-4861-93e2-683ec5252510.png', url: '/lovable-uploads/751d708c-b32e-4861-93e2-683ec5252510.png' },
    { id: 3, type: 'video' as const, thumbnail: '', url: '/2.mp4' },
    { id: 4, type: 'image' as const, thumbnail: '/lovable-uploads/cc88a882-73dc-4e0a-b092-a214e799a4d2.png', url: '/lovable-uploads/cc88a882-73dc-4e0a-b092-a214e799a4d2.png' },
    { id: 5, type: 'video' as const, thumbnail: '', url: '/3.mp4' },
    { id: 6, type: 'image' as const, thumbnail: '/lovable-uploads/7f14e9cc-86f0-496a-b521-a2b353d197cd.png', url: '/lovable-uploads/7f14e9cc-86f0-496a-b521-a2b353d197cd.png' },
    { id: 7, type: 'video' as const, thumbnail: '', url: '/4.mp4' },
    { id: 8, type: 'video' as const, thumbnail: '', url: '/5.mp4' }
  ];

  // Auto-scroll effect
  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollAmount = 320; // Width of one item plus gap
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        if (container.scrollLeft >= maxScroll) {
          // Reset to beginning with smooth transition
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3000); // Scroll every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  // Pause auto-scroll on hover
  const handleMouseEnter = () => setIsAutoScrolling(false);
  const handleMouseLeave = () => setIsAutoScrolling(true);

  useEffect(() => {
    const generateThumbnail = (videoUrl: string): Promise<string> => {
      return new Promise((resolve) => {
        const video = document.createElement('video');
        video.crossOrigin = 'anonymous';
        video.src = videoUrl;
        video.muted = true;

        video.addEventListener('loadedmetadata', () => {
          video.currentTime = video.duration / 2;
        });

        video.addEventListener('seeked', () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
            resolve(thumbnail);
          } else {
            resolve('https://via.placeholder.com/600x400?text=Thumbnail+Unavailable');
          }
        });

        video.addEventListener('error', () => {
          resolve('https://via.placeholder.com/600x400?text=Error+Loading+Video');
        });
      });
    };

    const generateAllThumbnails = async () => {
      const thumbnails: { [key: string]: string } = {};

      for (const item of mediaItems) {
        if (item.type === 'video') {
          try {
            const thumb = await generateThumbnail(item.url);
            thumbnails[item.url] = thumb;
          } catch (err) {
            thumbnails[item.url] = 'https://via.placeholder.com/600x400?text=Failed+To+Generate';
          }
        }
      }

      setVideoThumbnails(thumbnails);
    };

    generateAllThumbnails();
  }, []);

  const scrollLeft = () => {
    setIsAutoScrolling(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
    setTimeout(() => setIsAutoScrolling(true), 5000); // Resume after 5 seconds
  };

  const scrollRight = () => {
    setIsAutoScrolling(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
    setTimeout(() => setIsAutoScrolling(true), 5000); // Resume after 5 seconds
  };

  const getThumbnail = (item: typeof mediaItems[0]) => {
    return item.type === 'image'
      ? item.thumbnail
      : videoThumbnails[item.url] || 'https://via.placeholder.com/600x400?text=Loading...';
  };

  return (
    <section className="py-8 md:py-16 relative overflow-hidden">
      {/* Background decorative elements - keeping only subtle floating circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-sweet-mint rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-pastel-blue rounded-full opacity-15 animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-40 right-1/5 w-28 h-28 bg-sweet-mint rounded-full opacity-10 animate-pulse" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 font-baloo relative">
            <span className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 bg-clip-text text-transparent">
              Faites vivre l'aventure à votre Héros
            </span>
          </h2>
        </div>

        <div className="relative">
          <button
            onClick={scrollLeft}
            className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg rounded-full p-2 md:p-3 transition-all duration-300 hover:scale-110 hidden sm:block backdrop-blur-sm border border-white/50"
          >
            <ChevronLeft className="w-5 h-5 md:w-7 md:h-7 text-gray-700" />
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg rounded-full p-2 md:p-3 transition-all duration-300 hover:scale-110 hidden sm:block backdrop-blur-sm border border-white/50"
          >
            <ChevronRight className="w-5 h-5 md:w-7 md:h-7 text-gray-700" />
          </button>

          <div className="overflow-hidden px-4 sm:px-16">
            <div
              ref={scrollContainerRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="flex space-x-4 md:space-x-8 overflow-x-auto pb-4 sm:pb-0 scrollbar-hide transition-all duration-1000"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              {mediaItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-64 md:w-80 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer border border-white/50 hover:scale-105 hover:rotate-1"
                  onClick={() => setSelectedMedia({ type: item.type, url: item.url })}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))'
                  }}
                >
                  <div className="relative group overflow-hidden">
                    <img
                      src={getThumbnail(item)}
                      alt={`${item.type === 'video' ? 'Video' : 'Image'} ${item.id} thumbnail`}
                      className="w-full h-80 md:h-[480px] object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {item.type === 'video' && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-all duration-500">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-white/95 rounded-full flex items-center justify-center hover:bg-white hover:scale-125 transition-all duration-300 shadow-lg backdrop-blur-sm border border-white/50 group-hover:shadow-2xl">
                          <Play className="w-5 h-5 md:w-7 md:h-7 text-pastel-lavender ml-1" fill="currentColor" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black border-0">
          <div className="relative">
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>
            {selectedMedia && (
              selectedMedia.type === 'video' ? (
                <video src={selectedMedia.url} className="w-full h-[60vh] md:h-[70vh]" controls autoPlay />
              ) : (
                <img src={selectedMedia.url} alt="Gallery image" className="w-full h-[60vh] md:h-[70vh] object-contain" />
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default VideoGallery;
