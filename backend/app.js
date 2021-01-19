const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = "movieratingapplicationsecretkey";
ExtractJwt.app(app);
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());

mongoose.connect("mongodb://localhost:27017/posts");
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function (callback) {
  console.log("Connection Succeeded");
});

// root

app.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  //app.get('/', (req, res) => {
  res.send("template backend");
});

// REST
//const rest = require( "./controllers/rest.js" );
//rest.controller( app );

const users = require("./controllers/users.js");
users.controller(app);

app.use("/", router);
app.listen(8082, "0.0.0.0");
