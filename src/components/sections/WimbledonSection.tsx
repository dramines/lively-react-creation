
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Pause, Play } from 'lucide-react';
import { useRef, useState } from 'react';
import AboutModal from '@/components/modals/AboutModal';

const WimbledonSection = () => {
  const { t } = useTranslation();
  const videoRefMobile = useRef<HTMLVideoElement>(null);
  const videoRefDesktop = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const togglePlayPause = () => {
    const mobileVideo = videoRefMobile.current;
    const desktopVideo = videoRefDesktop.current;
    
    if (mobileVideo && desktopVideo) {
      if (isPlaying) {
        mobileVideo.pause();
        desktopVideo.pause();
      } else {
        mobileVideo.play();
        desktopVideo.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAboutModalOpen = () => {
    setIsAboutModalOpen(true);
  };

  const handleAboutModalClose = () => {
    setIsAboutModalOpen(false);
  };

  return (
    <>
      <section className="relative">
        {/* Mobile Layout - Full video background with overlay */}
        <div className="md:hidden relative h-screen overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0">
            <video
              ref={videoRefMobile}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            >
              <source src="/hero.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Gray overlay */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Content overlay */}
          <div className="relative z-10 h-full flex flex-col justify-between p-6 text-white">
            {/* Top brand text */}
            <div className="pt-8">
              <p className="text-sm font-medium tracking-wider uppercase">{t('wimbledon.brand')}</p>
            </div>

            {/* Center content */}
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-5xl font-serif font-light mb-4 tracking-wide">
                {t('wimbledon.title')}
              </h2>
              <p className="text-lg font-light mb-8">
                {t('wimbledon.subtitle')}
              </p>
              <Button
                onClick={handleAboutModalOpen}
                className="bg-transparent border border-white text-white hover:bg-white hover:text-black px-8 py-3 text-base font-medium transition-all duration-300 w-fit"
              >
                {t('wimbledon.aboutUs')}
              </Button>
            </div>

            {/* Pause/Play button at bottom */}
            <div className="flex justify-start pb-8">
              <button 
                onClick={togglePlayPause}
                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white fill-white" />
                ) : (
                  <Play className="w-5 h-5 text-white fill-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Split screen with video left and image right */}
        <div className="hidden md:block">
          <div className="grid grid-cols-2 h-screen">
            {/* Left side - Video */}
            <div className="relative overflow-hidden bg-black">
              <video
                ref={videoRefDesktop}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              >
                <source src="/hero.mp4" type="video/mp4" />
              </video>
              
              {/* Content overlay on video */}
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-12 text-white">
                <div>
                  <p className="text-sm font-medium tracking-wider uppercase mb-2">{t('wimbledon.brand')}</p>
                </div>
                
                <div>
                  <h2 className="text-6xl font-serif font-light mb-4 tracking-wide">
                    {t('wimbledon.title')}
                  </h2>
                  <p className="text-xl font-light mb-8">
                    {t('wimbledon.subtitle')}
                  </p>
                  <Button
                    onClick={handleAboutModalOpen}
                    className="bg-transparent border border-white text-white hover:bg-white hover:text-black px-8 py-3 text-base font-medium transition-all duration-300"
                  >
                    {t('wimbledon.aboutUs')}
                  </Button>
                </div>

                <div className="flex justify-start">
                  <button 
                    onClick={togglePlayPause}
                    className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white fill-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white fill-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="relative overflow-hidden">
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url("/lovable-uploads/0b0f340f-5613-42f2-aa4f-09b16ed1d44c.png")`
                }}
              >
                {/* Content overlay on image */}
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-between p-12 text-white">
                  <div>
                    <p className="text-sm font-medium tracking-wider uppercase mb-2">{t('wimbledon.rlxBrand')}</p>
                  </div>
                  
                  <div>
                    <h2 className="text-6xl font-serif font-light mb-4 tracking-wide">
                      {t('wimbledon.summerTitle')}
                    </h2>
                    <p className="text-xl font-light mb-2">
                      {t('wimbledon.summerSubtitle1')}
                    </p>
                    <p className="text-xl font-light mb-8">
                      {t('wimbledon.summerSubtitle2')}
                    </p>
                    <Button
                      className="bg-transparent border border-white text-white hover:bg-white hover:text-black px-8 py-3 text-base font-medium transition-all duration-300"
                    >
                      {t('wimbledon.shopMen')}
                    </Button>
                  </div>

                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AboutModal isOpen={isAboutModalOpen} onClose={handleAboutModalClose} />
    </>
  );
};

export default WimbledonSection;
