const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });
const express = require("express");
const cors = require("cors");
const path = require("path");
const passport = require("passport");

//const bodyParser = require("body-parser");
//var parseForm = bodyParser.urlencoded({ extended: false });

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require("dotenv").config();

// Create the Express application
var app = express();

app.use(cookieParser());

// Configures the database and opens a global connection that can be used in any module with `mongoose.connection`
require("./config/database");

// Must first load the models
require("./models/User");
require("./models/List");

// Pass the global passport object into the configuration function
require("./config/passport")(passport);
//

// This will initialize the passport object on every request
app.use(passport.initialize());

// Instead of using body-parser middleware, use the new Express implementation of the same thing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allows our Angular application to make HTTP requests to Express application

const corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));

// provide CSRF token service

app.use(csrfProtection);
app.get("/csrf", csrfProtection, function (req, res) {
  console.log(">>csrf<>");
  res.status(200).json({ csrf: req.csrfToken() });
});

// Where Angular builds to - In the ./angular/angular.json file, you will find this configuration
// at the property: projects.angular.architect.build.options.outputPath
// When you run `ng build`, the output will go to the ./public directory
app.use(express.static(path.join(__dirname, "public")));
/**
 * -------------- ROUTES ----------------
 */
// set up for CSRF protection

/*
var bodyParser = require("body-parser"); // delete
const csurf = require("csurf");
app.use(bodyParser.json());
app.use(cookieParser());
const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);
*/
// Imports all of the routes from ./routes/index.js
app.use(require("./routes"));

// Import Error handler
app.use(require("./middleware/apiErrorHandler"));
/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
let http = app.listen(3003);

const io = require("socket.io")(http, {
  allowEIO3: true,
  cors: {
    origin: process.env.CLIENT_HOST,
    credentials: true,
    methods: ["GET", "POST"],
  },
});
app.set("io", io);
io.on("connection", (socket) => {
  console.log("socket.io inited");
});
