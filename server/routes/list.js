const mongoose = require("mongoose");
const router = require("express").Router();
const List = mongoose.model("List");
const passport = require("passport");
const userInfo = require("../middleware/userInfo.js");
const validateIds = require("../middleware/validateIds.js");
const role = require("../middleware/role.js");
const utils = require("../lib/utils");
const ApiError = require("../middleware/ApiError");

// uncheck all items
router.put(
  "/reset/:listId",
  passport.authenticate("jwt", { session: false }),
  userInfo,
  validateIds,
  role("user"),
  (req, res, next) => {
    const { listId } = req.params;
    req.list.items.forEach((item) => (item.done = false));
    req.list
      .save()
      .then((list) => {
        utils.broadcast(req, list, {
          type: "resetList",
          data: {
            listId,
          },
        });
        res.status(200).json();
      })
      .catch((err) => {
        next(err);
      });
  }
);

// set last seen date for user
router.put(
  "/sawList/:listId",
  passport.authenticate("jwt", { session: false }),
  userInfo,
  role("user"),
  (req, res, next) => {
    const { listId } = req.params;
    const userIx = req.list.users.findIndex((usr) => usr.userId == req.userId);
    if (userIx < 0) throw new ApiError(500, "user-not-in-list");
    req.list.users[userIx].lastSeen = new Date();
    req.list
      .save()
      .then((list) => {
        /* use this to indicate who is currently in a list 
        utils.broadcast(req, list, {
          type: "sawList",
          listId,
          req.userId
        });
        */
        res.status(200).json();
      })
      .catch((err) => {
        next(err);
      });
  }
);

// get all lists a user can see
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  userInfo,
  (req, res, next) => {
    List.find({ "users.userId": req.userId })
      .exec()
      .then((lists) => {
        res.status(200).json({ lists });
      })
      .catch((err) => {
        next(err);
      });
  }
);

// create list
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  userInfo,
  (req, res, next) => {
    const data = (({ title }) => ({ title }))(req.body);
    let list = new List(data);
    list._id = new mongoose.mongo.ObjectId();
    list.users = [
      {
        userId: req.userId,
        name: req.name,
        short: req.short,
        lastSeen: new Date(),
        role: "owner",
      },
    ];
    list
      .save()
      .then((list) => {
        utils.broadcast(req, list, {
          type: "addList",
          data: {
            list,
          },
        });
        res.status(200).json({ list });
      })
      .catch((err) => {
        next(err);
      });
  }
);

// delete list
router.delete(
  "/:listId",
  passport.authenticate("jwt", { session: false }),
  userInfo,
  validateIds,
  role("owner"),
  (req, res, next) => {
    req.list
      .remove()
      .then(() => {
        res.status(200).json();
      })
      .catch((err) => {
        next(err);
      });
  }
);

// REF: just update list title
router.put(
  "/:listId",
  passport.authenticate("jwt", { session: false }),
  userInfo,
  validateIds,
  role("owner"),
  (req, res, next) => {
    const { listId } = req.params;
    const update = (({ title, description }) => ({ title, description }))(
      req.body
    );
    Object.assign(req.list, update);
    req.list
      .save()
      .then((list) => {
        utils.broadcast(req, list, {
          type: "updateList",
          data: {
            listId,
            list: update,
          },
        });
        res.status(200).json();
      })
      .catch((err) => {
        next(err);
      });
  }
);

module.exports = router;
