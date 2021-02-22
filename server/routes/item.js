const mongoose = require("mongoose");
const router = require("express").Router();
const List = mongoose.model("List");
const User = mongoose.model("User");
const passport = require("passport");
const utils = require("../lib/utils");
const userInfo = require("../middleware/userInfo.js");
const role = require("../middleware/role.js");
const validateIds = require("../middleware/validateIds.js");

const ApiError = require("../middleware/ApiError");
// LISTITEM ROUTES
router.put(
  "/:listId/:itemId",
  passport.authenticate("jwt", { session: false }),
  validateIds,
  userInfo,
  role("user"),
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

//
// delete item
router.delete(
  "/:listId/:itemId",
  passport.authenticate("jwt", { session: false }),
  validateIds,
  userInfo,
  role("user"),
  (req, res, next) => {
    const { listId, itemId } = req.params;
    List.findByIdAndUpdate(
      { _id: listId },
      {
        $pull: { items: { _id: itemId } },
      }
    )
      .exec()
      .then((list) => {
        res.status(200).json();
        utils.broadcast(req, list, {
          type: "removeItem",
          itemId,
        });
      })
      .catch((error) => {
        next(error);
      });
  }
);

// create list item
router.post(
  "/:listId",
  passport.authenticate("jwt", { session: false }),
  validateIds,
  userInfo,
  role("user"),
  (req, res, next) => {
    const { listId } = req.params;
    let item = req.body;
    item._id = new mongoose.mongo.ObjectId();
    List.findByIdAndUpdate(
      { _id: listId },
      {
        $push: { items: item },
      },
      { new: true, upsert: true }
    )
      .exec()
      .then((list) => {
        res.status(200).json(item);
        item.updatedAt = new Date(); // set date to show as new
        utils.broadcast(req, list, {
          type: "addItem",
          item,
        });
      })
      .catch((error) => {
        next(error);
      });
  }
);

module.exports = router;
