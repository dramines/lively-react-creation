
import { useState } from 'react';
import { Play } from 'lucide-react';
import VideoModal from './VideoModal';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import Image from './ui/image';

const VideoSection = () => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const { t } = useTranslation();
  const { clientType } = useApp();
  
  // Determine which video to show based on client type
  const videoUrl = clientType === 'B2B' ? 'videob2b.mp4' : 'pubtazart.mp4';
  
  // Also determine which thumbnail to show based on client type
  const thumbnailUrl = clientType === 'B2B' ? 'video-thumbnailb2b.png' : 'video-thumbnail.png';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto"
    >
      <div className="relative overflow-hidden rounded-2xl group">
        {/* Video Thumbnail */}
        <div 
          className="relative w-full h-[350px] cursor-pointer overflow-hidden rounded-2xl"
          onClick={() => setVideoModalOpen(true)}
        >
          {/* Thumbnail Image */}
          <Image 
            src={thumbnailUrl} 
            alt={t('video_section.thumbnail_alt')}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            fallback="/placeholder.png"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
          
          {/* Play Button */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-20 h-20 bg-white/90 rounded-full shadow-lg group-hover:bg-[#96cc39] transition-colors duration-300"
            >
              <Play className="w-8 h-8 ml-1 text-[#64381b]" />
            </motion.div>
          </div>
          
          {/* Video Duration Label */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
            00:16
          </div>
        </div>

        {/* Video Title - Shown at bottom of thumbnail */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
          <h3 className="text-xl font-medium">{t('video_section.title')}</h3>
          <p className="text-sm text-white/80">{t('video_section.subtitle')}</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <h2 className="text-3xl font-playfair text-[#64381b]">
          {t('video_section.quality_title')}
        </h2>
        <p className="text-gray-600 leading-relaxed">
          {t('video_section.quality_description')}
        </p>
        <div className="flex flex-wrap gap-4">
          <span className="px-4 py-2 bg-[#96cc39]/10 text-[#64381b] rounded-full text-sm">
            {t('video_section.tag_1')}
          </span>
          <span className="px-4 py-2 bg-[#96cc39]/10 text-[#64381b] rounded-full text-sm">
            {t('video_section.tag_2')}
          </span>
          <span className="px-4 py-2 bg-[#96cc39]/10 text-[#64381b] rounded-full text-sm">
            {t('video_section.tag_3')}
          </span>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal 
        isOpen={videoModalOpen} 
        onClose={() => setVideoModalOpen(false)}
        videoUrl={videoUrl}
      />
    </motion.div>
  );
};

export default VideoSection;
