import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Download, Share2 } from "lucide-react";

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  size = "medium", 
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = ""
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    small: "max-w-md",
    medium: "max-w-2xl",
    large: "max-w-4xl",
    full: "max-w-7xl"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#3E2723]/80 backdrop-blur-sm transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* Modal Content */}
      <div className={`
        relative w-full mx-4 max-h-[90vh] overflow-auto
        ${sizeClasses[size]}
        ${className}
      `}>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#FFD54F]/90 text-[#3E2723] hover:bg-[#F57F17] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

// Image Gallery Modal Component
const ImageGalleryModal = ({ 
  isOpen, 
  onClose, 
  images, 
  initialIndex = 0 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(images[currentIndex]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `image-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Shared Image',
          url: images[currentIndex]
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      navigator.clipboard.writeText(images[currentIndex]);
    }
  };

  if (!isOpen || !images.length) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="full"
      className="bg-transparent"
      showCloseButton={false}
    >
      <div className="relative h-full flex items-center justify-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-3 rounded-full bg-[#FFD54F]/90 text-[#3E2723] hover:bg-[#F57F17] transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Action buttons */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <button
            onClick={handleDownload}
            className="p-3 rounded-full bg-[#FFD54F]/90 text-[#3E2723] hover:bg-[#F57F17] transition-colors"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={handleShare}
            className="p-3 rounded-full bg-[#FFD54F]/90 text-[#3E2723] hover:bg-[#F57F17] transition-colors"
            title="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-[#FFD54F]/90 text-[#3E2723] hover:bg-[#F57F17] transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-[#FFD54F]/90 text-[#3E2723] hover:bg-[#F57F17] transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Main image */}
        <div className="w-full h-full flex items-center justify-center p-8">
          <img
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg border-2 border-[#FFD54F]"
          />
        </div>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-[#FFD54F]/90 text-[#3E2723] text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-2 p-2 rounded-lg bg-[#FFD54F]/90 max-w-xs overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${
                  index === currentIndex 
                    ? 'border-[#F57F17]' 
                    : 'border-[#FFF9C4] opacity-70 hover:opacity-100 hover:border-[#F57F17]'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export { Modal, ImageGalleryModal };