const utils = require("../lib/utils");
module.exports = function (req, res, next) {
  const auth = req && req.headers && req.headers.authorization;
  if (!auth) {
    res.send(401, "not-authorized");
  } else {
    const parts = auth.split("Bearer ");
    if (parts && parts[1]) {
      const token = parts[1];
      const info = utils.getUserInfo(token);
      if (info) {
        req.userId = info._id;
        req.name = info.name;
        req.short = info.short;
        req.email = info.email;
        req.picture = info.picture;
        next();
      } else {
        res.send(401, "not-authorized"); // user not found
      }
    } else {
      res.send(401, "not-authorized");
    }
  }
};
