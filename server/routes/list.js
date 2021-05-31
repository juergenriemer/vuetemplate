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
    let { listId, done } = req.params;
    done = done == "true"; // done is string, convert to bool
    req.list.items.forEach((item) => (item.done = done));
    req.list
      .save()
      .then((list) => {
        utils.broadcast(req, list, {
          type: "toggleList",
          data: {
            listId,
            done,
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
    let log = `SAW_LIST(${JSON.stringify(req.params)})::`;
    log += "::" + req.userId + "::";
    Promise.resolve()
      .then(() => {
        log += " > update";
        return List.updateOne(
          { _id: listId, "users.userId": req.userId },
          { $set: { "users.$.lastSeen": new Date() } },
          { timestamps: false, upsert: true, new: true }
        );
      })
      .then((list) => {
        /* use this to indicate who is currently in a list 
        utils.broadcast(req, list, {
          type: "sawList",
          listId,
          req.userId
        */
      })
      .catch((err) => {
        next(new ApiError(501, log, err));
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
    console.log("username: " + req.name);
    const data = (({ title }) => ({ title }))(req.body);
    let list = new List(data);
    list._id = new mongoose.mongo.ObjectId();
    list.creatorId = req.userId;
    list.users = [
      {
        userId: req.userId,
        email: req.email,
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
    const { listId, from, to } = req.params;
    const draggedItem = req.list.items.splice(from, 1)[0];
    req.list.items.splice(to, 0, draggedItem);
    req.list
      .save()
      .then((list) => {
        utils.broadcast(req, list, {
          type: "reorderList",
          data: {
            listId,
            from,
            to,
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
