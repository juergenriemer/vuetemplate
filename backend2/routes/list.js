const mongoose = require("mongoose");
const router = require("express").Router();
const List = mongoose.model("List");
const User = mongoose.model("User");
const passport = require("passport");
const utils = require("../lib/utils");
const userInfo = require("../middleware/userInfo.js");
const validateIds = require("../middleware/validateIds.js");
const role = require("../middleware/role.js");
// LIST ROUTES
//
// uncheck all items
router.put(
  "/reset/:id",
  passport.authenticate("jwt", { session: false }),
  userInfo,
  validateIds,
  role("user"),
  (req, res, next) => {
    List.findById(req.params.id)
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
  role("user"),
  (req, res, next) => {
    const listId = req.params.listId;
    const data = { listId, date: new Date() };
    User.findByIdAndUpdate(
      req.userId,
      {
        $push: { lastSeen: data },
      },
      { new: true, upsert: true },
      (error, list) => {
        if (error) {
          res.status(500).json(error);
        } else {
          res.status(200).json(data);
        }
      }
    );
  }
);

/*
// show all list
// REF: just update list title
router.put(
  "/:listId/:itemId",
  passport.authenticate("jwt", { session: false }),
  validateIds,
  userInfo,
  role("owner"),
  (req, res, next) => {
    const { listId, itemId } = req.params;
    let item = req.body;
    List.findOneAndUpdate(
      { _id: listId, items: { $elemMatch: { _id: itemId } } },
      {
        $set: {
          "items.$.title": item.title,
          "items.$.done": item.done,
        },
      },
      { new: true, safe: true, upsert: true }
    )
      .exec()
      .then((list) => {
        item.updatedAt = new Date(); // set date to show as new
        res.status(200).json(item);
        utils.broadcast(req, list, {
          type: "updateItem",
          item,
        });
      })
      .catch((error) => {
        next(error);
      });
  }
);
*/
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  userInfo,
  (req, res, next) => {
    List.find({ "users.userId": req.userId })
      .exec()
      .then((lists) => {
        console.log(lists);
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
    list.users = [{ userId: req.userId, lastSeen: new Date(), role: "owner" }];
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
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userInfo,
  role("owner"),
  (req, res, next) => {
    List.remove({
      _id: req.params.id,
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
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userInfo,
  validateIds,
  role("owner"),
  (req, res, next) => {
    List.findById(req.params.id)
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
