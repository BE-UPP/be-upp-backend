const db = require('./db');
const { addFormData } = require('../service/form-data');
const { createNewPatient } = require('../service/patient');
const { createNewDoctor } = require('../service/doctor');
const { createNewAppointment } = require('../service/appointment');
const { app, openServer, closeServer } = require('../server');
const supertest = require('supertest');
const mongoose = require('mongoose');

beforeAll(async() => {
  await db.connect();
  openServer();
});

afterEach(async() => {
  await db.clearDatabase();
});

afterAll(async() => {
  await db.closeDatabase();
  closeServer();
});

const answers = {
  questions: [
    {
      id: 'name',
      value: 'Ex: José Fernando da Silva',
    },
    {
      id: 'telephone',
      value: '12341234',
    },
    {
      id: 'email',
      value: 'willian@hiroshi.com.br.mogi',
    },
    {
      id: 'birthday',
      value: '30/05/1999',
    },
    {
      id: 'city',
      value: 'Mogi',
    }],
  templateVersion: 1,
};

const p = {
  name: 'Marcos Siolin',
  email: 'marcossiolin@mail.com',
  cpf: '11223344556',
  cellphone: '11945158787',
  birth: 1005530400000,
  password: 'senhasegura',
};

const d = {
  name: 'Doutor',
  email: 'doutor@medi.co',
  password: 'medicina123',
};

describe('Testing addFormData service', () => {
  describe('Testing successfully creates', () => {
    it('create new form-data', async(done) => {
      const pat = await createNewPatient(p.name, p.email, p.cpf, p.cellphone,
        p.birth, p.password);
      const doc = await createNewDoctor(d.name, d.email, d.password);
      const date = Date.now();
      const t = await createNewAppointment(date, pat._id, doc._id);
      answers.appointmentId = t._id;
      const t2 = await addFormData(answers);
      expect(t2.templateVersion).toEqual(1);
      done();
    });
  });
  describe('Testing failed creates', () => {
    it('wrong appointmentId', async(done) => {
      expect.assertions(1);
      answers.appointmentId = mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
      try {
        const t2 = await addFormData(answers);
        expect(t2.templateVersion).toEqual(1);
      } catch (error){
        expect(error.code).toEqual(400);
      }
      done();
    });
  });
});

describe('Testing post form-data request', () => {
  describe('Testing successful requests', () => {
    it('create new form-data', async done => {
      const pat = await createNewPatient(p.name, p.email, p.cpf, p.cellphone,
        p.birth, p.password);
      const doc = await createNewDoctor(d.name, d.email, d.password);
      const date = Date.now();
      const t = await createNewAppointment(date, pat._id, doc._id);
      answers.appointmentId = t._id;
      const resp = await supertest(app).post('/open-api/form-data/')
        .send(answers);
      const ans = resp.body;
      expect(resp.statusCode).toEqual(200);
      expect(ans.templateVersion).toEqual(answers.templateVersion);
      done();
    });
  });
  describe('Testing fail requests', () => {
    it('failing to create form-data', async done => {
      answers.appointmentId = mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
      const resp = await supertest(app).post('/open-api/form-data/')
        .send(answers);
      expect(resp.statusCode).toEqual(400);
      done();
    });
  });
});
