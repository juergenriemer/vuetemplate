const mongoose = require("mongoose");
const router = require("express").Router();
const List = mongoose.model("List");
const passport = require("passport");
const utils = require("../lib/utils");
const userInfo = require("../middleware/userInfo.js");
const role = require("../middleware/role.js");
const validateIds = require("../middleware/validateIds.js");
const ApiError = require("../middleware/ApiError");

router.put(
  "/:listId/:itemId",
  passport.authenticate("jwt", { session: false }),
  validateIds,
  userInfo,
  role("user"),
  (req, res, next) => {
    const { listId, itemId } = req.params;
    const update = (({ title, done }) => ({ title, done }))(req.body);
    let itemIx = req.list.items.findIndex((itm) => itm._id == itemId);
    let item = req.list.items[itemIx];
    item = Object.assign(item, update);
    req.list.items[itemIx] = item;
    // save list
    req.list
      .save()
      .then((list) => {
        utils.broadcast(req, list, {
          type: "updateItem",
          data: {
            listId,
            itemId,
            item,
          },
        });
        res.status(200).json();
      })
      .catch((error) => {
        next(error);
      });
  }
);

router.delete(
  "/:listId/:itemId",
  passport.authenticate("jwt", { session: false }),
  validateIds,
  userInfo,
  role("user"),
  (req, res, next) => {
    // get data
    const { listId, itemId } = req.params;
    // check if allowed to delete
    if (!["admin", "owner"].includes(req.role)) {
      const item = req.list.items.find((itm) => itm._id == itemId);
      if (!item) throw new ApiError(404, "no-item");
      if (!(req.userId == item.creatorId))
        throw new ApiError(403, "not-item-creator");
    }
    // delete comment
    req.list.items = req.list.items.filter((itm) => itm._id != itemId);
    // save list
    req.list
      .save()
      .then((list) => {
        res.status(200).json();
        utils.broadcast(req, list, {
          type: "removeItem",
          data: {
            listId,
            itemId,
          },
        });
      })
      .catch((error) => {
        next(error);
      });
  }
);

router.post(
  "/:listId",
  passport.authenticate("jwt", { session: false }),
  validateIds,
  userInfo,
  role("user"),
  (req, res, next) => {
    const { listId } = req.params;
    let item = (({ title }) => ({ title }))(req.body);
    item._id = new mongoose.mongo.ObjectId();
    item.comments = [];
    item.creatorId = req.userId;
    req.list.items.push(item);
    req.list
      .save()
      .then((list) => {
        res.status(200).json({ item });
        utils.broadcast(req, list, {
          type: "addItem",
          data: {
            listId,
            item,
          },
        });
      })
      .catch((error) => {
        next(error);
      });
  }
);

module.exports = router;
