const mongoose = require("mongoose");
const List = mongoose.model("List");
const ApiError = require("../middleware/ApiError");

module.exports = (role) => {
  // REF: add logging similar to the routes one
  return (req, res, next) => {
    const listId = req.params ? req.params.listId : null;
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
      .then((list) => {
        if (list) {
          req.list = list;
          req.role = req.list.users.find(
            (user) => user.userId == req.userId
          ).role;
          next();
        }
        // Q have only one 401 error message?h
        else throw new ApiError(403, "wrong-role");
      })
      .catch((error) => {
        next(error);
      });
  };
};
