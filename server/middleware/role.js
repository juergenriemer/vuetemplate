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
    console.log(">>>>>>>>>>");
    console.log("listId: " + listId);
    console.log("userId: " + userId);
    console.log(roles);
    console.log(">>>>>>>>>>");
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
        console.log("FOUND", found);
        if (found) next();
        else throw new ApiError(401, "wrong-role");
      })
      .catch((error) => {
        next(error);
      });
  };
};
