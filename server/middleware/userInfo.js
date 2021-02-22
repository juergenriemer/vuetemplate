const utils = require("../lib/utils");
module.exports = function (req, res, next) {
  const auth = req && req.headers && req.headers.authorization;
  if (!auth) {
    res.send(401, "not-authorized");
  } else {
    const parts = auth.split("Bearer ");
    if (parts && parts[1]) {
      const token = parts[1];
      const userId = utils.getUserId(token);
      if (userId) {
        req.userId = userId;
        next();
      } else {
        res.send(401, "User not authorized"); // user not found
      }
    } else {
      res.send(401, "not-authorized");
    }
  }
};
