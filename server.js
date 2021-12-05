require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const AuthRouter = require("./modules/auth");
const UserRouter = require("./modules/user");
const FollowRouter = require("./modules/follow");
const PostRouter = require("./modules/post");
const CommentRouter = require("./modules/comment");

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);

  console.log("Mongodb connected");
  const app = express();

  app.use(express.json());

  //Router

  app.use("/api", AuthRouter);
  app.use("/api", UserRouter);
  app.use("/api", FollowRouter);
  app.use("/api", PostRouter);
  app.use("/api", CommentRouter);
  // app.use("/api/auth", AuthRouter);

  const port = process.env.PORT || 9000;

  app.listen(port, (err) => {
    if (err) throw err;

    console.log(`Server connected ${port}`);
  });
}

main();
