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
const roles = { admin: "admin", user: "user" };
const utils = require("../lib/utils");
const ApiError = require("../middleware/ApiError");

// show lists a user is invited to
router.get(
  "/myInvites",
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
  (req, res, next) => {
    const { listId, email } = req.params;
    const invitingUser = req.name;
    const listTitle = req.list.title;
    const role = roles[req.params.role] || "user";
    const info = {
      listId,
      email,
      role,
      expiry: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    };
    var transport = nodemailer.createTransport({
      port: 25,
      host: "localhost",
    });
    let mail = {
      from: "TEST<test@test.com>",
      to: email,
      subject: `${invitingUser} wants to share his listle "${listTitle}" with you!`,
      text: `
Dear ${email},

${invitingUser} has invited you to collaborate on this listle list "${listTitle}"!`,
    };

    User.findOne({ email })
      .then((user) => {
        console.log("USSSSSSSSSSER");
        console.log(user);

        if (user && user.is_verified) {
          mail.text += `
Please visit 

  ${baseUrl}#/approve-invites 

to approve.`;
        } else if (user && !user.is_verified) {
          mail.text += `
It seems you already tried to register with listle.

In case you did not receive the confirmation e-mail please visit 

  ${baseUrl}#/resend-verification

to request another e-mail.
            `;
        } else {
          mail.text += `
It seems you did not yet register with listle.

Please visit 

  ${baseUrl}#/register

to create an account, the lists will be shared with you automatically.
            `;
        }
        console.log(">>> MAIL >>>");
        console.log(mail);
        console.log("<<< MAIL <<<");
        return user;
        //return transport.sendMail(mail);
      })
      .then((user) => {
        console.log(user);
        if (!req.list.invitees.find((usr) => usr.email == email))
          req.list.invitees.push({
            email,
            userId: user ? user.userId : email,
            name: user ? user.firstName + " " + user.lastName : email,
            // REF REFACTOR!!!! we do this in utils as well
            short: user
              ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
              : "@",
            role: roles[role],
          });
        else console.log("arleady");
        console.log(req.list.invitees);
        return req.list.save();
      })
      .then(() => {
        return res.status(200).json();
      })
      .catch((error) => {
        next(error);
      });
  }
);

router.post(
  "/approveInvitations",
  passport.authenticate("jwt", { session: false }),
  userInfo,
  (req, res, next) => {
    // REF!!! test if user can add him to list other than the ones invited!!!
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
                  email: req.email,
                  name: req.name,
                  short: req.short,
                  lastSeen: new Date(),
                  role,
                });
              }
              // and remove from invitees
              lst.invitees = lst.invitees.filter((inv) => inv.email != email);
              lst.save();
            });
          })
          .then(() => res.status(200).json())
          .catch((error) => res.status(500).json(error));
      })
      .catch((error) => res.status(500).json(error));
  }
);

// toggle admin
router.put(
  "/toggleAdmin/:listId/:userId/:isAdmin",
  passport.authenticate("jwt", { session: false }),
  validateIds,
  userInfo,
  role("admin"),
  (req, res, next) => {
    let listId = req.params.listId;
    let userId = req.params.userId;
    let isAdmin = req.params.isAdmin == "true";
    const role = isAdmin ? "admin" : "user";
    List.findOneAndUpdate(
      { _id: listId, "users.userId": userId },
      {
        $set: { "users.$.role": role },
      },
      { new: true, upsert: true }
    )
      .then((found) => {
        if (!found) throw new ApiError(500, "user-not-in-list");
        utils.broadcast(req, req.list, {
          type: "toggleAdmin",
          data: {
            listId,
            userId,
            isAdmin,
          },
        });
        res.status(200).json();
      })
      .catch((error) => {
        next(error);
      });
  }
);

// unshare list
router.delete(
  "/unshare/:listId/:userId",
  passport.authenticate("jwt", { session: false }),
  validateIds,
  userInfo,
  role("admin"),
  (req, res, next) => {
    const { listId, userId } = req.params;
    // need to broadcast before we delete user so that
    // the unshared user gets the information via socket
    const userToDelete = req.list.users.find((usr) => usr.userId == userId);
    if (!userToDelete) throw new ApiError(422, "unkown-user");
    if (userToDelete.role != "user")
      throw new ApiError(422, "cannot-delete-admin");
    utils.broadcast(req, req.list, {
      type: "unshare",
      data: {
        listId,
        userId,
      },
    });
    req.list.users = req.list.users.filter((usr) => usr.userId != userId);
    req.list
      .save()
      .then((found) => {
        res.status(200).json();
      })
      .catch((error) => {
        next(error);
      });
  }
);

/*
const validToken = (token, secret) => {
  try {
    return jwt.decode(token, secret);
  } catch (error) {
    return null;
  }
};

// verify via token
router.get("/verifyInvitation/:token", (req, res) => {
  // change to put? or put csrf token here?
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
                inform all users? at least admin and owners!
                var io = req.app.get("io");
                let data = {
                  type: "invitationAccepted",
                  listId,
                };
                io.sockets.emit(userId, data);
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
*/
module.exports = router;
