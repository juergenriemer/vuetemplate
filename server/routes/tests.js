require("dotenv").config();
const baseUrl = process.env.CLIENT_HOST;
//const csrf = require("csurf");
//const csrfProtection = csrf({ cookie: true });
// make users insgular
const mongoose = require("mongoose");
const router = require("express").Router();
const User = mongoose.model("User");
const List = mongoose.model("List");
const passport = require("passport");
const utils = require("../lib/utils");
const valid = require("../lib/valid");
const mail = require("../lib/email");
const userInfo = require("../middleware/userInfo.js");
const validateIds = require("../middleware/validateIds.js");
const ApiError = require("../middleware/ApiError");

// REFACTOR: use jsonwebtoken from ./utils.js instead of jwt replace encooe/decaue with sign/verify?d

module.exports = router;
