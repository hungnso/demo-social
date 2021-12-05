const UserModel = require("./auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenProvider = require("../common/tokenProvider");

const authCtrl = {
  register: async (req, res) => {
    try {
      const { fullname, username, email, password } = req.body;

      console.log(req.body);

      /// check username có trùng hay ko?
      const user_name = await UserModel.findOne({ username });
      if (user_name)
        return res.status(400).json({
          msg: "Tên người dùng đã tồn tại",
        });

      /// check email có trùng hay ko?
      const user_email = await UserModel.findOne({ email });
      if (user_email)
        return res.status(400).json({
          msg: "Email này đã tồn tại",
        });

      // check password nhỏ hơn 6 ký tự

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Mật khẩu phải có độ dài nhiều hơn 6 ký tự" });

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = await UserModel.create({
        fullname,
        username,
        password: passwordHash,
        email,
      });

      const token = tokenProvider.sign(newUser._id);

      res.send({
        msg: "Register Success!",
        data: {
          _id: newUser._id,
          username: newUser.username,
          email,
          token,
        },
      });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });

      /// Check user đã gửi có đúng ko?
      if (!user) return res.status(400).json({ msg: "Email này không tồ tại" });

      const matchedPassword = bcrypt.compare(password, user.password);

      if (!matchedPassword)
        return res.status(400).json({ msg: "Sai mật khẩu rồi" });

      const token = tokenProvider.sign(user._id);

      res.send({
        msg: "Login Success!",
        data: {
          _id: user._id,
          email: user.email,
          username: user.username,
          token,
        },
      });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = authCtrl;
