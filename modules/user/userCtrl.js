const UserModel = require("../auth/auth");

const userCtrl = {
  searchUser: async (req, res) => {
    try {
      const users = await UserModel.find({
        username: { $regex: req.body.username },
      })
        .limit(5)
        .select("fullname username avatar");

      res.send({
        success: 1,
        data: users,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getUser: async (req, res) => {
    try {
      try {
        const user = await UserModel.findById(req.params.id);

        if (!user) return res.status(400).json({ msg: "User does not exits" });

        res.send({
          success: 1,
          data: user,
        });
      } catch (error) {
        return res.status(500).json({ msg: error.message });
      }
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const updateUserData = req.body;

      const updatedPost = await UserModel.findOneAndUpdate(
        { _id: req.params.id },
        updateUserData,
        { new: true }
      );
      if (!updatedPost) return res.status(500).json({ msg: "Not found user" });

      res.send({
        success: 1,
        data: updatedPost,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
module.exports = userCtrl;
