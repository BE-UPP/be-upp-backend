const express = require('express');
const router = express.Router();
const {
  listAppointments,
} = require('../../service/doctor');
const { verifyToken } = require('../../service/authentication');
const { responseError } = require('../../service/helper');

<<<<<<< 6b6542dc616c2031bffebba1a23bd36a192d33cc
router.get('/appointments', verifyToken, async(req, res) => {

=======
router.get('/appointments', verifyToken, async (req, res) => {
>>>>>>> Corrigido rotas para modelo de rotas livres e restritas
  try {
    const idDoctor = req.query.id;
    if (!idDoctor)
      throw { code: 400, message: "Ausência de valores (requerido: id" };
    const appointments = await listAppointments(idDoctor);
    res.send(appointments);
  } catch (error) {
    responseError(res, error);
  }
});

module.exports = router;
