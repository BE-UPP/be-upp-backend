const mongoose = require('../infra/database');
const { PatientModel } = require('../data/models/patient');
const { DoctorModel } = require('../data/models/doctor');
const AppointmentModel = require('../data/models/appointment');

const clearDatabase = async() => {
  const collections = mongoose.connection.collections;
  try {
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  } catch (error) {
    console.log(error);
  }
};

clearDatabase();


const patients = [
  {
    name: 'Marcos Siolin',
    email: 'marcos@mail.com',
    cpf: '11122233344',
    cellphone: '11945457878',
    birth: 1005530400000,
    password: 'asdasdasd',
  },
  {
    name: 'Leão L',
    email: 'luciano@mail.com',
    cpf: '11122233355',
    cellphone: '11945457889',
    birth: 1005530400022,
    password: 'asdasdasdf',
  },
  {
    name: 'Eduardo F',
    email: 'eduardo@mail.com',
    cpf: '11122233366',
    cellphone: '11945458989',
    birth: 1005530400033,
    password: 'asdasdasde',
  }];

const doctors = [
  {
    name: 'Willian Hiroshi',
    email: 'hiroshi@mail.com',
    password: 'asdasdasd',
    phone: '1187877878',
    cellphone: '11987877878',
    profession: 'Cirurgião',
  },
  {
    name: 'Davi Hiroshi',
    email: 'davi@mail.com',
    password: 'asdasdasdef',
    phone: '1198989797',
    cellphone: '11987877878',
    profession: 'Cardiologista',
  }];

const appointments = [
  {
    date: 1638481066430,
    patient: 0,
    doctor: 1,
  },
  {
    date: 1638481066229,
    patient: 0,
    doctor: 1,
  },
  {
    date: 1638481066279,
    patient: 1,
    doctor: 0,
  },
];

const newPatients = [];
const newDoctors = [];

const populatePatients = async(patients) => {
  for (const patient of patients){
    const newPatient = await PatientModel.create(patient);
    newPatients.push(newPatient);
  }
};

const populateDoctors = async(doctors) => {
  for (const doctor of doctors){
    const newDoctor = await DoctorModel.create(doctor);
    newDoctors.push(newDoctor);
  }
};

const populateAppointments = async(appointments) => {
  for (const appointment of appointments){
    const ap = {
      date: appointment.date,
      patient: newPatients[appointment.patient]._id,
      doctor: newDoctors[appointment.doctor]._id,
    };
    await AppointmentModel.create(ap);
  }
};

const populate = async() => {
  await populatePatients(patients);
  await populateDoctors(doctors);
  await populateAppointments(appointments);
};

populate().then(console.log('Populated'));
