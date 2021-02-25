const mongoose = require("mongoose");
const router = require("express").Router();
const List = mongoose.model("List");
//const User = mongoose.model("User");
const passport = require("passport");
//const utils = require("../lib/utils");
const userInfo = require("../middleware/userInfo.js");
const validateIds = require("../middleware/validateIds.js");
const role = require("../middleware/role.js");

//
//
// LIST ROUTES
//
// uncheck all items
router.put(
  "/reset/:listId",
  passport.authenticate("jwt", { session: false }),
  userInfo,
  validateIds,
  role("user"),
  (req, res, next) => {
    List.findById(req.params.listId)
      .then((list) => {
        list.items.forEach((item) => {
          item.done = false;
        });
        return list.save();
      })
      .then(() => {
        res.status(200).json({ ok: true });
      })
      .catch((err) => {
        next(err);
      });
  }
);
// LAST SEEN UPDATES

router.put(
  "/sawList/:listId",
  passport.authenticate("jwt", { session: false }),
  userInfo,
  //put back role("user"),
  (req, res, next) => {
    const listId = req.params.listId;
    const userId = req.userId;
    const lastSeen = new Date();
    List.findOneAndUpdate(
      { _id: listId, "users.userId": userId },
      {
        $set: { "users.$.lastSeen": lastSeen },
      },
      { new: true, upsert: true }
    )
      .then((found) => {
        if (!found) throw new ApiError(500, "user-not-in-list");
        res.status(200).json({ lastSeen });
      })
      .catch((error) => {
        next(error);
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
        res.status(200).json(lists);
      })
      .catch((err) => {
        next(err);
      });
  }
);
//

// create list
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  userInfo,
  (req, res, next) => {
    let list = new List(req.body);
    list.users = [
      {
        userId: req.userId,
        name: req.name,
        short: req.short,
        lastSeen: new Date(),
        role: "owner",
      },
    ];
    list._id = new mongoose.mongo.ObjectId();
    list
      .save()
      .then((list) => {
        res.status(200).json(list);
      })
      .catch((err) => {
        next(err);
      });
  }
);
//
//
// delete list
router.delete(
  "/:listId",
  passport.authenticate("jwt", { session: false }),
  userInfo,
  validateIds,
  role("owner"),
  (req, res, next) => {
    List.remove({
      _id: req.params.listId,
    })
      .then(() => {
        res.status(200).json({ ok: true });
      })
      .catch((err) => {
        next(err);
      });
  }
);
//
// update list
// REF: just update list title

router.put(
  "/:listId",
  passport.authenticate("jwt", { session: false }),
  userInfo,
  validateIds,
  role("owner"),
  (req, res, next) => {
    List.findById(req.params.listId)
      .then((list) => {
        Object.assign(list, req.body);
        return list.save();
      })
      .then(() => {
        res.status(200).json({ ok: true });
      })
      .catch((err) => {
        next(err);
      });
  }
);

module.exports = router;
