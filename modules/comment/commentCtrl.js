const CommentModel = require("./comment");
const PostModel = require("../post/post");

const CommentCtrl = {
  createComment: async (req, res) => {
    try {
      const { postId, content, tag, reply, postUserId } = req.body;

      const post = await PostModel.findById(postId);
      if (!post)
        return res.status(400).json({ msg: "This post dose not exist" });

      if (reply) {
        const cm = await CommentModel.findById(reply);
        if (!cm)
          return res.status(400).json({ msg: "This post dose not exist" });
      }
      const newCommnet = new CommentModel({
        content,
        tag,
        reply,
        postId,
        postUserId,
        user: req.user._id,
      });
      await PostModel.findOneAndUpdate(
        { _id: postId },
        {
          $push: { comments: newCommnet._id },
        },
        { new: true }
      );

      await newCommnet.save();

      res.send({
        success: 1,
        newCommnet,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateComment: async (req, res) => {
    try {
      const updateComment = req.body;
      await CommentModel.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user._id,
        },
        updateComment,
        { new: true }
      );
      if (!updateComment) return res.status(400).json({ msg: "loi" });

      res.send({
        success: 1,
        data: updateComment,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  likeComment: async (req, res) => {
    try {
      const comment = await CommentModel.find({
        _id: req.params.id,
        likes: req.user._id,
      });
      if (comment.length > 0)
        return res.status(400).json({ msg: "You like this post" });

      const newCommnet = await CommentModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      );

      res.send({
        success: "You liked comment!",
        newCommnet,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  unLikeComment: async (req, res) => {
    try {
      await CommentModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );

      res.send({ msg: "UnLiked Comment!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
module.exports = CommentCtrl;
