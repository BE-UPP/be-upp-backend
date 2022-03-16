const express = require('express');
const router = express.Router();
const {
  listUsers,
  listAppointments,
  changeAccount,
} = require('../../service/doctor');
const { authorize } = require('../../service/authentication');
const { responseError } = require('../../service/helper');

router.get('/appointments', authorize(), async(req, res) => {
  try {
    const idDoctor = req.query.id;
    if (!idDoctor) {
      throw Object.assign(
        new Error('Ausência de valores (requerido: id)'),
        { code: 400 },
      );
    }
    const appointments = await listAppointments(idDoctor);
    res.send(appointments);
  } catch (error) {
    responseError(res, error);
  }
});

router.get('/list', authorize('admin'), async(req, res) => {
  try {
    const doctors = await listUsers();

    res.send(doctors);
  } catch (error) {
    responseError(res, error);
  }
});

router.post('/change', authorize('admin'), async(req, res) => {
  try {
    const id = req.body.id;
    const account = await changeAccount(id);
    res.send(account);
  } catch (error) {
    responseError(res, error);
  }
});

module.exports = router;
