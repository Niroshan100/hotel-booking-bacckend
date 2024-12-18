import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export function postUsers(req, res) {
  const user = req.body;
  const password = req.body.password;

  // Correct hashing with appropriate salt rounds
  const saltRounds = 10; // Recommended is 10-12
  const passwordHash = bcrypt.hashSync(password, saltRounds);
  user.password = passwordHash;

  const newUser = new User(user);
  newUser
    .save()
    .then(() => {
      res.json({
        message: "User created successfully",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "User creation failed",
        error: err.message,
      });
    });
}

export function loginUser(req, res) {
  const credentials = req.body;

  User.findOne({ email: credentials.email }).then((user) => {
    if (!user) {
      return res.status(403).json({
        message: "User not found",
      });
    }

    // Compare the password using bcrypt
    const passwordMatch = bcrypt.compareSync(
      credentials.password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(403).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT if password matches
    const payload = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      type: user.type,
    };

    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "48h" });

    res.json({
      message: "User authenticated successfully",
      user: user,
      token: token,
    });
  });
}
export function isAdminValid(req) {
  if (req.user == null) {
    return false;
  }
  if (req.user.type != "admin") {
    return false;
  }
  return true;
}
export function isCustomerValid(req) {
  if (req.user == null) {
    return false;
  }
  console.log(req.user);
  if (req.user.type != "customer") {
    return false;
  }

  return true;
}
