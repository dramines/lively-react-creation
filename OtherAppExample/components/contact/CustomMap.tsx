
import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const CustomMap = () => {
  const { t } = useTranslation('contact');
  const mapRef = useRef<HTMLDivElement>(null);

  const openInGoogleMaps = () => {
    window.open('https://www.google.com/maps/place/LUCCI+BY+EY/@36.8451592,10.2796456,17.25z/data=!4m6!3m5!1s0x12fd4b54c671e80f:0x79479b20427055ed!8m2!3d36.8454017!4d10.2806987!16s%2Fg%2F11h7bx0pg4?entry=ttu&g_ep=EgoyMDI1MDYyMy4yIKXMDSoASAFQAw%3D%3D', '_blank');
  };

  const getDirections = () => {
    window.open('https://www.google.com/maps/dir//LUCCI+BY+EY,+Tunis,+Tunisia/@36.8454017,10.2806987,17z', '_blank');
  };

  const callUs = () => {
    window.open('tel:+21671123456', '_self');
  };

  return (
    <div ref={mapRef} className="relative h-full w-full min-h-[600px]">
      {/* Map Background with Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.857446464!2d10.278095815368739!3d36.84540187995159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd4b54c671e80f%3A0x79479b20427055ed!2sLUCCI%20BY%20EY!5e0!3m2!1sen!2s!4v1735311234567!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'contrast(1.1) saturate(1.2)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0"
        />
        
        {/* Custom Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Location Info Card */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-white/20">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-slate-900 p-2 rounded-full">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-gray-900">LUCCI BY EY</h3>
                  <p className="text-sm text-gray-600">{t('premiumFashionStore')}</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mb-2">
                Avenue Habib Bourguiba, Tunis, Tunisia
              </p>
              
              <p className="text-sm text-gray-700 mb-4">
                {t('phone')}: +216 71 123 456
              </p>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={callUs}
                  size="sm"
                  className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:via-slate-700 hover:to-slate-800 text-white transition-all"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {t('callUs')}
                </Button>
                
                <Button
                  onClick={getDirections}
                  size="sm"
                  className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:via-slate-700 hover:to-slate-800 text-white transition-all"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  {t('getDirections')}
                </Button>
                
                <Button
                  onClick={openInGoogleMaps}
                  variant="outline"
                  size="sm"
                  className="border-slate-900 text-slate-900 hover:bg-gradient-to-br hover:from-slate-900 hover:via-slate-800 hover:to-slate-900 hover:text-white transition-all"
                >
                  {t('viewOnGoogleMaps')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-900 via-slate-600 to-slate-900"></div>
    </div>
  );
};

export default CustomMap;
