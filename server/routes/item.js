const mongoose = require("mongoose");
const router = require("express").Router();
const List = mongoose.model("List");
const passport = require("passport");
const utils = require("../lib/utils");
const userInfo = require("../middleware/userInfo.js");
const role = require("../middleware/role.js");
const validateIds = require("../middleware/validateIds.js");
const ApiError = require("../middleware/ApiError");
const {
  deleteFolder,
  folderExists,
  isEmptyFolder,
} = require("../lib/files.js");

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
    const item = req.list.items.find((itm) => itm._id == itemId);
    // check if allowed to delete
    if (!["admin", "owner"].includes(req.role)) {
      if (!item) throw new ApiError(404, "no-item");
      if (!(req.userId == item.creatorId))
        throw new ApiError(403, "not-item-creator");
    }
    const listFolder = `./uploads/${listId}`;
    const itemFolder = `${listFolder}/${itemId}`;
    let log = `ITEM_DELETE(listId:${listId},itemId:${itemId})::`;
    Promise.resolve()
      .then(() => {
        return folderExists(itemFolder);
      })
      .then((exists) => {
        if (exists) {
          log += " > clean up images";
          return Promise.resolve()
            .then(() => {
              // for the record.. document this
              // throw new ApiError(403, "not-item-creator");
              return true;
            })
            .then(() => {
              log += " > delete_item_folder";
              return deleteFolder(itemFolder);
            })
            .then(() => {
              log += " > check_if_list_folder_empty";
              return isEmptyFolder(listFolder);
            })
            .then((isEmpty) => {
              if (isEmpty) {
                log += " > delete_list_folder";
                return deleteFolder(listFolder);
              } else return true;
            });
        } else return true;
      })
      .then(() => {
        log += " > save_list";
        req.list.items = req.list.items.filter((itm) => itm._id != itemId);
        return req.list.save();
      })
      .then((list) => {
        log += " > broadcast";
        res.status(200).json();
        utils.broadcast(req, list, {
          type: "deleteItem",
          data: {
            listId,
            itemId,
          },
        });
      })
      .catch((err) => {
        next(new ApiError(501, log, err));
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
        utils.broadcast(req, list, {
          type: "addItem",
          data: {
            listId,
            item,
          },
        });
        res.status(200).json({ item });
      })
      .catch((error) => {
        next(error);
      });
  }
);

module.exports = router;
