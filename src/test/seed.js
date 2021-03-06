const mongoose = require('../infra/database');
const AppointmentModel = require('../data/models/appointment');
const { createNewDoctor } = require('../service/doctor');
const { createNewPatient } = require('../service/patient');
const { addFinalReportTemplate,
  addFinalReportData } = require('../service/final-report');
const { clone } = require('../service/helper');

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
    password: '123456',
    phone: '1187877878',
    cellphone: '11987877878',
    profession: 'Cirurgião',
    role: 'user',
    status: false,
  },
  {
    name: 'Davi Hiroshi',
    email: 'davi@mail.com',
    password: '123456',
    phone: '1198989797',
    cellphone: '11987877878',
    profession: 'Cardiologista',
    role: 'admin',
    status: true,
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

const formData = {
  questions: [
    {
      id: 'nome',
      values: ['José da Silva'],
    },
    {
      id: 'sexo',
      values: ['Masculino'],
    } ],
  templateVersion: 1,
};

const FinalReportTemplate = {
  version: 1,
  pages: [
    {
      pageLabel: 'Dados Gerais',
      values: [
        'nome',
        'sexo',
        'idade',
      ],
      items: [
        {
          label: 'Nome:',
          type: 'text',
          content: [
            0,
          ],
        },
        {
          label: 'Sexo biológico:',
          type: 'text',
          content: [
            1,
          ],
        },
        {
          label: 'Idade:',
          type: 'text',
          content: [
            2,
            'anos',
          ],
        },
      ],
    },

  ],
};

const variables = {
  nome: 'José da Silva',
  sexo: 'Masculino',
  idade: 90,
};


const newPatients = [];
const newDoctors = [];
const newAppointments = [];

const populatePatients = async(patients) => {
  for (const patient of patients){
    const newPatient = await createNewPatient(patient.name, patient.email, patient.cpf,
      patient.cellphone, patient.birth, patient.password, patient.doctorId);
    newPatients.push(newPatient);
  }
};

const populateDoctors = async(doctors) => {
  for (const doctor of doctors){
    const newDoctor = await createNewDoctor(doctor.name, doctor.email, doctor.password,
      doctor.cellphone, doctor.phone, doctor.profession);
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
    const newAppointment = await AppointmentModel.create(ap);
    newAppointments.push(newAppointment);
  }
};

const populateFinalReport = async() => {

  let form = clone(formData);
  form.appointmentId = newAppointments[2] ._id;

  await addFinalReportTemplate(FinalReportTemplate);
  await addFinalReportData(form, variables);
};


const populate = async() => {
  await populatePatients(patients);
  await populateDoctors(doctors);
  await populateAppointments(appointments);
  await populateFinalReport();
};

populate().then(console.log('Populated'));
