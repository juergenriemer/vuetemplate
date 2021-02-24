const mongoose = require("mongoose");
const List = mongoose.model("List");
const ApiError = require("../middleware/ApiError");

module.exports = (role) => {
  return (req, res, next) => {
    const listId = req.params && req.params.listId;
    const userId = req.userId;
    let roles = ["owner"];
    if (role == "admin") roles.push(...["admin"]);
    if (role == "user") roles.push(...["admin", "user"]);
    List.findOne({
      $and: [
        { _id: listId },
        {
          users: {
            $elemMatch: {
              userId,
              role: { $in: roles },
            },
          },
        },
      ],
    })
      .exec()
      .then((found) => {
        if (found) next();
        // Q have only one 401 error message?h
        else throw new ApiError(401, "wrong-role");
      })
      .catch((error) => {
        next(error);
      });
  };
};
