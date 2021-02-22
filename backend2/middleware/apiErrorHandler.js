const ApiError = require("./ApiError");

const createUid = () => {
  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
};

function apiErrorHandler(err, req, res, next) {
  // in prod, don't use console.log or console.err because
  // it is not async
  console.log(">>>>>>>>>>>DEV>>>>>>>>>>>");
  console.error(err.code);
  console.error(err.message);
  console.log(".......................");
  console.error(err);
  console.log(">>>>>>>>>>>DEV>>>>>>>>>>>");
  let message = "gereric-server-error";
  let code = 500;
  let uid = createUid();
  if (err instanceof ApiError) {
    message = err.message;
    code = err.code;
    //res.status(err.code).json(err.message);
    //return;
  }

  //res.status(500).json("something went wrong");
  res.status(code).json({ message, uid });
}

module.exports = apiErrorHandler;
