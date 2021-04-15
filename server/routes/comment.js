const mongoose = require("mongoose");
const router = require("express").Router();
const List = mongoose.model("List");
const passport = require("passport");
const utils = require("../lib/utils");
const { deleteFile, isEmptyFolder, deleteFolder } = require("../lib/files.js");
const userInfo = require("../middleware/userInfo.js");
const role = require("../middleware/role.js");
const validateIds = require("../middleware/validateIds.js");
const ApiError = require("../middleware/ApiError");

// create comment
router.post(
  "/:listId/:itemId",
  passport.authenticate("jwt", { session: false }),
  validateIds,
  userInfo,
  role("user"),
  (req, res, next) => {
    const { listId, itemId } = req.params;
    const comment = (({ text, imageFile }) => ({ text, imageFile }))(req.body);
    comment._id = new mongoose.mongo.ObjectId();
    comment.creatorId = req.userId;
    let item = req.list.items.find((itm) => itm._id == itemId);
    item.comments.push(comment);
    req.list
      .save()
      .then((list) => {
        res.status(200).json({ comment });
        utils.broadcast(req, list, {
          type: "addComment",
          data: {
            listId,
            itemId,
            comment,
          },
        });
      })
      .catch((error) => {
        next(error);
      });
  }
);

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
    const item = req.list.items.find((itm) => itm._id == itemId);
    const comment = item.comments.find((cmt) => cmt._id == commentId);
    // check if allowed to delete
    if (!["admin", "owner"].includes(req.role)) {
      if (!comment) throw new ApiError(404, "no-item");
      if (!(req.userId == comment.creatorId))
        throw new ApiError(403, "not-item-creator");
    }
    let log = `COMMENT_DELETE(${JSON.stringify(req.params)})::`;
    Promise.resolve()
      .then(() => {
        if (comment.imageFile) {
          log += " > clean up images";
          const folder = `./uploads/${listId}/${itemId}`;
          return Promise.resolve()
            .then(() => {
              // for the record.. document this
              // throw new ApiError(403, "not-item-creator");
              return true;
            })
            .then(() => {
              log += " > delete_thumb_file";
              return deleteFile(`${folder}/thumb_${comment.imageFile}`);
            })
            .then(() => {
              log += " > delete_large_file";
              return deleteFile(`${folder}/large_${comment.imageFile}`);
            })
            .then(() => {
              log += " > check_if_item_folder_empty";
              return isEmptyFolder(folder);
            })
            .then((isEmpty) => {
              if (isEmpty) {
                log += " > delete_item_folder";
                return deleteFolder(folder);
              } else return true;
            });
        } else return true;
      })
      .then(() => {
        log += " > delete_comment";
        item.comments = item.comments.filter((cmt) => cmt._id != commentId);
        return req.list.save();
      })
      .then((list) => {
        log += " > broadcast";
        utils.broadcast(req, list, {
          type: "removeComment",
          data: {
            listId,
            itemId,
            commentId,
          },
        });
        res.status(200).json();
      })
      .catch((err) => {
        next(new ApiError(501, log, err));
      });
  }
);

module.exports = router;
