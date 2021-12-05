const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
  followers: [{ type: mongoose.Types.ObjectId, ref: "user" }],
  following: [{ type: mongoose.Types.ObjectId, ref: "user" }],
});

module.exports = mongoose.model("follow", followSchema);
