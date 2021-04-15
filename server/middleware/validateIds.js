const isValid = require("mongoose").Types.ObjectId.isValid;
module.exports = function (req, res, next) {
  for (const param in req.params) {
    if (/^id/.test(param) && !isValid(req.params[param])) {
      res.status(500).json({ message: "Invalid Ids" });
      return;
    }
  }
  next();
};
