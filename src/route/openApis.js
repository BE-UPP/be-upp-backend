
const router = require("express").Router({ mergeParams: true });
const templatesRoutes = require("./openApis/template");

router.use("/template", templatesRoutes);

module.exports = router;