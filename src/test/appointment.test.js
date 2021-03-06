const db = require('./db');
const {
  createNewAppointment,
  getAppointmentById,
} = require('../service/appointment');
const { createNewPatient } = require('../service/patient');
const { createNewDoctor, validateDoctorLogin } = require('../service/doctor');
const supertest = require('supertest');
const { app,
  openServer, closeServer } = require('../server');
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
      expect(t.patient).toEqual(pat._id);
      expect(t.doctor).toEqual(doc._id);
      done();
    });
    it('creating two appointments with same doctor and patient', async done => {
      const pat = await createNewPatient(p.name, p.email, p.cpf, p.cellphone,
        p.birth, p.password);
      const doc = await createNewDoctor(d.name, d.email, d.password, d.cellphone,
        d.phone, d.rcn);
      const date = Date.now();
      const t = await createNewAppointment(date, pat._id, doc._id);
      const t1 = await createNewAppointment(date + 3, pat._id, doc._id);
      expect(t.date).toEqual(date);
      expect(t.patient).toEqual(pat._id);
      expect(t.doctor).toEqual(doc._id);
      expect(t1.date).toEqual(date + 3);
      expect(t1.patient).toEqual(pat._id);
      expect(t1.doctor).toEqual(doc._id);
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
        await createNewAppointment(date, mongoose.Types.ObjectId(11234), doc._id);
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
      const login = await validateDoctorLogin(d.email, d.password);
      const resp = await supertest(app).post('/close-api/appointment/new').set(
        'x-access-token', login.token).send({
        date: Date.now(),
        patientId: pat._id,
        doctorId: doc._id,
      });
      const apId = resp.body;
      const ap = await getAppointmentById(apId);
      expect(resp.statusCode).toEqual(200);
      expect(ap.patient).toEqual(pat._id);
      done();
    });
    it('get appointment', async done => {
      const pat = await createNewPatient(p.name, p.email, p.cpf, p.cellphone,
        p.birth, p.password);
      const doc = await createNewDoctor(d.name, d.email, d.password, d.cellphone,
        d.phone, d.rcn);
      const login = await validateDoctorLogin(d.email, d.password);
      const resp = await supertest(app).post('/close-api/appointment/new').set(
        'x-access-token', login.token).send({
        date: Date.now(),
        patientId: pat._id,
        doctorId: doc._id,
      });
      const apId = resp.body;
      const resp2 = await supertest(app).get(`/close-api/appointment/by-id/${apId}`).set(
        'x-access-token', login.token);
      const ap = resp2.body;
      expect(resp.statusCode).toEqual(200);
      expect(ap.patient).toEqual(pat._id.toString());
      done();
    });
  });
  describe('Testing fail requests', () => {
    it('failing to create appointment', async done => {
      const doc = await createNewDoctor(d.name, d.email, d.password, d.cellphone,
        d.phone, d.rcn);
      const login = await validateDoctorLogin(d.email, d.password);
      const resp = await supertest(app).post('/close-api/appointment/new').set(
        'x-access-token', login.token).send({
        date: Date.now(),
        patientId: 1234,
        doctorId: doc._id,
      });
      expect(resp.statusCode).toEqual(400);
      done();
    });
  });
});
