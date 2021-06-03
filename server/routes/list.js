const mongoose = require("mongoose");
const router = require("express").Router();
const List = mongoose.model("List");
const passport = require("passport");
const userInfo = require("../middleware/userInfo.js");
const validateIds = require("../middleware/validateIds.js");
const role = require("../middleware/role.js");
const utils = require("../lib/utils");
const ApiError = require("../middleware/ApiError");
const { deleteFolder } = require("../lib/files.js");

// uncheck all items
router.put(
  "/toggle/:listId/:done",
  passport.authenticate("jwt", { session: false }),
  userInfo,
  validateIds,
  role("user"),
  (req, res, next) => {
    const seen = new Date();
    const { listId, done } = req.params;
    const newState = done == "true"; // done is string, convert to bool
    const userId = req.userId;
    req.list.items.forEach((item) => {
      if (item.done !== newState) {
        item.lastAction = seen;
        item.lastSeen.find((usr) => usr.userId == userId).seen = seen;
        item.done = newState;
      }
    });
    let log = `TOGGLE_LIST(${JSON.stringify(req.params)})::`;
    Promise.resolve()
      .then(() => {
        log += " > save list";
        return req.list.save();
      })
      .then((list) => {
        log += " > respond";
        const data = {
          listId,
          done: newState,
          seen,
        };
        utils.broadcast(req, list, {
          type: "toggleList",
          data,
        });
        res.status(200).json(data);
      })
      .catch((err) => {
        next(err);
      })
      .finally((_) => console.log(log));
  }
);

// set last seen date for user
router.put(
  "/saw",
  passport.authenticate("jwt", { session: false }),
  userInfo,
  (req, res, next) => {
    const seen = new Date();
    const userId = req.userId;
    let log = `SAW_LISTS(${JSON.stringify(req.params)})::`;
    Promise.resolve()
      .then(() => {
        log += " > update";
        return List.updateMany(
          { "lastSeen.userId": userId },
          { $set: { "lastSeen.$.seen": seen } },
          { timestamps: false, upsert: true, new: true }
        );
      })
      .then((list) => {
        log += " > respond";
        const data = {
          userId,
          seen,
        };
        res.status(200).json(data);
      })
      .catch((err) => {
        next(err);
      })
      .finally((_) => console.log(log));
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
    const seen = new Date();
    const data = (({ title }) => ({ title }))(req.body);
    const userId = req.userId;
    let list = new List(data);
    list._id = new mongoose.mongo.ObjectId();
    list.creatorId = req.userId;
    list.users = [
      {
        userId,
        email: req.email,
        name: req.name,
        short: req.short,
        role: "owner",
      },
    ];
    list.lastAction = seen;
    list.lastSeen = [{ userId, seen }];
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
    const { listId } = req.params;
    const listFolder = `./uploads/${listId}`;
    let log = `LIST_DELETE(${JSON.stringify(req.params)})::`;
    Promise.resolve()
      .then(() => {
        return deleteFolder(listFolder);
      })
      .then(() => {
        // need to broadcast before list is gone, because
        // we have user info there.. refactor this
        log += " > broadcast";
        utils.broadcast(req, req.list, {
          type: "deleteList",
          data: {
            listId: req.list._id,
          },
        });
      })
      .then(() => {
        log += " > delete_list";
        return req.list.remove();
      })
      .then(() => {
        res.status(200).json();
      })
      .catch((err) => {
        next(new ApiError(501, log, err));
      })
      .finally((_) => console.log(log));
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
        Object.assign(update, { updatedAt: list.updatedAt });
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

// reorder items
router.put(
  "/reorder/:listId/:from/:to",
  passport.authenticate("jwt", { session: false }),
  userInfo,
  validateIds,
  role("user"),
  (req, res, next) => {
    let log = `REORDER_LIST(${JSON.stringify(req.params)})::`;
    const seen = new Date();
    const { listId, from, to } = req.params;
    const userId = req.userId;
    Promise.resolve()
      .then(() => {
        log += " > prepare data";
        try {
          const draggedItem = req.list.items.splice(from, 1)[0];
          req.list.items.splice(to, 0, draggedItem);
          console.log(from, to);
          req.list.items[from].lastAction = seen;
          req.list.items[from].lastSeen.find(
            (usr) => usr.userId == userId
          ).seen = seen;
          req.list.items[to].lastAction = seen;
          req.list.items[to].lastSeen.find(
            (usr) => usr.userId == userId
          ).seen = seen;
          return true;
        } catch (err) {
          throw new Error(err);
        }
      })
      .then(() => {
        log += " > save list";
        return req.list.save();
      })
      .then((list) => {
        const data = {
          listId,
          from,
          to,
          seen,
        };
        utils.broadcast(req, list, {
          type: "reorderList",
          data,
        });
        res.status(200).json(data);
      })
      .catch((err) => {
        next(err);
      })
      .finally((_) => console.log(log));
  }
);

module.exports = router;
