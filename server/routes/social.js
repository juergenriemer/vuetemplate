require("dotenv").config();
const baseUrl = process.env.CLIENT_HOST;

const mongoose = require("mongoose");
const router = require("express").Router();
const User = mongoose.model("User");
const List = mongoose.model("List");
const passport = require("passport");
const utils = require("../lib/utils");
const valid = require("../lib/valid");
const mail = require("../lib/email");
const userInfo = require("../middleware/userInfo.js");
const validateIds = require("../middleware/validateIds.js");
const ApiError = require("../middleware/ApiError");

// REFACTOR: use jsonwebtoken from ./utils.js instead of jwt replace encooe/decaue with sign/verify?d

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

router.get(
  "/social/facebook/auth",
  passport.authenticate("facebook", { scope: "email" })
);

router.get(
  "/social/facebook/request",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    // write this token into DB and remove in /socal.. to make item
    // one-time!!! and reduce time to 1 minute
    const token = utils.createToken({ _id: req.user._id }, 1);
    res.redirect(`${baseUrl}/user/social-signin/${token}`);
  }
);

router.get(
  "/social/google/auth",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

router.get(
  "/social/google/request",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = utils.createToken({ _id: req.user._id }, 1);
    res.redirect(`${baseUrl}/user/social-signin/${token}`);
  }
);

router.get("/socialSignIn/:token", (req, res, next) => {
  const data = utils.validateToken(req.params.token);
  if (!data) next(new ApiError(422, "token-invalid"));
  if (new Date(data.expiry) < new Date())
    next(new ApiError(422, "token-expired"));
  let userdata = null;
  User.findOne({ _id: data._id })
    .exec()
    .then((user) => {
      if (!user) throw new ApiError(422, "unkown-user");
      const token = utils.clientToken(user);
      res.status(200).json(token);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
