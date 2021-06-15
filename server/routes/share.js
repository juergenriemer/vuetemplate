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
const mail = require("../lib/email");
const role = require("../middleware/role.js");
const roles = { admin: "admin", user: "user" };
const utils = require("../lib/utils");
const te = require("../texts/en.js");
const ApiError = require("../middleware/ApiError");
const lang = "en";
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
    if (req.list.users.find((usr) => usr.email == email))
      throw new ApiError(422, "user-already-member");
    if (req.list.invitees.find((usr) => usr.email == email))
      throw new ApiError(422, "user-already-invited");
    const tokens = {
      invitingUser: req.user.name,
      listTitle: req.list.title,
      baseUrl,
      email,
    };
    const info = {
      listId,
      email,
      role,
      expiry: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    };
    let invitee = {
      email,
      userId: email,
      name: email,
      short: "@",
      role: roles[role],
    };
    var transport = nodemailer.createTransport({
      port: 25,
      host: "localhost",
    });
    let opts = {
      from: "TEST<test@test.com>",
      to: email,
      subject: te.xt("mail_subject_share", lang, tokens),
      text: te.xt("mail_body_share_begin", lang, tokens),
    };
    let existingUser = null;
    let log = `INVITE(${JSON.stringify(req.params)})::`;
    Promise.resolve()
      .then(() => {
        log += " > find_user";
        return User.findOne({ email });
      })
      .then((user) => {
        existingUser = user;
        log += " > send_email";
        if (user && user.is_verified) {
          opts.text += te.xt("mail_body_share_verified_user", lang, tokens);
        } else if (user && !user.is_verified) {
          opts.text += te.xt("mail_body_share_unverified_user", lang, tokens);
        } else {
          opts.text += te.xt("mail_body_share_unregistered_user", lang, tokens);
        }
        return mail.send(opts);
      })
      .then(() => {
        log += " > update_list";
        if (existingUser) {
          invitee = {
            email,
            userId: existingUser.userId,
            name: existingUser.name,
            short: existingUser.short,
            role: roles[role],
          };
        }
        if (!req.list.invitees.find((usr) => usr.email == email))
          req.list.invitees.push(invitee);
        return req.list.save();
      })
      .then((list) => {
        log += " > notify_single_user";
        if (existingUser) {
          const owner = req.list.users.find((usr) => usr.role == "owner");
          const url = `/app/approve-invites`;
          utils.notifySingleUser(req, existingUser._id, {
            type: "info",
            data: {
              event: "invite",
              button: {
                text: "APPROVE",
                url,
              },
              message: te.xt("info_invite", lang, {
                listName: req.list.title,
                userName: owner.name,
              }),
            },
          });
        }
      })
      .then(() => {
        res.status(200).json({ invitee });
      })
      .catch((err) => {
        next(err);
      })
      .finally((_) => console.log(log));
  }
);

