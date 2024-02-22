import User from "../models/User.js";

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ message: "wrong username", success: false });
    }

    const verifiedPassword = await user.verifyPassword(password);

    if (!verifiedPassword) {
      return res
        .status(401)
        .json({ message: "wrong password", success: false });
    }

    const token = await user.generateAccessToken();

    res.status(200).json({
      message: "Login successful",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        projects: user.projects,
      },
      token,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const signup = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username already exist", success: false });
    }
    const newUser = await User.create({
      username,
      password,
    });

    if (!newUser) {
      return res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }

    const token = await newUser.generateAccessToken();

    res.status(201).json({
      message: "Signup successful",
      success: true,
      user: {
        id: newUser._id,
        username: newUser.username,
        projects: newUser.projects,
      },
      token,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
