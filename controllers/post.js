import Post from "../models/post.js";
import User from "../models/user.js";
import path from "path";
import DatauriParser from "datauri/parser.js";
import { uploader } from "../config/cloudinary.js";
import { match } from "assert";

export const createPost = async (req, res) => {
  console.log(req.body);
  const newPost = new Post({
    photo: req.body.photo,
    caption: req.body.caption,
    postedBy: req.user,
  });

  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
    await User.findOneAndUpdate(
      { _id: req.user },
      { $push: { posts: savedPost._id }, $inc: { postCount: 1 } },
      { new: true }
    );
    console.log("New post created");
  } catch (err) {
    throw err;
  }
};

export const uploadContentToCloudinary = (req, res) => {
  console.log("req.file: ", req.file);
  const parser = new DatauriParser();
  const extName = path.extname(req.file.originalname).toString();
  const file64 = parser.format(extName, req.file.buffer);
  return uploader
    .upload(file64.content)
    .then((result) => {
      const image = result.url;
      return res.status(200).json({
        message: "Your image has been uploaded to cloudinary",
        data: {
          image,
        },
      });
    })
    .catch((err) =>
      res.status(400).json({
        message: "Something went wrong with your upload to cloudinary",
        data: { err },
      })
    );
};

export const deletePost = async (req, res) => {
  try {
    const postedBy = await Post.findById(req.params.postid).select("postedBy");
    // console.log(postedBy.postedBy)
    if (postedBy.postedBy == req.user) {
      await Post.findByIdAndDelete(req.params.postid);
      await User.findByIdAndUpdate(req.user, {
        $pull: { posts: req.params.postid },
        $inc: { postCount: -1 },
      });
      res.status(200).json("Post deleted");
    } else {
      res.json("Cannot delete somebody else's post.");
    }
  } catch (err) {
    throw err;
  }
};

// Edit post caption only, not photo/video
export const editPostCaption = async (req, res) => {
  try {
    const postedBy = await Post.findById(req.params.postid).select("postedBy");
    if (postedBy.postedBy == req.user) {
      const post = await Post.findByIdAndUpdate(
        req.params.postid,
        { $set: { caption: req.body.caption } },
        { new: true }
      );
      res.status(200).json(post);
    } else {
      console.log("Cannot edit a post if it is not yours.");
    }
  } catch (err) {
    console.log(err);
  }
};

export const getExplorePosts = async (req, res) => {
  try {
    Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "postedBy",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $match: {
          "user.userName": { $ne: req.query.userName },
        },
      },
    ])
      .exec()
      .then((posts) => {
        console.log(posts);
        res.status(200).json(posts);
      })
      .then((err) => console.error(err));
  } catch (err) {
    throw err;
  }
};

const getMyPosts = async (req) => {
  try {
    const myPosts = await User.findById(req.user).populate({
      path: "posts",
      populate: { path: "postedBy likes", select: "userName profilePic" },
    });
    return myPosts.posts;
  } catch (error) {
    throw error;
  }
};

export const getSubscribedPosts = async (req, res) => {
  try {
    const findUser = await User.findById(req.user)
      .select("following -_id")
      .populate({
        path: "following",
        populate: {
          path: "posts",
          populate: { path: "postedBy likes", select: "userName profilePic" },
        },
      });
    let subscribedPosts = await getMyPosts(req);
    // console.log(subscribedPosts)

    findUser.following.forEach((user) => {
      subscribedPosts = subscribedPosts.concat(user.posts);
    });
    subscribedPosts.sort((a, b) => b.createdAt - a.createdAt);
    console.log(subscribedPosts);
    res.status(200).json(subscribedPosts);
  } catch (err) {
    throw err;
  }
};

export const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.postid)
    .populate("postedBy")
    .populate({ path: "likes", select: "userName profilePic" });
  return res.status(200).json(post);
};

export const likePostToggle = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.postid });
  const selectedPost = post._id;

  const isLikedByUser = post.likes.includes(req.user);

  try {
    if (!isLikedByUser) {
      const post = await Post.findByIdAndUpdate(
        selectedPost,
        { $push: { likes: req.user }, $inc: { numberOfLikes: 1 } },
        { new: true }
      );
      return res.json(post.likes.includes(req.user));
    }
    if (isLikedByUser) {
      const post = await Post.findByIdAndUpdate(
        selectedPost,
        { $pull: { likes: req.user }, $inc: { numberOfLikes: -1 } },
        { new: true }
      );
      return res.json(post.likes.includes(req.user));
    } else {
      console.log("No post with that ID found");
    }
  } catch (err) {
    throw err;
  }
};

export const checkIfLiked = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.postid });
  const checkIfLiked = post.likes.includes(req.user);
  return res.json(checkIfLiked);
};
