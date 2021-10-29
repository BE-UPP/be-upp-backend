const { PatientModel } = require('../data/models/patient');

const getPatientById = async (id) => {
    try {
        const dado = await PatientModel.findById(id).exec();
        return dado;
    } catch (error) {
        throw {
            message: error.message,
            code: 400
        }
    }
}

const createNewPatient = async (name, email, cpf, cellphone, birth, password) => {
    try {
        const patient = {
            name: name,
            email: email,
            cpf: cpf,
            cellphone: cellphone,
            birth: birth,
            password: password
        }
        const dado = await PatientModel.create(patient);
        return dado;
    } catch (error) {
        throw {
            message: error.message,
            code: 400
        }
    }
}

module.exports = {
    getPatientById: getPatientById,
    createNewPatient: createNewPatient,
}