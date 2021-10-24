const Model = require('../data/models/doctor');

const getDoctorById = async (id) => {
    try{
        const dado = await Model.findById(id).exec();
        return dado;
    } catch (error) {
        throw {
            message: error.message,
            code: 400
        }
    }
}

module.exports = {
    getDoctorById: getDoctorById
}