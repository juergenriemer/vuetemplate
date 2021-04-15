const mongoose = require("mongoose");
const router = require("express").Router();
const passport = require("passport");
const userInfo = require("../middleware/userInfo.js");
const role = require("../middleware/role.js");
const validateIds = require("../middleware/validateIds.js");
const ApiError = require("../middleware/ApiError");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");
const { createFolder } = require("../lib/files.js");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, req.itemFolder);
  },
  filename: function (req, file, cb) {
    req.targetName = Date.now() + "_" + file.originalname;
    cb(null, req.targetName);
  },
});

var upload = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|jpeg|bin)$/)) {
      return cb(new ApiError(500, "filetype-not-allowed"));
    }
    cb(null, true);
  },
}).single("file");

function uploadAsync(req, res) {
  return new Promise(function (resolve, reject) {
    upload(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        if (error.code == "LIMIT_FILE_SIZE")
          return reject(new ApiError(502, "file-too-large", error));
        else return reject(new ApiError(503, "upload-failed", error));
      } else if (error instanceof ApiError) {
        return reject(error);
      } else if (error) {
        return reject(new ApiError(504, "upload-failed", error));
      } else {
        resolve(req.targetName);
      }
    });
  });
}

router.post(
  "/:listId/:itemId",
  passport.authenticate("jwt", { session: false }),
  validateIds,
  userInfo,
  role("user"),
  (req, res, next) => {
    const { listId, itemId } = req.params;
    const folder = `./uploads`;
    const listFolder = `${folder}/${listId}`;
    const itemFolder = `${folder}/${listId}/${itemId}`;
    let imageFile;
    let log = `FILE_CREATE(listId:${listId},itemId:${itemId})::`;
    Promise.resolve()
      .then(() => {
        log += " > create_item_dir";
        return createFolder(listFolder);
      })
      .then(() => {
        log += " > create_item_dir";
        return createFolder(itemFolder);
      })
      .then(() => {
        log += " > upload_orig";
        req.itemFolder = itemFolder;
        return uploadAsync(req, res);
      })
      .then((filename) => {
        imageFile = filename;
        log += " > create_thumb";
        return sharp(`${itemFolder}/${imageFile}`)
          .resize(300)
          .toFile(`${itemFolder}/thumb_${imageFile}`);
      })
      .then(() => {
        log += " > create_large";
        return sharp(`${itemFolder}/${imageFile}`)
          .resize(800)
          .toFile(`${itemFolder}/large_${imageFile}`);
      })
      .then(() => {
        log += " > delete_orig";
        return fs.promises.unlink(`${itemFolder}/${imageFile}`);
      })
      .then(() => {
        log += " > send_imgage_file";
        res.status(200).json({ imageFile });
      })
      .catch((err) => {
        next(new ApiError(500, log, err));
      });
  }
);

// TEST: access from not allowed users, e.g. when unsharing
router.get(
  "/:listId/:itemId/:filename",
  passport.authenticate("jwt", { session: false }),
  validateIds,
  userInfo,
  role("user"),
  (req, res, next) => {
    const { listId, itemId, filename, type } = req.params;
    const file = `../uploads/${listId}/${itemId}/${filename}`;
    try {
      res.sendFile(path.join(__dirname, file));
    } catch (error) {
      if (error instanceof ApiError) next(error);
      else next(new ApiError(505, "download-failed", error));
    }
  }
);

router.post(
  "/test/:listId/:itemId",
  passport.authenticate("jwt", { session: false }),
  validateIds,
  userInfo,
  role("user"),
  (req, res, next) => {
    const { listId, itemId } = req.params;
    let imageFile;
    let folder = `./uploads`;
    try {
      [listId, itemId].forEach((part) => {
        folder += `/${part}`;
        if (!fs.existsSync(folder)) {
          try {
            fs.mkdirSync(folder);
            next();
          } catch (error) {
            next(new ApiError(501, "upload-failed", error));
          }
        }
      });
      req.folder = folder;
      // REF: promisify below!!!
      upload(req, res, (error) => {
        if (error instanceof multer.MulterError) {
          if (error.code == "LIMIT_FILE_SIZE")
            next(new ApiError(502, "file-too-large", error));
          else next(new ApiError(503, "upload-failed", error));
        } else if (error instanceof ApiError) {
          next(error);
        } else if (error) {
          next(new ApiError(504, "upload-failed", error));
        } else {
          imageFile = req.targetName;
          const inputFile = `${folder}/${imageFile}`;
          sharp(inputFile)
            .resize(800)
            .toFile(`${folder}/large_${imageFile}`, (err, resizeImage) => {
              if (err) next(new ApiError(508, "shrink-file", err));
              else {
                sharp(inputFile)
                  .resize(300)
                  .toFile(
                    `${folder}/thumb_${imageFile}`,
                    (err, resizeImage) => {
                      if (err) next(new ApiError(508, "thumb-creation", err));
                      else {
                        try {
                          fs.unlinkSync(inputFile);
                          res.status(200).json({ imageFile });
                        } catch (err) {
                          next(
                            new ApiError(509, "cannot-delete-original", err)
                          );
                        }
                      }
                    }
                  );
              }
            });
        }
      });
    } catch (error) {
      next(new ApiError(505, "upload-failed", error));
    }
  }
);

module.exports = router;
