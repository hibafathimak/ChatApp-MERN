import {
  ArrowLeft,
  Info,
  MessagesSquare,
  Phone,
  Send,
  Smile,
  Video,
  Image,
} from "lucide-react";
import { useEffect, useRef, useState, useContext } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import SingleImageModal from "./SingleImageModal";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const ChatContainer = ({ showInfo, setShowInfo }) => {
  const { selectedUser, setSelectedUser, messages, sendMessage, getMessages } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);
  const [inputMessage, setInputMessage] = useState("");
  const [singleImageModalOpen, setSingleImageModalOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const scrollEnd = useRef();

  const handleSingleImageClick = (imageUrl) => {
    setCurrentImageUrl(imageUrl);
    setSingleImageModalOpen(true);
  };

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return null;
    await sendMessage({ text: inputMessage.trim() });
    setInputMessage("");
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image")) {
      toast.error("Select an Image File");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  if (!selectedUser) {
    return (
      <div className="items-center justify-center h-full md:flex hidden bg-[#FFFDE7]">
        <div className="text-center px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FFD54F] rounded-full flex items-center justify-center mx-auto mb-4">
            <MessagesSquare className="w-8 h-8 sm:w-10 sm:h-10 text-[#3E2723]" />
          </div>
          <p className="text-[#8D6E63] text-base sm:text-lg">
            Select a chat to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative overflow-auto bg-[#FFFDE7]">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-[#FFD54F] shrink-0">
        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-full hover:bg-[#FFF9C4] transition-colors md:hidden"
        >
          <ArrowLeft className="w-5 h-5 text-[#8D6E63]" />
        </button>
        <div className="relative shrink-0">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt="user profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-[#3E2723] text-base sm:text-lg truncate">
            {selectedUser.userName}
          </h3>
          <p className="text-xs sm:text-sm text-[#F57F17] truncate">
            {onlineUsers?.includes(selectedUser._id) ? "Online" : "Offline"}
          </p>
        </div>

        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 rounded-full hover:bg-[#FFF9C4] transition-colors"
          >
            <Info className="w-4 h-4 cursor-pointer sm:w-5 sm:h-5 text-[#8D6E63]" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-4 pb-6">
        <div className="flex flex-col gap-4">
          {messages?.map((message, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                message.senderId === authUser._id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {message.senderId !== authUser._id && (
                <div className="flex flex-col items-center shrink-0">
                  <img
                    src={selectedUser.profilePic || assets.avatar_icon}
                    alt="sender"
                    className="w-7 h-7 rounded-full object-cover mb-1"
                  />
                  <p className="text-xs text-[#8D6E63]">
                    {formatMessageTime(message.createdAt)}
                  </p>
                </div>
              )}

              {/* Message Content */}
              <div
                className={`flex flex-col ${
                  message.senderId === authUser._id
                    ? "items-end"
                    : "items-start"
                }`}
              >
                {message.image ? (
                  <img
                    onClick={() => handleSingleImageClick(message.image)}
                    src={message.image}
                    className="max-w-[230px] cursor-pointer border border-[#FFD54F] rounded-lg"
                    alt="shared image"
                  />
                ) : (
                  <div
                    className={`p-3 max-w-[280px] text-sm rounded-xl break-words ${
                      message.senderId === authUser._id
                        ? " bg-[#FFF176] text-[#3E2723] rounded-br-none"
                        : "bg-[#FFF9C4] text-[#3E2723] rounded-bl-none"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                {message.senderId === authUser._id && (
                  <p className="text-xs text-[#8D6E63] mt-1">
                    {formatMessageTime(message.createdAt)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        <SingleImageModal
          isOpen={singleImageModalOpen}
          onClose={() => setSingleImageModalOpen(false)}
          imageUrl={currentImageUrl}
        />
        <div ref={scrollEnd}></div>
      </div>

      {/* Input Area */}
      <div className="px-4 py-3 border-t border-[#FFD54F] shrink-0">
        <div className="flex items-center gap-3">

          <div className="shrink-0">
            <input
              onChange={handleSendImage}
              type="file"
              id="image"
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
              hidden
            />
            <label htmlFor="image">
              <div className="p-2 cursor-pointer rounded-full hover:bg-[#FFF9C4] transition-colors">
                <Image className="w-5 h-5 text-[#8D6E63] hover:text-[#F57F17]" />
              </div>
            </label>
          </div>

          <div className="flex-1 flex items-center relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              rows={1}
              className="w-full bg-[#FFF9C4] border border-[#FFD54F] rounded-2xl px-4 py-3 text-sm text-[#3E2723] placeholder-[#8D6E63] focus:outline-none focus:ring-2 focus:ring-[#F57F17] focus:border-transparent resize-none min-h-[48px] max-h-32 overflow-y-auto"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#8D6E63 transparent",
              }}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8D6E63] hover:text-[#F57F17] transition-colors"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleSend}
            disabled={!inputMessage.trim()}
            className="bg-[#FFD54F] hover:bg-[#F57F17] disabled:bg-[#ffeb90] disabled:cursor-not-allowed text-[#3E2723] p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-[#FFD54F]/25 shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;