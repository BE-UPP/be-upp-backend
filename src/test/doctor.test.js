const db = require('./db');
const { createNewDoctor, validateDoctorLogin } = require('../service/doctor');
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

const name = 'Doutor';
const email = 'doutor@medi.co';
const password = 'medicina123';
const cellphone = '11945150909';
const phone = '1135150909';
const profession = '22359';

describe('Testing doctor service', () => {
  describe('Testing successfully creates', () => {
    it('creating the doctor', async done => {
      const t = await createNewDoctor(name, email, password, cellphone,
        phone, profession);
      expect(t.name).toEqual(name);
      expect(t.email).toEqual(email);
      expect(t.password).toEqual(password);
      expect(t.cellphone).toEqual(cellphone);
      expect(t.phone).toEqual(phone);
      expect(t.profession).toEqual(profession);
      done();
    });
    it('creating the doctor without phone', async done => {
      const t = await createNewDoctor(name, email, password, cellphone,
        '', profession);
      expect(t.name).toEqual(name);
      expect(t.email).toEqual(email);
      expect(t.password).toEqual(password);
      expect(t.cellphone).toEqual(cellphone);
      expect(t.phone).toEqual('');
      expect(t.profession).toEqual(profession);
      done();
    });
  });
  describe('Testing failed create', () => {
    it('failing to create the doctor, email error', async(done) => {
      expect.assertions(1);
      try {
        await createNewDoctor(name, '', password, cellphone, phone, profession);
      } catch (error){
        expect(error.code).toEqual(400);
      }
      done();
    });
    it('failing to create the doctor, name error', async(done) => {
      expect.assertions(1);
      try {
        await createNewDoctor('', email, password, cellphone, phone, profession);
      } catch (error){
        expect(error.code).toEqual(400);
      }
      done();
    });
    it('failing to create the doctor, no password error', async(done) => {
      expect.assertions(1);
      try {
        await createNewDoctor(name, email, '', cellphone, phone, profession);
      } catch (error){
        expect(error.code).toEqual(400);
      }
      done();
    });
    it('failing to create the doctor, short password error', async(done) => {
      expect.assertions(1);
      try {
        await createNewDoctor(name, email, 'asdas', cellphone, phone, profession);
      } catch (error){
        expect(error.code).toEqual(400);
      }
      done();
    });
  });
  describe('Testing login authentication', () => {
    it('successfull login', async(done) => {
      const t = await createNewDoctor(name, email, password, cellphone,
        phone, profession);
      const d = await validateDoctorLogin(t.email, t.password);
      expect(d.doctor._id).toEqual(t._id);
      done();
    });
    it('login error email inexistent', async(done) => {
      const t = await createNewDoctor(name, email, password, cellphone,
        phone, profession);
      try {
        await validateDoctorLogin('asd@asd.com', t.password);
      } catch (error){
        expect(error.code).toEqual(400);
      }
      done();
    });
    it('login password error', async(done) => {
      const t = await createNewDoctor(name, email, password, cellphone,
        phone, profession);
      try {
        await validateDoctorLogin(t.email, 'wrong password');
      } catch (error){
        expect(error.code).toEqual(400);
      }
      done();
    });
  });
});

describe('Testing post doctor request', () => {
  describe('Testing successful requests', () => {
    it('create new doctor', async done => {
      const resp = await supertest(app).post('/open-api/doctor/new').send({
        name: name,
        email: email,
        password: password,
        cellphone: cellphone,
        phone: phone,
        profession: profession,
      });
      const doc = resp.body;
      expect(resp.statusCode).toEqual(200);
      expect(doc.name).toEqual(name);
      done();
    });
  });
  describe('Testing fail requests', () => {
    it('blank fields', async done => {
      const resp = await supertest(app).post('/open-api/doctor/new').send({
        email: email,
        password: password,
      });
      expect(resp.statusCode).toEqual(400);
      done();
    });
  });
});

describe('Testing login doctor request', () => {
  describe('Testing successful requests', () => {
    it('successful login', async done => {
      await createNewDoctor(name, email, password, cellphone, phone, profession);
      const resp = await supertest(app).post('/open-api/doctor/login').send({
        emailLogin: email,
        passwordLogin: password,
      });
      const doc = resp.body.doctor;
      expect(resp.statusCode).toEqual(200);
      expect(doc.name).toEqual(name);
      done();
    });
  });
  describe('Testing fail requests', () => {
    it('fail login', async done => {
      await createNewDoctor(name, email, password, cellphone, phone, profession);
      const resp = await supertest(app).post('/open-api/doctor/login').send({
        email: 'asd@asd.com',
        password: password,
      });
      expect(resp.statusCode).toEqual(400);
      done();
    });
  });
});
