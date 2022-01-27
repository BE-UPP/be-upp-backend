const { DoctorModel, generateHash } = require('../data/models/doctor');

DoctorModel.find({}).exec(function(err, doctors) {
  for (let i = 0; i < doctors.length; i++){
    doctors[i].password = generateHash(doctors[i].password);
    doctors[i].save();
    console.log(doctors[i].password);
  }
  console.log(err);
});
