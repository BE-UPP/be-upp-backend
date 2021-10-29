const { DoctorModel } = require('../data/models/doctor');

const getDoctorById = async (id) => {
    try {
        const dado = await DoctorModel.findById(id).exec();
        return dado;
    } catch (error) {
        throw {
            message: error.message,
            code: 400
        }
    }
}

const createNewDoctor = async (name, email, password) => {
    try {
        const doctor = {
            name: name,
            email: email,
            password: password
        }
        const dado = await DoctorModel.create(doctor);
        return dado;
    } catch (error) {
        throw {
            message: error.message,
            code: 400
        }
    }
}

module.exports = {
    getDoctorById: getDoctorById,
    createNewDoctor: createNewDoctor
}