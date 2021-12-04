const db = require('./db');
const { createNewPatient, getAllPatients } = require('../service/patient');
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

const name = 'Marcos Siolin';
const email = 'marcossiolin@mail.com';
const cpf = '11223344556';
const cellphone = '11945158787';
const birth = 1005530400000;
const password = 'senhasegura';

const name1 = 'Daniel Lawand';
const email1 = 'daniellawand@mail.com';
const cpf1 = '12345678900';
const cellphone1 = '11945158787';
const birth1 = 1005530400000;
const password1 = 'senhasegura';

describe('Testing patient service', () => {
  describe('Testing successfully creates', () => {
    it('creating the patient with password', async done => {
      const t = await createNewPatient(name, email, cpf, cellphone, birth, password);
      expect(t.name).toEqual(name);
      expect(t.email).toEqual(email);
      expect(t.cpf).toEqual(cpf);
      expect(t.cellphone).toEqual(cellphone);
      expect(t.birth).toEqual(birth);
      expect(t.password).toEqual(password);
      done();
    });
    it('creating the patient without password', async done => {
      const t = await createNewPatient(name, email, cpf, cellphone, birth, '');
      expect(t.name).toEqual(name);
      expect(t.email).toEqual(email);
      expect(t.cpf).toEqual(cpf);
      expect(t.cellphone).toEqual(cellphone);
      expect(t.birth).toEqual(birth);
      expect(t.password).toEqual('');
      done();
    });
  });
  describe('Testing failed create', () => {
    it('failing to create the patient, name missing', async(done) => {
      expect.assertions(1);
      try {
        await createNewPatient('', email, cpf, cellphone, birth, '');
      } catch (error){
        expect(error.code).toEqual(400);
      }
      done();
    });
    it('failing to create the patient, email missing', async(done) => {
      expect.assertions(1);
      try {
        await createNewPatient(name, '', cpf, cellphone, birth, '');
      } catch (error){
        expect(error.code).toEqual(400);
      }
      done();
    });
    it('failing to create the patient, cpf error', async(done) => {
      expect.assertions(1);
      try {
        await createNewPatient(name, email, '1111111111', cellphone, birth, '');
      } catch (error){
        expect(error.code).toEqual(400);
      }
      done();
    });
    it('failing to create the patient, cellphone missing', async(done) => {
      expect.assertions(1);
      try {
        await createNewPatient(name, email, cpf, '', birth, '');
      } catch (error){
        expect(error.code).toEqual(400);
      }
      done();
    });
    it('failing to create the patient, birth missing', async(done) => {
      expect.assertions(1);
      try {
        await createNewPatient(name, email, cpf, cellphone, '', '');
      } catch (error){
        expect(error.code).toEqual(400);
      }
      done();
    });
  });
});

describe('Testing post patient request', () => {
  describe('Testing successful requests', () => {
    it('create new patient', async done => {
      const resp = await supertest(app).post('/close-api/patient/new').send({
        name: name,
        email: email,
        cpf: cpf,
        cellphone: cellphone,
        birth: birth,
        password: password,
      });
      expect(resp.statusCode).toEqual(200);
      expect(resp.body.name).toEqual(name);
      done();
    });
  });
  describe('Testing fail requests', () => {
    it('blank name', async done => {
      const resp = await supertest(app).post('/open-api/patient/new').send({
        email: email,
        cpf: cpf,
        cellphone: cellphone,
        birth: birth,
        password: password,
      });
      expect(resp.statusCode).toEqual(400);
      done();
    });
  });
});

describe('Testing get all patients services', () => {
  it('getting two patients', async done => {
    await createNewPatient(name, email, cpf, cellphone, birth, password);
    await createNewPatient(name1, email1, cpf1, cellphone1, birth1, password1);
    const patients = await getAllPatients();
    expect(patients.length).toEqual(2);
    expect(patients[0]._id).not.toEqual(patients[1]._id);
    done();
  });
  it('getting no patients', async done => {
    const patients = await getAllPatients();
    expect(patients.length).toEqual(0);
    done();
  });
  it('testing if passwords are not retrieved', async done => {
    await createNewPatient(name, email, cpf, cellphone, birth, password);
    await createNewPatient(name1, email1, cpf1, cellphone1, birth1, password1);
    const patients = await getAllPatients();
    expect(patients[0].hasOwnProperty('password')).toEqual(false);
    expect(patients[1].hasOwnProperty('password')).toEqual(false);
    done();
  });
});

describe('Testing get all patients api', () => {
  describe('Testing successful requests', () => {
    it('getting two patients', async done => {
      await createNewPatient(name, email, cpf, cellphone, birth, password);
      await createNewPatient(name1, email1, cpf1, cellphone1, birth1, password1);
      const resp = await supertest(app).get('/close-api/patient/all');
      const patients = resp.body;
      expect(resp.statusCode).toEqual(200);
      expect(patients.length).toEqual(2);
      expect(patients[0]._id).not.toEqual(patients[1]._id);
      done();
    });
    it('getting no patients', async done => {
      const resp = await supertest(app).get('/close-api/patient/all');
      const patients = resp.body;
      expect(resp.statusCode).toEqual(200);
      expect(patients.length).toEqual(0);
      done();
    });
  });
});
