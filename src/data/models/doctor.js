const mongoose = require('../../infra/database');

const DoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name required']
    },

    email: {
        type: String,
        required: [true, 'email required'],
        unique: true
    },

    password: {
        type: String,
        required: [true, 'password required']
    }
});

const DoctorModel = mongoose.model('DoctorSchema', DoctorSchema);

module.exports = DoctorModel;