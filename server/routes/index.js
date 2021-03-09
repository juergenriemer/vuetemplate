const router = require("express").Router();

router.use("/users", require("./users"));
router.use("/share", require("./share"));
router.use("/comment", require("./comment"));
router.use("/item", require("./item"));
router.use("/list", require("./list"));

module.exports = router;
