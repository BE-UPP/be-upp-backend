const router = require('express').Router({
  mergeParams: true,
});
const templatesRoutes = require('./openApis/template');
const formDataRoutes = require('./openApis/form-data');
const patientRoutes = require('./openApis/patient');
const doctorRoutes = require('./openApis/doctor');

router.use('/template', templatesRoutes);
router.use('/form-data', formDataRoutes);
router.use('/patient', patientRoutes);
router.use('/doctor', doctorRoutes);

module.exports = router;
