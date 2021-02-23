const cookieParser = require("cookie-parser");
const csrf = require("csurf");
var bodyParser = require("body-parser"); // delete
const router = require("express").Router();

const csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });

//router.use(bodyParser.json());
router.use(cookieParser());

router.get("/", csrfProtection, (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});

router.get("/test", csrfProtection, (req, res) => {
  res.status(200).json({ ok: true });
});

module.exports = router;
