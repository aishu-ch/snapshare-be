import User from "../models/user.js";
import asyncHandler from "express-async-handler";

export const getUsernameofLoggedInUser = asyncHandler(async (req, res) => {
  try {
    const findUser = await User.findById(req.user).select(
      "userName profilePic _id"
    );
    res.status(200).json(findUser);
  } catch (err) {
    throw err;
  }
});
