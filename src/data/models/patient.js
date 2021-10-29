const mongoose = require('../../infra/database')

const PatientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name required']
    },

    email: {
        type: String,
        required: [true, 'email required'],
        unique: true
    },

    cpf: {
        type: String,
        required: [true, 'cpf required'],
        unique: true
    },

    cellphone: {
        type: String,
        required: [true, 'cellphone required']
    },

    birth: {
        type: Number,
        required: [true, 'birth required']
    },

    password: {
        type: String,
    }
});

const PatientModel = mongoose.model('PatientSchema', PatientSchema);

module.exports = {
    PatientModel: PatientModel,
    PatientSchema: PatientSchema
}