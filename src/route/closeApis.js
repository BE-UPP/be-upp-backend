const router = require('express').Router({
  mergeParams: true,
});
const doctorRoutes = require('./closeApis/doctor');
const patientRoutes = require('./closeApis/patient');
const appointmentRoutes = require('./closeApis/appointment');

router.use('/doctor', doctorRoutes);
router.use('/patient', patientRoutes);
router.use('/appointment', appointmentRoutes);

module.exports = router;
