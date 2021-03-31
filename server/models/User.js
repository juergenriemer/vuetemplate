const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: "String",
  },
  lastName: {
    type: "String",
  },
  name: {
    type: "String",
  },
  short: {
    type: "String",
  },
  email: {
    type: "String",
  },
  is_verified: {
    type: "Boolean",
  },
  hash: {
    type: "String",
  },
  salt: {
    type: "String",
  },
  failedLogin: Number,
  failedLoginDate: Date,
});
mongoose.model("User", UserSchema);
