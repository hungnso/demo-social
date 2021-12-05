const router = require("express").Router();
const auth = require("../../middleware/auth");
const CommentCtrl = require("./commentCtrl");

router.post("/comment", auth, CommentCtrl.createComment);

router.patch("/comment/:id", auth, CommentCtrl.updateComment);

router.patch("/comment/:id/like", auth, CommentCtrl.likeComment);

router.patch("/comment/:id/unlike", auth, CommentCtrl.unLikeComment);

module.exports = router;
