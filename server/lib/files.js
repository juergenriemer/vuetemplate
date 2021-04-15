const fs = require("fs");

const createFolder = (path) => {
  return fs.promises.stat(path).catch((err) => {
    if (err.code === "ENOENT") {
      return fs.promises.mkdir(path);
    } else throw err;
  });
};

const deleteFolder = (path) => {
  return fs.promises.rmdir(path, { recursive: true }).catch((err) => {
    if (err.code === "ENOENT") {
      return true;
    } else throw err;
  });
};

const deleteFile = (file) => {
  console.log(file);
  return fs.promises.unlink(file);
};

const isEmptyFolder = (path) => {
  return fs.promises.readdir(path).then((files) => {
    return files.length === 0;
  });
};

const folderExists = (path) => {
  return fs.promises
    .stat(path)
    .then(() => true)
    .catch((err) => {
      if (err.code === "ENOENT") {
        return false;
      } else throw err;
    });
};

module.exports = {
  createFolder,
  deleteFolder,
  deleteFile,
  isEmptyFolder,
  folderExists,
};
