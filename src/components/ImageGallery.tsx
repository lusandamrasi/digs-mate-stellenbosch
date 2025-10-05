import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  alt: string;
  className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openGallery = (index: number = 0) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  // Create collage layout for thumbnails
  const renderThumbnailLayout = () => {
    if (images.length === 1) {
      return (
        <div className="relative group cursor-pointer" onClick={() => openGallery(0)}>
          <img
            src={images[0]}
            alt={alt}
            className={`w-full h-48 md:h-full object-cover transition-transform group-hover:scale-105 ${className}`}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
        </div>
      );
    }

    if (images.length === 2) {
      return (
        <div className="relative group cursor-pointer" onClick={() => openGallery(0)}>
          <div className="grid grid-cols-2 gap-1 h-48 md:h-full">
            <img
              src={images[0]}
              alt={alt}
              className="w-full h-full object-cover"
            />
            <img
              src={images[1]}
              alt={alt}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
            +{images.length}
          </div>
        </div>
      );
    }

    if (images.length === 3) {
      return (
        <div className="relative group cursor-pointer" onClick={() => openGallery(0)}>
          <div className="grid grid-cols-2 gap-1 h-48 md:h-full">
            <div className="row-span-2">
              <img
                src={images[0]}
                alt={alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <img
                src={images[1]}
                alt={alt}
                className="w-full h-1/2 object-cover"
              />
              <img
                src={images[2]}
                alt={alt}
                className="w-full h-1/2 object-cover"
              />
            </div>
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
            +{images.length}
          </div>
        </div>
      );
    }

    // 4 or more images - 2x2 grid with overlay
    return (
      <div className="relative group cursor-pointer" onClick={() => openGallery(0)}>
        <div className="grid grid-cols-2 gap-1 h-48 md:h-full">
          <img
            src={images[0]}
            alt={alt}
            className="w-full h-full object-cover"
          />
          <img
            src={images[1]}
            alt={alt}
            className="w-full h-full object-cover"
          />
          <img
            src={images[2]}
            alt={alt}
            className="w-full h-full object-cover"
          />
          <div className="relative">
            <img
              src={images[3]}
              alt={alt}
              className="w-full h-full object-cover"
            />
            {images.length > 4 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <span className="text-white text-lg font-semibold">+{images.length - 3}</span>
              </div>
            )}
          </div>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
          +{images.length}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderThumbnailLayout()}
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
          <DialogHeader className="p-4 border-b">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-lg font-semibold">
                {images.length} {images.length === 1 ? 'Photo' : 'Photos'}
              </DialogTitle>
              
            </div>
          </DialogHeader>
          
          <div className="flex-1 relative bg-black">
            <img
              src={images[currentIndex]}
              alt={`${alt} - Image ${currentIndex + 1}`}
              className="w-full h-full object-contain"
            />
            
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white h-10 w-10 p-0"
                >
                  <ChevronLeft size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white h-10 w-10 p-0"
                >
                  <ChevronRight size={20} />
                </Button>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <div className="flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageGallery;
