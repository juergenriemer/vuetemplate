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
  locale: {
    type: "String",
    default: "en",
  },
  picture: {
    type: "String",
  },
  provider: {
    type: "String",
  },
  providerId: {
    type: "String",
  },
  isLocked: {
    type: "Boolean",
    default: false,
  },
  is_verified: {
    type: "Boolean",
    default: false,
  },
  hash: {
    type: "String",
  },
  salt: {
    type: "String",
  },
  failedLogin: { type: Number, default: 0 },
  failedLoginDate: Date,
});
mongoose.model("User", UserSchema);
