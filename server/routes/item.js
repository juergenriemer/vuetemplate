const mongoose = require("mongoose");
const router = require("express").Router();
const List = mongoose.model("List");
const passport = require("passport");
const utils = require("../lib/utils");
const userInfo = require("../middleware/userInfo.js");
//const updateLastSeen = require("../middleware/updateLastSeen.js");
const role = require("../middleware/role.js");
const validateIds = require("../middleware/validateIds.js");
const ApiError = require("../middleware/ApiError");
const {
  deleteFolder,
  folderExists,
  isEmptyFolder,
} = require("../lib/files.js");

router.put(
  "/saw/:listId",
  passport.authenticate("jwt", { session: false }),
  userInfo,
  role("user"),
  (req, res, next) => {
    const seen = new Date();
    const { listId } = req.params;
    const userId = req.userId;
    req.list.items.forEach((item, itemIx) => {
      let userIx = item.lastSeen.findIndex((elem) => elem.userId == userId);
      if (userIx == -1) item.lastSeen.push({ userId, seen });
      else item.lastSeen[userIx].seen = seen;
    });
    let log = `SAW_ITEMS(${JSON.stringify(req.params)})::`;
    Promise.resolve()
      .then(() => {
        log += " > update list";
        return req.list.save();
      })
      .then((list) => {
        log += " > respond";
        const data = {
          listId,
          userId,
          seen,
        };
        res.status(200).json(data);
      })
      .catch((error) => {
        // REF: this error handling or the one from delete??
        next(error);
      })
      .finally((_) => console.log(log));
  }
);

router.put(
  "/:listId/:itemId",
  passport.authenticate("jwt", { session: false }),
  validateIds,
  userInfo,
  role("user"),
  //updateLastSeen,
  (req, res, next) => {
    const seen = new Date();
    const { listId, itemId } = req.params;
    const userId = req.userId;
    const update = (({ title, done }) => ({ title, done }))(req.body);
    let itemIx = req.list.items.findIndex((itm) => itm._id == itemId);
    let item = req.list.items[itemIx];
    item = Object.assign(item, update);
    item.lastAction = seen;
    let userIx = item.lastSeen.findIndex((elem) => elem.userId == userId);
    if (userIx == -1) item.lastSeen.push({ userId, seen });
    else item.lastSeen[userIx].seen = seen;
    req.list.items[itemIx] = item;
    console.log(item.lastSeen);
    console.log(item.lastAction);
    let log = `ITEM_UPDATE(${JSON.stringify(req.params)})::`;
    Promise.resolve()
      .then(() => {
        log += " > update list";
        return req.list.save();
      })
      .then((list) => {
        log += " > broadcast";
        item.updatedAt = list.updatedAt;
        const data = {
          listId,
          itemId,
          item,
        };
        utils.broadcast(req, list, {
          type: "updateItem",
          data,
        });
        res.status(200).json(data);
      })
      .catch((error) => {
        // REF: this error handling or the one from delete??
        next(error);
      })
      .finally((_) => console.log(log));
  }
);

router.delete(
  "/:listId/:itemId",
  passport.authenticate("jwt", { session: false }),
  validateIds,
  userInfo,
  role("user"),
  //updateLastSeen,
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
    let log = `ITEM_DELETE(${JSON.stringify(req.params)})::`;
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
        const data = {
          listId,
          itemId,
          updatedAt: list.updatedAt,
        };
        res.status(200).json(data);
        utils.broadcast(req, list, {
          type: "deleteItem",
          data,
        });
      })
      .catch((err) => {
        next(new ApiError(501, log, err));
      })
      .finally((_) => console.log(log));
  }
);

router.post(
  "/:listId",
  passport.authenticate("jwt", { session: false }),
  validateIds,
  userInfo,
  role("user"),
  //updateLastSeen,
  (req, res, next) => {
    const seen = new Date();
    const { listId } = req.params;
    let item = (({ title }) => ({ title }))(req.body);
    item._id = new mongoose.mongo.ObjectId();
    item.comments = [];
    item.lastSeen = [];
    item.lastSeen.push({ userId: req.userId, seen });
    item.creatorId = req.userId;
    item.lastAction = seen;
    req.list.items.push(item);
    let log = `ITEM_CREATE(${JSON.stringify(req.params)})::`;
    Promise.resolve()
      .then(() => {
        log += " > save list";
        return req.list.save();
      })
      .then((list) => {
        log += " > broadcast";
        item.updatedAt = list.updatedAt;
        const data = {
          listId,
          item,
        };
        utils.broadcast(req, list, {
          type: "addItem",
          data,
        });
        res.status(200).json(data);
      })
      .catch((error) => {
        next(error);
      })
      .finally((_) => console.log(log));
  }
);

module.exports = router;
