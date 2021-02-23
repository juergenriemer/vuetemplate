const router = require("express").Router();

router.use("/users", require("./users"));
router.use("/share", require("./share"));
router.use("/item", require("./item"));
router.use("/list", require("./list"));
router.use("/csrf", require("./csrf"));

module.exports = router;
