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
    console.log(">>>>>>>>>>");
    console.log(res.user);
    console.log(">>>>>>>>>>");
    // write this token into DB and remove in /socal.. to make item
    // one-time!!! and reduce time to 1 minute
    const token = utils.createToken({ _id: req.user._id }, 1);
    res.redirect(`${baseUrl}/user/social-signin/${token}`);
  }
);

router.get("/social/apple/auth", passport.authenticate("apple"));

router.post(
  "/social/apple/request",
  passport.authenticate("apple", { failureRedirect: "/login" }),
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

const createAndOrAuthenticate = (req, userData, log) => {
  return Promise.resolve()
    .then(() => {
      // add accessToken and check agiainst it? yes!
      // but this changes from time to time so we cannot
      // we can for the first time when registering!
      log += " > find_by_id";
      return User.findOne({ providerId: newUser.providerId });
    })
    .then((user) => {
      if (!user) {
        log += " > create_user";
        const newUser = new User(userData);
        return newUser.save();
      } else {
        log += " > return_user";
        return user;
      }
    })
    .then((user) => {
      log += "> return_token";
      const token = utils.clientToken(user);
      res.status(200).json(token);
    })
    .catch((err) => {
      next(err);
    })
    .finally((_) => console.log(log));
};

router.post("/social/google/mobile", (req, res) => {
  let log = `MOBILE_SIGNIN(${JSON.stringify(req.body)})::`;
  return Promise.resolve()
    .then(() => {
      log += " > prepare data";
      try {
        const userData = {
          provider: "google",
          providerId: req.body.idToken,
          picture: req.body.imageUrl,
          firstName: reg.body.givenName,
          lastName: req.body.familyName,
          name: req.body.displayName,
          email: req.body.email,
        };
        return userData;
      } catch (err) {
        throw new Error(err);
      }
    })
    .then((userData) => {
      log += " > create_authentictate";
      return createAndOrAuthenticate(req, userData, log);
    });
});

router.post("/social/apple/mobile", (req, res) => {
  const userData = {
    provider: "apple",
    providerId: req.body.user,
    firstName: reg.body.givenName,
    lastName: req.body.familyName,
    email: req.body.email,
  };
  return createAndOrAuthenticate(req, userData);
});

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
