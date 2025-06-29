import React, { useState } from "react";
import LeftSidebar from "../components/LeftSidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const Home = () => {
  const { selectedUser } = useContext(ChatContext);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="w-full h-screen sm:py-10 sm:px-[15%] bg-[#ffffff]">
      <div className="max-w-7xl mx-auto h-full">
        <div className="h-full bg-[#ffffff] backdrop-blur-xl border-2 border-[#FFD54F]/30 rounded-lg sm:rounded-2xl overflow-hidden lg:hidden shadow-lg">
          {!selectedUser ? (
            <LeftSidebar />
          ) : showInfo ? (
            <RightSidebar
              showInfo={showInfo}
              setShowInfo={setShowInfo}
              isMobile={true}
            />
          ) : (
            <ChatContainer showInfo={showInfo} setShowInfo={setShowInfo} />
          )}
        </div>

        <div
          className={`h-full bg-[#FFF9C4]/80 backdrop-blur-xl border-2 border-[#FFD54F]/30 rounded-2xl overflow-hidden hidden lg:grid transition-all duration-300 shadow-lg ${
            showInfo
              ? "grid-cols-[320px_1fr_300px] xl:grid-cols-[350px_1fr_320px]"
              : "grid-cols-[320px_1fr] xl:grid-cols-[350px_1fr]"
          }`}
        >
          <LeftSidebar />
          <ChatContainer showInfo={showInfo} setShowInfo={setShowInfo} />
          {showInfo && (
            <RightSidebar
              showInfo={showInfo}
              setShowInfo={setShowInfo}
              isMobile={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;