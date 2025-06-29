import { EllipsisVertical, MessagesSquare, Search } from "lucide-react";
import  { useState } from "react";
import assets from "../assets/assets";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { useEffect } from "react";

const LeftSidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);

  const [searchTerm, setSearchTerm] = useState("");
 
  const filteredUsers = searchTerm ? users.filter((user) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  ) : users;


  const { logout, onlineUsers } = useContext(AuthContext);
 
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div
      className={`bg-[#FFFDE7] md:border-r md:border-[#FFD54F] h-full p-5 rounded-r-xl overflow-y-scroll text-[#3E2723] ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div className="flex gap-2 sm:gap-3 items-center">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#FFD54F] rounded-lg flex items-center justify-center">
              <MessagesSquare className="w-4 h-4 sm:w-5 sm:h-5 text-[#3E2723]" />
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-[#3E2723]">
              BuzzChat
            </h4>
          </div>
          <div className="relative py-2 group">
            <EllipsisVertical className="w-5 h-5 cursor-pointer text-[#8D6E63] hover:text-[#3E2723]" />
            <div className="absolute top-full right-0 z-20 w-32 p-3 sm:p-5 rounded-md bg-[#FFF9C4] border border-[#FFD54F] text-[#3E2723] hidden group-hover:block">
              <Link
                to={"/profile"}
                className="cursor-pointer text-sm block mb-2"
              >
                Profile
              </Link>
              <hr className="my-2 border-t border-[#FFD54F]" />
              <p onClick={() => logout()} className="cursor-pointer text-sm">Logout</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#8D6E63]" />
          <input
            type="text"
            placeholder="Search here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FFF9C4] border border-[#FFD54F] rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 text-sm text-[#3E2723] placeholder-[#8D6E63] focus:outline-none focus:ring-2 focus:ring-[#F57F17] focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex flex-col overflow-y-auto px-2 sm:px-4 py-2 min-h-0">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <div
              key={user._id || index} 
              onClick={() =>{ setSelectedUser(user)}}
              className={`flex items-center relative gap-2 sm:gap-3 cursor-pointer p-2 sm:p-3 rounded-xl transition-all duration-200 hover:bg-[#FFF9C4] ${
                selectedUser?._id === user._id
                  ? "bg-[#FFF176] border border-[#e3dcc7]"
                  : ""
              }`}
            >
              <div className="relative shrink-0">
                <img
                  src={user?.profilePic || assets.avatar_icon}
                  alt={user?.userName}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[#FFD54F]"
                />
                { onlineUsers.includes(user._id) && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-[#F57F17] rounded-full border-2 border-[#FFFDE7]"></div>
                )}
              </div>
              <div className="flex flex-col leading-5">
                <p className="text-sm font-semibold text-[#3E2723] truncate">
                  {user.userName}
                </p>
                { onlineUsers.includes(user._id) ? (
                  <span className="text-xs text-[#F57F17]">Online</span>
                ) : (
                  <span className="text-xs text-[#8D6E63]">Offline</span>
                )}
              </div>
              {unseenMessages[user._id] && (
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#F57F17] absolute top-4 right-4 rounded-full flex items-center justify-center ml-2 shrink-0">
                  <span className="text-xs font-bold text-[#FFFDE7]">
                    {unseenMessages[user._id]}
                  </span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-[#8D6E63] text-sm">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;