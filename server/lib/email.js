const nodemailer = require("nodemailer");
const ApiError = require("../middleware/ApiError");

var transport = nodemailer.createTransport({
  port: 25,
  host: "localhost",
});

var send = (opts) => {
  opts.from = "TEST<juergen.riemer@segestria.at>";
  console.log(opts);

  const fs = require("fs");
  file = `../tests/test-files/${opts.subject}.eml`;
  fs.writeFile(file, opts.text, (err) => {
    console.log(err);
  });

  var p = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
  p.then(() => {
    return true;
  });

  return;
  return transport
    .sendMail(opts)
    .then(() => true)
    .catch((error) => {
      throw new ApiError(500, "smtp-error", error);
    });
};

module.exports.send = send;
