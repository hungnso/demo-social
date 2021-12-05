const PostModel = require("./post");
const CommentModel = require("../comment/comment");

/// classe phân trang và tái sử dụng

class APIfeatures {
  constructor(query, querySting) {
    (this.query = query), (this.querySting = querySting);
  }
  pagination() {
    const page = this.querySting.page * 1 || 1;
    const limit = this.querySting.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const postCtrl = {
  createPost: async (req, res) => {
    try {
      const { content, images } = req.body;

      if (images.length === 0)
        return res.status(400).json({
          msg: "Please add your photo",
        });
      const newPost = new PostModel({
        content,
        images,
        user: req.user._id,
      });
      await newPost.save();
      res.send({
        success: 1,
        newPost: {
          ...newPost._doc,
          user: req.user,
        },
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getPosts: async (req, res) => {
    try {
      const features = new APIfeatures(
        PostModel.find({
          user: [...req.follow.following, req.user._id],
        }),
        req.query
      ).pagination();

      const posts = await features.query
        .sort("-createdAt")
        .populate("user likes", "avatar username fullname")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "avatar username fullname",
          },
        });
      res.send({
        success: 1,
        result: posts.length,
        posts,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updatePost: async (req, res) => {
    try {
      const { content, images } = req.body;
      const post = await PostModel.findOneAndUpdate(
        { _id: req.params.id },
        { content, images }
      )
        .populate("user likes", "avatar username fullname")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "avatar username fullname",
          },
        });
      res.send({
        success: 1,
        newPosts: {
          ...post._doc,
          content,
          images,
        },
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  likePost: async (req, res) => {
    try {
      const post = await PostModel.find({
        _id: req.params.id,
        likes: req.user._id,
      });
      if (post.length > 0)
        return res.status(400).json({ msg: "You liked this post." });

      const like = await PostModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      );

      if (!like)
        return res.status(400).json({ msg: "This post does not exist." });

      res.send({ msg: "Liked Post!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  unLikePost: async (req, res) => {
    try {
      const like = await PostModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );

      if (!like)
        return res.status(400).json({ msg: "This post does not exist." });

      res.send({ msg: "UnLiked Post!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUserPosts: async (req, res) => {
    try {
      const features = new APIfeatures(
        PostModel.find({ user: req.params.id }),
        req.query
      ).pagination();
      const posts = await features.query.sort("-createdAt");

      res.send({
        posts,
        result: posts.length,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await PostModel.findById(req.params.id)
        .populate("user likes", "avatar username fullname")
        .populate({
          path: "comments",
          select: "avatar username fullname",
        });
      res.send({
        success: 1,
        post,
      });

      if (!post)
        return res.status(400).json({ msg: "This post does not exist." });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deletePost: async (req, res) => {
    try {
      const post = await PostModel.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });
      await CommentModel.deleteMany({ _id: { $in: post.comments } || null });

      res.send({
        success: 1,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
module.exports = postCtrl;
