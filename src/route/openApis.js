const router = require('express').Router({
  mergeParams: true,
});
const templatesRoutes = require('./openApis/template');
const formDataRoutes = require('./openApis/form-data');
const patientRoutes = require('./openApis/patient');
const doctorRoutes = require('./openApis/doctor');
const appointmentRoutes = require('./openApis/appointment');
const dataProcessingRoutes = require('./openApis/data-processing');

router.use('/template', templatesRoutes);
router.use('/form-data', formDataRoutes);
router.use('/patient', patientRoutes);
router.use('/doctor', doctorRoutes);
router.use('/appointment', appointmentRoutes);
router.use('/data-processing', dataProcessingRoutes);

module.exports = router;
