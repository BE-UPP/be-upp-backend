const router = require('express').Router({
  mergeParams: true,
});
const templatesRoutes = require('./openApis/template');
const formDataRoutes = require('./openApis/form-data');
const doctorRoutes = require('./openApis/doctor');
const dataProcessingRoutes = require('./openApis/data-processing');
const finalReportRoutes = require('./openApis/final-report');

router.use('/template', templatesRoutes);
router.use('/form-data', formDataRoutes);
router.use('/doctor', doctorRoutes);
router.use('/data-processing', dataProcessingRoutes);
router.use('/final-report', finalReportRoutes);

module.exports = router;
