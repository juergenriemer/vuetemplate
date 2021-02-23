const cookieParser = require("cookie-parser");
const csrf = require("csurf");
var bodyParser = require("body-parser"); // delete
const mongoose = require("mongoose");
const router = require("express").Router();
const List = mongoose.model("List");
const User = mongoose.model("User");
const passport = require("passport");
const utils = require("../lib/utils");
const userInfo = require("../middleware/userInfo.js");
const validateIds = require("../middleware/validateIds.js");
const role = require("../middleware/role.js");

const csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });

router.use(cookieParser());

router.get("/test", csrfProtection, (req, res) => {
  res.status(200).json({ ok: true });
});
//
//
//
//
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
  csrfProtection,
  passport.authenticate("jwt", { session: false }),
  userInfo,
  role("user"),
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

router.get(
  "/",
  csrfProtection,
  passport.authenticate("jwt", { session: false }),
  userInfo,
  (req, res, next) => {
    console.log(">>>>>>>>>>>");
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
  csrfProtection,
  passport.authenticate("jwt", { session: false }),
  userInfo,
  (req, res, next) => {
    console.log(req.headers);
    //console.log(req.rawHeaders);
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
