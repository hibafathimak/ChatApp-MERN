import React from "react";
import { X, Download, Share2 } from "lucide-react";

const SingleImageModal = ({ 
  isOpen, 
  onClose, 
  imageUrl,
  className = ""
}) => {
  if (!isOpen || !imageUrl) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `image.jpg`;
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
          url: imageUrl
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(imageUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
  {/* Backdrop */}
  <div 
    className="absolute inset-0 bg-[#3E2723]/80 backdrop-blur-sm transition-opacity"
    onClick={onClose}
  />
  
  {/* Modal Content */}
  <div className={`
    relative w-full mx-4 max-h-[90vh] overflow-auto
    max-w-4xl
    ${className}
  `}>
    {/* Close button */}
    <button
      onClick={onClose}
      className="absolute top-4 right-4 z-20 p-3 rounded-full bg-[#3E2723]/50 text-[#FFFDE7] hover:bg-[#3E2723]/70 transition-colors"
    >
      <X className="w-6 h-6" />
    </button>
    
    {/* Action buttons */}
    <div className="absolute top-4 left-4 z-20 flex gap-2">
      <button
        onClick={handleDownload}
        className="p-3 rounded-full bg-[#3E2723]/50 text-[#FFFDE7] hover:bg-[#F57F17] hover:text-[#3E2723] transition-colors"
        title="Download"
      >
        <Download className="w-5 h-5" />
      </button>
      <button
        onClick={handleShare}
        className="p-3 rounded-full bg-[#3E2723]/50 text-[#FFFDE7] hover:bg-[#F57F17] hover:text-[#3E2723] transition-colors"
        title="Share"
      >
        <Share2 className="w-5 h-5" />
      </button>
    </div>
    
    {/* Main image */}
    <div className="w-full h-full flex items-center justify-center p-8">
      <img
        src={imageUrl}
        alt="Shared content"
        className="max-w-full max-h-full object-contain rounded-lg border-2 border-[#FFD54F]"
      />
    </div>
  </div>
</div>
  );
};

export default SingleImageModal;