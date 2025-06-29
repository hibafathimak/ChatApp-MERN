import React, { useState } from "react";
import {
  ArrowLeft,
  Mail,
  MailIcon,
  PhoneCall,
  PhoneIcon,
  Search,
  SearchCheck,
  SearchIcon,
  X,
} from "lucide-react";
import { ImageGalleryModal } from "./ImageGallery";
import assets from "../assets/assets";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { useEffect } from "react";

const RightSidebar = ({ setShowInfo, showInfo, isMobile = false }) => {
  const { messages, selectedUser } = useContext(ChatContext);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [mediaItems, setMediaItems] = useState([]);

  useEffect(() => {
    setMediaItems(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  const openGallery = (index) => {
    setSelectedImageIndex(index);
    setIsGalleryOpen(true);
  };

  return (
    <>
      {showInfo && (
        <div className="bg-[#FFFDE7] shadow-xl text-[#3E2723] h-full overflow-y-auto relative">
          <button
            onClick={() => setShowInfo(false)}
            className="absolute top-4 right-4 text-[#8D6E63] hover:text-[#3E2723] p-2 rounded-full hover:bg-[#FFF9C4] transition-colors z-10"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 pt-16">
            {/* User Profile Section */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-4">
                <img
                  src={selectedUser?.profilePic || assets.avatar_icon}
                  alt={selectedUser?.userName}
                  className="w-20 h-20 rounded-full object-cover border-4 border-[#FFD54F]"
                />
              </div>
              <h3 className="text-xl font-bold text-[#3E2723] mb-2">
                {selectedUser?.userName || "Martin Johnson"}
              </h3>
              <p className="text-[#8D6E63] text-sm mb-4">
                {selectedUser?.bio || "Hey There!"}
              </p>
            </div>

            <hr className="border-t border-[#FFD54F] mb-6" />

            {/* Media Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[#3E2723] font-semibold">Media</h4>
                <span className="text-[#8D6E63] text-sm">
                  {mediaItems.length} items
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {mediaItems.map((item, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative"
                    onClick={() => openGallery(index)}
                  >
                    <img
                      src={item}
                      alt={`Media ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-[#FFD54F]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-[#FFF9C4] flex items-center justify-center">
                        <SearchIcon className="text-[#3E2723]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info Sections */}
            <div className="space-y-4">
              <div>
                <h4 className="text-[#3E2723] font-semibold mb-3">Contact Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3 text-[#8D6E63]">
                    <span className="p-2 text-[#FFFDE7] rounded-full bg-[#F57F17] flex items-center justify-center text-xs">
                      <MailIcon size={15} />
                    </span>
                    <span>
                      {selectedUser?.email || "martin.johnson@email.com"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[#F57F17]">
                    <span className="p-2 text-[#FFFDE7] rounded-full bg-[#F57F17] flex items-center justify-center text-xs">
                      <PhoneIcon size={15} />
                    </span>
                    <span>{selectedUser?.phone || "No Phone Availabe"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={mediaItems}
        initialIndex={selectedImageIndex}
      />
    </>
  );
};

export default RightSidebar;