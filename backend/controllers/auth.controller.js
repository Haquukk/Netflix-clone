import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export const signUp = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username)
      return res.status(400).json({ error: "Please fill all the fields" });

    const emailRegex = /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ error: "Invalid email" }); 

    if (password.length < 6)
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });

    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ error: "Email already exists" });

    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res.status(400).json({ error: "Username already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
    });

    generateTokenAndSetCookie(newUser._id, res);

    await newUser.save();

    res.status(200).json({ message: "User created successfully", newUser });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(error.message);
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Please fill all the fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "wrong email or password" });

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(error.message);
  }
};

export const logout = async (req, res) => {
  try {
    Object.keys(req.cookies).forEach((cookieName) => {
      if (cookieName.startsWith("jwt")) {
        res.clearCookie(cookieName);
      }
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(error.message);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(400).json({ error: "User does not exist" });
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(error.message);
  }
};
