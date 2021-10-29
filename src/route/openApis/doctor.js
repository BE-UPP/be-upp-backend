const express = require('express');
const router = express.Router();
const {
    createNewDoctor,
} = require('../../service/doctor');

router.post('/', async (req, res) => {

    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const doctor = await createNewDoctor(name, email, password);
        res.send(doctor);
    } catch (error){
        console.log(error)
        // TODO error
        res.status(error.code).send(error.message);
    }
});

module.exports = router;