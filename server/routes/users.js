require("dotenv").config();
const baseUrl = process.env.CLIENT_HOST;
//const csrf = require("csurf");
//const csrfProtection = csrf({ cookie: true });
// make users insgular
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

router.post("/register", (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  let invalidFields = [
    valid.firstName(firstName),
    valid.lastName(lastName),
    valid.email(email),
    valid.password(password),
  ].filter((fld) => fld);
  if (invalidFields.length) throw new ApiError(400, invalidFields);
  User.findOne({ email })
    .exec()
    .then((user) => {
      if (user) {
        if (user.isLocked) throw new ApiError(422, "is-locked");
        else if (user.is_verified) throw new ApiError(422, "is-registered");
        else throw new ApiError(422, "in-registration");
      }
    })
    .then(() => {
      const saltHash = utils.genPassword(password);
      const salt = saltHash.salt;
      const hash = saltHash.hash;
      const name = `${firstName} ${lastName}`;
      const short = `${firstName.charAt(0)}${lastName.charAt(0)}`;
      const user = new User({
        firstName,
        lastName,
        name,
        email,
        short,
        hash,
        salt,
        is_verified: false,
        failedLogin: 0,
        failedLoginDate: 0,
        isLocked: false,
      });
      return user.save();
    })
    .then((user) => {
      const info = {
        firstName,
        lastName,
        email,
        _id: user._id,
      };
      return utils.createToken(info, 1);
    })
    .then((token) => {
      const text = `
        To finish your registration click here:
        ${baseUrl}#/register-verify/${token}
      `;
      var opts = {
        to: email,
        subject: "Registration at L",
        text,
      };
      return mail.send(opts);
    })
    .then(() => {
      res.status(200).json({ ok: true });
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/registerVerifyResend", (req, res, next) => {
  const { email } = req.body;
  let invalidFields = [valid.email(email)].filter((fld) => fld);
  if (invalidFields.length) throw new ApiError(400, invalidFields);
  User.findOne({ email })
    .exec()
    .then((user) => {
      if (user) {
        if (user.isLocked) throw new ApiError(422, "is-locked");
        else if (user.is_verified) throw new ApiError(422, "is-registered");
      } else {
        throw new ApiError(422, "no-user");
      }
      const info = {
        firstName: user.firstName,
        lastName: user.lastName,
        email,
        _id: user._id,
      };
      return info;
    })
    // REF: duplicte code in /register
    .then((info) => {
      return utils.createToken(info, 1);
    })
    .then((token) => {
      const text = `
        To finish your registration click here:
        ${baseUrl}#/register-verify/${token}
      `;
      var opts = {
        to: email,
        subject: "Registration at L",
        text,
      };
      return mail.send(opts);
    })
    .then(() => {
      res.status(200).json({ ok: true });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/registerVerify/:token", (req, res, next) => {
  const data = utils.validateToken(req.params.token);
  if (!data) next(new ApiError(422, "token-invalid"));
  if (new Date(data.expiry) < new Date())
    next(new ApiError(422, "token-expired"));
  let userdata = null;
  User.findOne({ _id: data._id, email: data.email })
    .exec()
    .then((user) => {
      if (!user) throw new ApiError(422, "unkown-user");
      if (user.is_verified) throw new ApiError(422, "user-already-verified");
      user.is_verified = true;
      userdata = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        _id: user._id,
      };
      return user.save();
    })
    .then(() => {
      return List.find({ "invitees.email": data.email }).exec();
    })
    .then((lists) => {
      const tokenObject = utils.issueJWT(userdata);
      let result = {
        ok: true,
        lists,
        userdata,
        token: tokenObject.token,
        expiresIn: tokenObject.expires,
      };
      return result;
    })
    .then((result) => res.status(200).json(result))
    .catch((error) => {
      next(error);
    });
});

router.get(
  "/info",
  passport.authenticate("jwt", { session: false }),
  userInfo,
  (req, res, next) => {
    console.log(">>>>>>>>>>", req.userId);
    User.findOne({ _id: req.userId })
      .exec()
      .then((user) => {
        if (!user) {
          throw new ApiError(400, "user-not-found");
        } else {
          const token = utils.clientToken(user);
          res.status(200).json(token);
        }
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.post("/login", function (req, res, next) {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (!user) throw new ApiError(422, "wrong-creds"); // user-not-found
      if (!user.is_verified) throw new ApiError(422, "in-registration");
      if (user.failedLoginDate > new Date())
        throw new ApiError(422, "login-locked");
      if (!utils.validPassword(req.body.password, user.hash, user.salt)) {
        // lock user login for 1 minute after 3rd try
        user.failedLogin++;
        if (user.failedLogin > 2) {
          var future = new Date();
          future.setMinutes(future.getMinutes() + 1);
          user.failedLoginDate = new Date(future);
        }
        user.save();
        throw new ApiError(422, "wrong-creds"); // wrong creds
      }
      user.failedLogin = 0;
      user.save();
      const token = utils.clientToken(user);
      res.status(200).json(token);
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/resetPassword", (req, res, next) => {
  const { password, email } = req.body;
  let invalidFields = [valid.email(email)].filter((fld) => fld);
  if (invalidFields.length) throw new ApiError(400, invalidFields);
  User.findOne({ email })
    .exec()
    .then((user) => {
      if (user) {
        if (user.isLocked) throw new ApiError(422, "is-locked");
        else if (!user.is_verified) throw new ApiError(422, "in-registration");
      } else {
        throw new ApiError(422, "no-user");
      }
      const info = {
        password,
        email,
        _id: user._id,
      };
      return info;
    })
    // REF: duplicte code in /register
    .then((info) => {
      return utils.createToken(info, 1);
    })
    .then((token) => {
      const text = `
        To finish your password reset click here:
        ${baseUrl}#/reset-password-verify/${token}
      `;
      var opts = {
        to: email,
        subject: "Password reset at L",
        text,
      };
      return mail.send(opts);
    })
    .then(() => {
      res.status(200).json({ ok: true });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/resetPasswordVerify/:token", (req, res, next) => {
  const data = utils.validateToken(req.params.token);
  if (!data) next(new ApiError(422, "token-invalid"));
  let invalidFields = [
    valid.email(data.email),
    valid.password(data.password),
  ].filter((fld) => fld);
  if (invalidFields.length) throw new ApiError(400, invalidFields);
  if (new Date(data.expiry) < new Date())
    next(new ApiError(422, "token-expired"));
  let userdata = null;
  User.findOne({ email: data.email })
    .exec()
    .then((user) => {
      if (!user) throw new ApiError(422, "unkown-user");
      if (!user.is_verified) throw new ApiError(422, "in-registration");
      user.is_verified = true;
      const saltHash = utils.genPassword(data.password);
      user.salt = saltHash.salt;
      user.hash = saltHash.hash;
      user.failedLogin = 0;
      // Q REFpass on user object rather than userdata? we pick fields in utils in any case
      userdata = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        _id: user._id,
      };
      return user.save();
    })
    .then((lists) => {
      const tokenObject = utils.issueJWT(userdata);
      let result = {
        ok: true,
        lists,
        userdata,
        token: tokenObject.token,
        expiresIn: tokenObject.expires,
      };
      return result;
    })
    .then((result) => res.status(200).json(result))
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
