const router = require("express").Router();
const auth = require("../../middleware/auth");
const followCtrl = require("./followCtrl");
router.patch("/user/:id/follow", auth, followCtrl.follow);
router.patch("/user/:id/unfollow", auth, followCtrl.unfollow);
router.get("/suggestionsUser", auth, followCtrl.suggestionUser);

module.exports = router;
