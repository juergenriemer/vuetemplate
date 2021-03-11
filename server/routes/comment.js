const mongoose = require("mongoose");
const router = require("express").Router();
const List = mongoose.model("List");
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
// delete comment
router.delete(
  "/:listId/:itemId/:commentId",
  passport.authenticate("jwt", { session: false }),
  validateIds,
  userInfo,
  role("user"),
  (req, res, next) => {
    // get data
    const { listId, itemId, commentId } = req.params;
    let item = req.list.items.find((itm) => itm._id == itemId);
    // check if allowed to delete
    if (!["admin", "owner"].includes(req.role)) {
      const comment = item.comments.find((cmt) => cmt._id == commentId);
      if (!comment) throw new ApiError(404, "no-item");
      if (!(req.userId == comment.userId))
        throw new ApiError(403, "not-item-creator");
    }
    // delete comment
    item.comments = item.comments.filter((cmt) => cmt._id != commentId);
    req.list
      .save()
      .then((list) => {
        res.status(200).json();
        utils.broadcast(req, list, {
          type: "removeComment",
          listId,
          itemId,
          commentId,
        });
      })
      .catch((error) => {
        next(error);
      });
  }
);

// create comment
router.post(
  "/:listId/:itemId",
  passport.authenticate("jwt", { session: false }),
  validateIds,
  userInfo,
  role("user"),
  (req, res, next) => {
    const { listId, itemId } = req.params;
    const userId = req.userId;
    let comment = req.body;
    comment._id = new mongoose.mongo.ObjectId();
    comment.userId = userId;
    let item = req.list.items.find((itm) => itm._id == itemId);
    item.comments.push(comment);
    req.list
      .save()
      .then((list) => {
        res.status(200).json({ comment });
        utils.broadcast(req, list, {
          type: "addComment",
          listId,
          itemId,
          comment,
        });
      })
      .catch((error) => {
        next(error);
      });
  }
);

module.exports = router;
