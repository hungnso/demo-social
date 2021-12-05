const router = require("express").Router();
const auth = require("../../middleware/auth");

const userCtrl = require("./userCtrl");

router.get("/search", auth, userCtrl.searchUser);
router.get("/user/:id", auth, userCtrl.getUser);
router.put("/user/:id", auth, userCtrl.updateUser);
router.patch("/user/:id", auth, userCtrl.updateUser);

module.exports = router;
