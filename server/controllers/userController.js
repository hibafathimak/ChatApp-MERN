import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import users from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";

export const signup = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    if (!userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await users.create({
      userName,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      {
        _id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
      },
      process.env.JWT_SECRET    );


    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id, 
        userName: newUser.userName,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await users.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const token = jwt.sign(
      {
        _id: existingUser._id,
        userName: existingUser.userName,
        email: existingUser.email,
      },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: existingUser._id, 
        userName: existingUser.userName,
        email: existingUser.email,
      },
      token,
    });
  } catch (error) {
    console.error("[LOGIN ERROR]:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  const { profilePic, userName, email, phone, bio } = req.body;
  const userId = req.user._id;

  try {
    let profilePicUrl;
    if (profilePic) {
      const upload = await cloudinary.uploader.upload(profilePic);
      profilePicUrl = upload.secure_url;
    }

    const updateData = {
      userName,
      email,
      bio,
      ...(profilePicUrl && { profilePic: profilePicUrl }),
    };

    if (phone?.trim()) {
      updateData.phone = phone;
    }

    const updatedUser = await users
      .findByIdAndUpdate(userId, updateData, { new: true })
      .select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }


    res.status(200).json({
      message: "Profile Updated",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await users.findById(req.user._id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        profilePic: user.profilePic,
        phone: user.phone,
        bio: user.bio,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
