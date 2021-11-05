const router = require('express').Router({
  mergeParams: true,
});
const templatesRoutes = require('./openApis/template');
const formDataRoutes = require('./openApis/form-data');

router.use('/template', templatesRoutes);
router.use('/form-data', formDataRoutes);

module.exports = router;