router.post(
  "/approveInvitations",
  passport.authenticate("jwt", { session: false }),
  userInfo,
  (req, res, next) => {
    // REF!!! test if user can add him to list other than the ones invited!!!
    let log = `APPROVE_INVITATIONS(${JSON.stringify(req.params)})::`;
    const seen = new Date();
    const userId = req.userId;
    let invites, email;
    let notifiedOwners = {};
    Promise.resolve()
      .then(() => {
        log += " > prepare data";
        try {
          invites = req.body;
          return true;
        } catch (err) {
          throw new Error(err);
        }
      })
      .then(() => {
        log += " > look up user";
        return User.findById(req.userId);
      })
      .then((user) => {
        log += " > load lists";
        email = user.email;
        let listIds = Object.keys(invites);
        return List.find({ _id: { $in: listIds } });
      })
      .then((lists) => {
        log += " > update lists";
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
              role,
            });
            lst.lastSeen.push({ userId, seen });
          }
          // and remove from invitees
          lst.invitees = lst.invitees.filter((inv) => inv.email != email);
          log += " > save list id: " + lst._id;
          console.log(123, lst);
          lst.save();
          const text = approve
            ? "info_approve_inivitation"
            : "info_decline_inivitation";
          if (!notifiedOwners[lst.creatorId]) {
            notifiedOwners[lst.creatorId] = true;
            const url = `/app/members/${lst._id}`;
            utils.notifySingleUser(req, lst.creatorId, {
              type: "info",
              data: {
                event: "approveInvitations",
                button: {
                  text: "MEMBERSHIPS",
                  url,
                },
                message: te.xt(text, lang, {
                  listName: lst.title,
                  userName: req.name,
                }),
              },
            });
          }
        });
      })
      .then(() => {
        res.status(200).json();
      })
      .catch((err) => {
        next(err);
      })
      .finally((_) => console.log(log));
  }
);
//
// leave list as member
router.put(
  "/leaveList/:listId",
  passport.authenticate("jwt", { session: false }),
  validateIds,
  userInfo,
  role("user"),
  (req, res, next) => {
    const { listId } = req.params;
    let log = `LEAVE_LIST(${JSON.stringify(req.params)})::`;
    const listUser = req.list.users.find((usr) => usr.userId == req.userId);
    console.log(listUser);
    if (listUser.role == "owner") throw new ApiError(500, "owner-cannot-leave");
    Promise.resolve()
      .then(() => {
        log += " > delete_user";
        req.list.users = req.list.users.find((itm) => itm.userId != req.userId);
        return req.list.save();
      })
      .then((list) => {
        log += " > broadcast";
        const owner = req.list.users.find((usr) => usr.role == "owner");
        const url = `/app/members/${req.list._id}`;
        utils.notifySingleUser(req, owner.userId, {
          type: "info",
          data: {
            event: "leave_list",
            button: {
              text: "MEMBERSHIPS",
              url,
            },
            message: te.xt("info_leave_list", lang, {
              listName: req.list.title,
              userName: req.name,
            }),
          },
        });
        res.status(200).json();
      })
      .catch((err) => {
        next(err);
      })
      .finally((_) => console.log(log));
  }
);

// toggle admin
router.put(
  "/toggleAdmin/:listId/:userId/:isAdmin",
  passport.authenticate("jwt", { session: false }),
  validateIds,
  userInfo,
  role("owner"),
  (req, res, next) => {
    let listId = req.params.listId;
    let userId = req.params.userId;
    let isAdmin = req.params.isAdmin == "true";
    const owner = req.list.users.find((usr) => usr.role == "owner");
    if (owner.userId == userId) throw new ApiError(500, "cannot-remove-owner");
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
    // also remove user from lastSeen object
    req.list.lastSeen = req.list.lastSeen.filter((usr) => usr.userId != userId);
    req.list
      .save()
      .then((found) => {
        const admin = req.list.users.find((usr) => usr.userId == req.userId);
        utils.notifySingleUser(req, userId, {
          type: "info",
          data: {
            event: "unshare",
            listId: req.list._id,
            message: te.xt("info_unshare", lang, {
              listName: req.list.title,
              userName: admin.name,
            }),
          },
        });
        res.status(200).json();
      })
      .catch((error) => {
        next(error);
      });
  }
);

// uninvite from list
router.delete(
  "/uninvite/:listId/:email",
  passport.authenticate("jwt", { session: false }),
  validateIds,
  userInfo,
  role("admin"),
  (req, res, next) => {
    const { listId, email } = req.params;
    const userToDelete = req.list.invitees.find((usr) => usr.email == email);
    if (!userToDelete) throw new ApiError(422, "unkown-user");
    utils.broadcast(req, req.list, {
      type: "uninvite",
      data: {
        listId,
        email,
      },
    });
    req.list.invitees = req.list.invitees.filter((usr) => usr.email != email);
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

module.exports = router;
