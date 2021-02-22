require("dotenv").config();
const baseUrl = process.env.CLIENT_HOST;
const mongoose = require("mongoose");
const router = require("express").Router();
const List = mongoose.model("List");
const User = mongoose.model("User");
const passport = require("passport");
const userInfo = require("../middleware/userInfo.js");
const validateIds = require("../middleware/validateIds.js");
const nodemailer = require("nodemailer");
const role = require("../middleware/role.js");
const jwt = require("jwt-simple");
const secret = "MIICCgKCAgEA8a9w5sGtJuDXegso3LQOZA3YutQivO/dFnz";
const roles = { admin: "admin", user: "user" };

// show lists a user is invited to

router.get(
  "/listInvites",
  passport.authenticate("jwt", { session: false }),
  userInfo,
  (req, res, next) => {
    User.findOne({ _id: req.userId })
      .exec()
      .then((user) => {
        if (!user) throw new ApiError(500, "unkown-user");
        return List.find({ "invitees.email": user.email }).exec();
      })
      .then((lists) => res.status(200).json({ lists }))
      .catch((error) => {
        next(error);
      });
  }
);

// invite to share
router.get(
  "/invite/:listId/:email/:role",
  passport.authenticate("jwt", { session: false }),
  validateIds,
  userInfo,
  role("admin"),
  // isAdmin, <= check if user is admin
  (req, res, next) => {
    console.log("invite user to list");
    // REF
    // 1. check if user is admin to be able to share!!!
    // 2. if role is null because mistyped raise error
    const { listId, email, role } = req.params;
    const info = {
      listId,
      email,
      role,
      expiry: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    };
    // first try to update if exists
    const success = () => {
      var invitingUser = req.userId;
      var list = listId;
      var transport = nodemailer.createTransport({
        port: 25,
        host: "localhost",
      });
      // REF: account for user alrady regsitered but never confirmed
      User.findOne({ $and: [{ email, is_verified: true }] }).exec(
        (error, user) => {
          if (error) {
            res.status(500).json(error);
          } else {
            if (user) {
              console.log("user exists, we send mail to invite");
              // user already exists
              var token = jwt.encode(info, secret);
              let url = `${baseUrl}#/verify-invitation/${token}`;
              var mail = {
                from: "TEST<test@test.com>",
                to: info.email,
                subject: "Share list with you",
                text: `Visit this ${url}`,
                html: `<a href="${url}"><H2>Click on this</H2></a>`,
              };
            } else {
              console.log("user does not exist, we send mail to register");
              let url = `${baseUrl}#/register/`;
              var mail = {
                from: "TEST<test@test.com>",
                to: info.email,
                subject: "Invite to register and share",
                text: `${invitingUser} has invited you to share 
                his list ${list} with you. Visit this ${url}`,
                html: `${invitingUser} has invited you to share
                his list ${list} with you. 
                <a href="${url}"><H2>Click on this</H2></a>`,
                // user does not yet exist, lets invite him for signup
              };
            }
            transport.sendMail(mail, (error) => {
              if (error) {
                res.status(500).json(error);
              } else {
                res.status(200).json("OK");
              }
            });
          }
          /*
      ?? shall we prevent email if user is online and accepts?
      const io = req.app.get("io");
      io.sockets.emit(userId, {
        type: "listShared",
        listId,
        role: roles[role],
      });
      */
        }
      );
    };
    List.findOneAndUpdate(
      { _id: listId, invitees: { $elemMatch: { email } } },
      {
        $set: {
          "invitees.$.role": roles[role],
        },
      },
      { new: true, safe: true, upsert: true },
      (error, list) => {
        if (error) {
          // otherwise try to create from scratch
          List.findById(listId, (error, list) => {
            if (error) {
              res.status(404).json(error);
            } else {
              list.invitees.push({
                email,
                role: roles[role],
              });
              list.save((error, list) => {
                if (error) {
                  // finally raise error
                  res.status(500).json(error);
                } else {
                  success();
                }
              });
            }
          });
        } else {
          success();
        }
      }
    );
  }
);

router.post(
  "/approveInvitations",
  passport.authenticate("jwt", { session: false }),
  userInfo,
  (req, res, next) => {
    let invites = req.body;
    User.findById(req.userId)
      .exec()
      .then((user) => user.email)
      .then((email) => {
        let listIds = Object.keys(invites);
        List.find({ _id: { $in: listIds } })
          .exec()
          .then((lists) => {
            lists.forEach((lst) => {
              let approve = invites[lst._id];
              // add to users if approved
              if (approve) {
                let role = lst.invitees.find((inv) => inv.email == email).role;
                lst.users.push({
                  userId: req.userId,
                  lastSeen: new Date(),
                  role,
                });
              }
              // and remove from invitees
              lst.invitees = lst.invitees.filter((inv) => inv.email != email);
              lst.save();
            });
            console.log(lists);
          })
          .then(() => res.status(200).json("OK"))
          .catch((error) => res.status(500).json(error));
      })
      .catch((error) => res.status(500).json(error));
  }
);

const validToken = (token, secret) => {
  try {
    return jwt.decode(token, secret);
  } catch (error) {
    return null;
  }
};

// verify via token
router.get("/verifyInvitation/:token", (req, res) => {
  var token = req.params.token;
  const data = validToken(token, secret);
  if (data) {
    if (new Date(data.expiry) > new Date()) {
      const { listId, email, role } = data;
      User.findOne({ email }).exec((error, user) => {
        if (error) {
          res.status(500).json(error);
        } else if (!user) {
          res.status(404).json({ error: "unknown" });
        } else {
          const userId = user._id;
          console.log(user);
          List.findOneAndUpdate(
            { $and: [{ _id: listId }, { "invitees.email": email }] },
            {
              $pull: { invitees: { email } },
              $push: {
                users: {
                  userId,
                  lastSeen: new Date(),
                  role: roles[role],
                },
              },
            },
            { new: true },
            (error, list) => {
              // 1. check if list is null!!! there is no error if 404
              if (error) {
                res.status(500).json(error);
              } else {
                if (list) {
                  /*
                inform all users? at least admin and owners!
                var io = req.app.get("io");
                let data = {
                  type: "invitationAccepted",
                  listId,
                };
                io.sockets.emit(userId, data);
                */
                  res.status(200).json({ listId, userId });
                } else {
                  res.status(500).json({ error: "uninvited" });
                }
              }
            }
          );
        }
      });
    } else {
      res.status(500).json({ error: "expired" });
    }
  } else {
    res.status(500).json({ error: "invalid" });
  }
});
// unshare list

router.delete(
  "/unshare/:id/:userId",
  passport.authenticate("jwt", { session: false }),
  validateIds,
  userInfo,
  role("admin"),
  (req, res, next) => {
    let listId = req.params.id;
    let userId = req.params.userId;
    // test this? need elemMatch like in role middleware?
    List.findByIdAndUpdate(
      { _id: listId },
      {
        $pull: { users: { userId } },
      },
      { new: true },
      (error, list) => {
        // 1. check if list is null!!! there is no error if 404
        if (error) {
          res.status(500).json(error);
        } else {
          var io = req.app.get("io");
          let data = {
            type: "unshared",
            listId,
          };
          io.sockets.emit(userId, data);
          res.status(200).json({ listId, userId });
        }
      }
    );
  }
);

module.exports = router;
