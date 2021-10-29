const express = require('express');
const router = express.Router();
const {
    createNewPatient,
} = require('../../service/appointment');

router.post('/', async (req, res) => {

    try {
        const name = req.body.name;
        const email = req.body.email;
        const cpf = req.body.cpf;
        const cellphone = req.body.cellphone;
        const birth = req.body.birth;
        const password = req.body.password;
        const patient = await createNewPatient(name, email, cpf, cellphone, birth, password);
        res.send(patient);
    } catch (error){
        console.log(error)
        // TODO error
        res.status(error.code).send(error.message);
    }
});

module.exports = router;