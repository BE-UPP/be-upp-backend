const router = require('express').Router({
  mergeParams: true,
});
const doctorRoutes = require('./closeApis/doctor');
const patientRoutes = require('./closeApis/patient');
const appointmentRoutes = require('./closeApis/appointment');
const finalReportRoutes = require('./closeApis/final-report');

router.use('/doctor', doctorRoutes);
router.use('/patient', patientRoutes);
router.use('/appointment', appointmentRoutes);
router.use('/final-report', finalReportRoutes);

module.exports = router;
