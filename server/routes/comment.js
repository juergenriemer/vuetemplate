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
    const { listId, itemId, commentId } = req.params;

    console.log("listId:" + listId);
    console.log("itemId:" + itemId);
    console.log("commentId:" + commentId);
    //List.find({ _id: listId, "items._id": itemId, "comments._id": commentId })
    List.find(
      { _id: listId, "items._id": itemId },
      { users: 1, items: 1, comments: 1 }
    )
      .exec()
      .then((result) => {
        const items = result[0].items;
        const users = result[0].users;
        const role = users.find((user) => user.userId == req.userId).role;
        const item = items.find((item) => item._id == itemId);
        const comment = item.comments.find(
          (comment) => comment._id == commentId
        );
        if (req.userId == comment.userId) {
          console.log("its the same user");
        }
        if (role == "admin" || role == "owner") {
          console.log("its admin");
        }
        throw new ApiError(422, "is-not-your-comment");
      })
      .then(() => {
        return List.findByIdAndUpdate(
          { _id: listId, "items._id": itemId },
          {
            $pull: {
              comments: { _id: commentId },
            },
          }
        ).exec();
      })

      .then((list) => {
        res.status(200).json();
        utils.broadcast(req, list, {
          type: "removeComment",
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
    console.log(">>>>>>>>>>", userId);
    console.log("listId " + listId);
    console.log("itemId " + itemId);
    let comment = req.body;
    comment._id = new mongoose.mongo.ObjectId();
    comment.userId = userId;
    console.log(comment);
    List.findOneAndUpdate(
      { _id: listId, "items._id": itemId },
      {
        $push: {
          "items.$.comments": comment,
        },
      },
      { new: true } //, upsert: true }
    )
      .exec()
      .then(() => {
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
