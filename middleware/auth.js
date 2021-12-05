const tokenProvider = require("../modules/common/tokenProvider");
const UserModel = require("../modules/auth/auth");
const followModel = require("../modules/follow/follow");
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(500).json({ msg: "Invalid Authentication " });
    }
    const identityData = tokenProvider.verify(token);

    if (!identityData)
      return res.status(400).json({ msg: "Invalid Authentication" });

    const user = await UserModel.findOne({ _id: identityData.userId });
    const follow = await followModel.findOne({ _id: identityData.userId });

    req.user = user;
    req.follow = follow;

    // console.log(req.follow);
    // console.log(req.user);

    next();
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = auth;
