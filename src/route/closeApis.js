const router = require('express').Router({
  mergeParams: true,
});
const doctorRoutes = require('./closeApis/doctor');
const appointmentRoutes = require('./closeApis/appointment');

router.use('/doctor', doctorRoutes);
router.use('/appointment', appointmentRoutes);

module.exports = router;
