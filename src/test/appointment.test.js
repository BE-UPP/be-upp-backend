const db = require('./db');
const {
  createNewAppointment,
  getAppointmentById,
} = require('../service/appointment');
const { createNewPatient } = require('../service/patient');
const { createNewDoctor } = require('../service/doctor');
const supertest = require('supertest');
const { app, openServer, closeServer } = require('../server');

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
  cellphone: '11945150909',
  phone: '1135150909',
  rcn: '22359',
};

describe('Testing appointment service', () => {
  describe('Testing successfully creates', () => {
    it('creating the appointment', async done => {
      const pat = await createNewPatient(p.name, p.email, p.cpf, p.cellphone,
        p.birth, p.password);
      const doc = await createNewDoctor(d.name, d.email, d.password, d.cellphone,
        d.phone, d.rcn);
      const date = Date.now();
      const t = await createNewAppointment(date, pat._id, doc._id);
      expect(t.date).toEqual(date);
      expect(t.patient.name).toEqual(p.name);
      expect(t.doctor.name).toEqual(d.name);
      done();
    });
  });
  describe('Testing failed creates', () => {
    it('failed to create the appointment', async done => {
      expect.assertions(1);
      const doc = await createNewDoctor(d.name, d.email, d.password, d.cellphone,
        d.phone, d.rcn);
      const date = Date.now();
      try {
        await createNewAppointment(date, 11234, doc._id);
      } catch (error){
        expect(error.code).toEqual(400);
      }
      done();
    });
  });
});

describe('Testing post appointment request', () => {
  describe('Testing successful requests', () => {
    it('create new appointment', async done => {
      const pat = await createNewPatient(p.name, p.email, p.cpf, p.cellphone,
        p.birth, p.password);
      const doc = await createNewDoctor(d.name, d.email, d.password, d.cellphone,
        d.phone, d.rcn);
      const resp = await supertest(app).post('/open-api/appointment/').send({
        date: Date.now(),
        patientId: pat._id,
        doctorId: doc._id,
      });
      const apId = resp.body;
      const ap = await getAppointmentById(apId);
      expect(resp.statusCode).toEqual(200);
      expect(ap.patient.name).toEqual(pat.name);
      done();
    });
  });
  describe('Testing fail requests', () => {
    it('failing to create appointment', async done => {
      const doc = await createNewDoctor(d.name, d.email, d.password, d.cellphone,
        d.phone, d.rcn);
      const resp = await supertest(app).post('/open-api/appointment/').send({
        date: Date.now(),
        patientId: 1234,
        doctorId: doc._id,
      });
      expect(resp.statusCode).toEqual(400);
      done();
    });
  });
});
