const User = require("../models/user");
const jwt = require("jsonwebtoken");

// ================= TOKEN =================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// ================= REGISTER USER =================
exports.registerUser = async (req, res) => {
  try {
console.log("REGISTER API HIT 👉", req.body); //

    const { fullName, email, password, profileImageUrl } = req.body || {};

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // ❌ NO manual hashing here
    // ✅ password will be hashed by UserSchema.pre("save")

    const user = await User.create({
      fullName,
      email,
      password, // 👈 plain password
      profileImageUrl,
    });

    const { password: _, ...userData } = user._doc;

    return res.status(201).json({
      user: userData,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("REGISTER ERROR 👉", error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN USER =================
exports.loginUser = async (req, res) => {
  try {
    console.log("LOGIN BODY 👉", req.body);

    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ use model method (ONLY ONCE)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const { password: _, ...userData } = user._doc;

    return res.status(200).json({
      user: userData,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("LOGIN ERROR 👉", err);
    return res.status(500).json({
      message: "Error logging in user",
      error: err.message,
    });
  }
};

// ================= GET USER INFO =================
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("GET USER ERROR 👉", err);
    return res.status(500).json({
      message: "Error getting user info",
      error: err.message,
    });
  }
};
