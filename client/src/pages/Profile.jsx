import { UserCircle, Mail, Phone, Camera, Save, User, User2, User2Icon, ArrowLeft } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const { authUser, updateUserProfile } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
const navigate = useNavigate()
  // Profile Info State - Initialize with current user data
  const [profileData, setProfileData] = useState({
    username: "",
    bio: "",
    email: "",
    phone: "",
  });

  // Initialize profile data when authUser is available
  useEffect(() => {
    if (authUser) {
      setProfileData({
        username: authUser.userName || authUser.username || "",
        bio: authUser.bio || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
      });
      // Set existing profile image if available
      if (authUser.profileImage || authUser.profilePic) {
        setPreviewImage(authUser.profileImage || authUser.profilePic);
      }
    }
  }, [authUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      
      // If no image is selected, just update profile data
      if (!profileImage) {
        const success = await updateUserProfile(profileData);
        if (success) {
          console.log("Profile updated successfully");
          navigate('/')
        }
        return;
      }

      // If image is selected, convert to base64 and include in update
      const reader = new FileReader();
      reader.readAsDataURL(profileImage);
      
      reader.onload = async () => {
        try {
          const base64Image = reader.result;
          
          // Combine profile data with image
          const updateData = {
            ...profileData,
            profilePic: base64Image // Use profilePic to match your backend expectation
          };
          
          const success = await updateUserProfile(updateData);
          
          if (success) {
            setProfileImage(null);
            console.log("Profile with image updated successfully");
            navigate('/')
          }
        } catch (error) {
          console.error("Error updating profile with image:", error);
        }
      };

      reader.onerror = () => {
        console.error("Error reading file");
        toast.error("Error reading image file");
      };

    } catch (error) {
      console.error("Profile update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Show loading state if user data isn't loaded yet
  if (!authUser) {
    return (
      <div className="w-full min-h-screen bg-[#FFFDE7] flex items-center justify-center">
        <div className="text-[#3E2723]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FFFDE7] flex items-center justify-center p-4 sm:p-8">
      <div className="bg-[#FFF9C4]/80 backdrop-blur-xl w-full max-w-4xl border-2 border-[#FFD54F]/30 rounded-2xl transition-all duration-300 overflow-hidden shadow-lg">
        <Link to={'/'}
      className="absolute top-4 left-4 text-[#3E2723] hover:text-[#F57F17] transition-colors p-2 rounded-full hover:bg-[#FFD54F]/20"
    >
      <ArrowLeft size={24} />
    </Link>
        <div className="flex flex-col md:flex-row items-center">
          {/* Left Column - Profile Image */}
          <div className="w-full md:w-1/3 p-6 sm:p-8 flex flex-col items-center">
            <div className="relative group mb-4">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-[#FFD54F]"
                />
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center border-4 border-[#FFD54F] bg-[#FFF176]/30">
                  <User2Icon className="w-20 h-20 text-[#3E2723]" />
                </div>
              )}

              <input
                type="file"
                onChange={handleImageChange}
                accept=".png,.jpg,.jpeg"
                className="hidden"
                id="profile"
              />
            </div>

            {/* Upload button */}
            <label
              className="cursor-pointer text-[#3E2723] flex gap-2 p-4 w-fit rounded-2xl bg-[#FFD54F]/20 hover:bg-[#FFD54F]/30 transition-colors border border-[#FFD54F]/50"
              htmlFor="profile"
            >
              <Camera /> Upload Profile
            </label>
          </div>

          {/* Right Column - Profile Form */}
          <div className="w-full md:w-2/3 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#3E2723] mb-6">
              Profile Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[#3E2723] text-sm mb-1 font-medium">
                  Username
                </label>
                <input
                  name="username"
                  value={profileData.username}
                  onChange={handleInputChange}
                  className="w-full bg-[#FFF176]/50 text-[#3E2723] border border-[#FFD54F]/40 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F57F17] focus:border-[#F57F17]"
                  type="text"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label className="block text-[#3E2723] text-sm mb-1 font-medium">Bio</label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  className="w-full bg-[#FFF176]/50 text-[#3E2723] border border-[#FFD54F]/40 rounded-lg px-4 py-2.5 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#F57F17] focus:border-[#F57F17] resize-vertical"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#3E2723] text-sm mb-1 font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-[#F57F17]" />
                    </div>
                    <input
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="w-full bg-[#FFF176]/50 text-[#3E2723] border border-[#FFD54F]/40 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F57F17] focus:border-[#F57F17]"
                      type="email"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#3E2723] text-sm mb-1 font-medium">
                    Phone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-[#F57F17]" />
                    </div>
                    <input
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-[#FFF176]/50 text-[#3E2723] border border-[#FFD54F]/40 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F57F17] focus:border-[#F57F17]"
                      type="tel"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="w-full sm:w-auto mt-6 bg-[#FFD54F] hover:bg-[#F57F17] disabled:bg-[#FFD54F]/50 disabled:cursor-not-allowed text-[#3E2723] py-2.5 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 shadow-md"
              >
                <Save size={18} /> 
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;