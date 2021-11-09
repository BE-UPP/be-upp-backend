const db = require('./db');
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

const name = 'Doutor';
const email = 'doutor@medi.co';
const password = 'medicina123';

describe('Testing doctor service', () => {
  describe('Testing successfully creates', () => {
    it('creating the doctor', async done => {
      const t = await createNewDoctor(name, email, password);
      expect(t.name).toEqual(name);
      expect(t.email).toEqual(email);
      expect(t.password).toEqual(password);
      done();
    });
  });
  describe('Testing failed create', () => {
    it('failing to create the doctor, email error', async(done) => {
      expect.assertions(1);
      try {
        await createNewDoctor(name, '', password);
      } catch (error){
        expect(error.code).toEqual(400);
      }
      done();
    });
    it('failing to create the doctor, name error', async(done) => {
      expect.assertions(1);
      try {
        await createNewDoctor('', email, password);
      } catch (error){
        expect(error.code).toEqual(400);
      }
      done();
    });
    it('failing to create the doctor, no password error', async(done) => {
      expect.assertions(1);
      try {
        await createNewDoctor(name, email, '');
      } catch (error){
        expect(error.code).toEqual(400);
      }
      done();
    });
    it('failing to create the doctor, short password error', async(done) => {
      expect.assertions(1);
      try {
        await createNewDoctor(name, email, 'asdas');
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
      const resp = await supertest(app).post('/open-api/doctor/').send({
        name: name,
        email: email,
        password: password,
      });
      expect(resp.statusCode).toEqual(200);
      expect(resp.body.name).toEqual(name);
      done();
    });
  });
  describe('Testing fail requests', () => {
    it('blank name', async done => {
      const resp = await supertest(app).post('/open-api/doctor/').send({
        email: email,
        password: password,
      });
      expect(resp.statusCode).toEqual(400);
      done();
    });
  });
});
