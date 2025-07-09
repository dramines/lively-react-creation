
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProductImage } from '@/utils/imageUtils';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  productId?: number;
}

const ProductImageGallery = ({ images, productName, productId = 1 }: ProductImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });
  const [imagePos, setImagePos] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMagnifierPos({ x, y });
    
    // Calculate the position on the actual image
    const imageX = (x / rect.width) * imageRef.current.naturalWidth;
    const imageY = (y / rect.height) * imageRef.current.naturalHeight;
    
    setImagePos({ x: imageX, y: imageY });
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 1) {
    return (
      <div className="aspect-[4/5] overflow-hidden rounded-lg bg-slate-100 relative">
        <div
          className="w-full h-full relative cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setShowMagnifier(true)}
          onMouseLeave={() => setShowMagnifier(false)}
        >
          <img
            ref={imageRef}
            src={getProductImage(images[0], productId?.toString())}
            alt={productName}
            className="w-full h-full object-cover"
          />
          
          {/* Magnifier */}
          {showMagnifier && (
            <div
              className="absolute border-2 border-white shadow-lg rounded-full pointer-events-none z-10"
              style={{
                width: '120px',
                height: '120px',
                left: `${magnifierPos.x - 60}px`,
                top: `${magnifierPos.y - 60}px`,
                backgroundImage: `url(${getProductImage(images[0], productId?.toString())})`,
                backgroundSize: `${imageRef.current?.naturalWidth! * 2}px ${imageRef.current?.naturalHeight! * 2}px`,
                backgroundPosition: `-${imagePos.x * 2 - 60}px -${imagePos.y * 2 - 60}px`,
                backgroundRepeat: 'no-repeat',
              }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-slate-100 group">
        <div
          className="w-full h-full relative cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setShowMagnifier(true)}
          onMouseLeave={() => setShowMagnifier(false)}
        >
          <img
            ref={imageRef}
            src={getProductImage(images[selectedImageIndex], productId?.toString())}
            alt={`${productName} - Vue ${selectedImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Magnifier */}
          {showMagnifier && (
            <div
              className="absolute border-2 border-white shadow-lg rounded-full pointer-events-none z-10"
              style={{
                width: '120px',
                height: '120px',
                left: `${magnifierPos.x - 60}px`,
                top: `${magnifierPos.y - 60}px`,
                backgroundImage: `url(${getProductImage(images[selectedImageIndex], productId?.toString())})`,
                backgroundSize: `${imageRef.current?.naturalWidth! * 2}px ${imageRef.current?.naturalHeight! * 2}px`,
                backgroundPosition: `-${imagePos.x * 2 - 60}px -${imagePos.y * 2 - 60}px`,
                backgroundRepeat: 'no-repeat',
              }}
            />
          )}
        </div>
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={prevImage}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={nextImage}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
            {selectedImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`aspect-square overflow-hidden rounded-lg bg-slate-100 transition-all duration-200 ${
                selectedImageIndex === index 
                  ? 'ring-2 ring-slate-900 ring-offset-2' 
                  : 'hover:opacity-75'
              }`}
            >
              <img
                src={getProductImage(image, productId?.toString())}
                alt={`${productName} - Miniature ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
