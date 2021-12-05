const followModle = require("./follow");
const AuthModel = require("../auth/auth");

const followCtrl = {
  // createfollow:
  follow: async (req, res) => {
    try {
      const checkIdParams = await followModle.findById({
        _id: req.params.id,
      });
      const checkidUser = await followModle.findById({
        _id: req.user._id,
      });

      /// Kiểm tra id xem có bị trùng trước khi tạo mới
      if (checkIdParams === null) {
        await followModle.create({
          _id: req.params.id,
        });
      }
      if (checkidUser === null) {
        await followModle.create({
          _id: req.user._id,
        });
      }

      const user = await followModle.find({
        _id: req.params.id,
        followers: req.user._id,
      });

      if (user.length > 0)
        return res.status(500).json({ msg: "You followed this user." });

      const newUser = await followModle
        .findOneAndUpdate(
          {
            _id: req.params.id,
          },
          { $push: { followers: req.user._id } },
          { new: true }
        )
        .populate("followers following", "-password");
      await followModle
        .findOneAndUpdate(
          {
            _id: req.user._id,
          },
          { $push: { following: req.params.id } },
          { new: true }
        )
        .populate("followers following", "-password");
      // console.log(newUser);
      res.send({
        success: 1,
        data: newUser,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  unfollow: async (req, res) => {
    try {
      const newUser = await followModle
        .findOneAndUpdate(
          {
            _id: req.params.id,
          },
          {
            $pull: {
              followers: req.user._id,
            },
          },
          { new: true }
        )
        .populate("followers following", "-password");
      await followModle
        .findOneAndUpdate(
          {
            _id: req.user._id,
          },
          {
            $pull: {
              following: req.params.id,
            },
          },
          { new: true }
        )
        .populate("followers following", "-password");

      ///////////////// Gửi kết quả
      res.send({
        success: 1,
        data: newUser,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  /// Chức năng random gợi ý người follow
  suggestionUser: async (req, res) => {
    try {
      const myUser = await followModle.findById(req.user._id);

      const newArr = [...myUser.following, req.user._id];

      const num = req.query.num || 10;

      const userRandom = await AuthModel.aggregate([
        { $match: { _id: { $nin: newArr } } },
        { $sample: { size: Number(num) } },
      ]).project("-password");
      res.send({
        success: 1,
        userRandom,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = followCtrl;
