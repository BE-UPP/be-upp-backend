const db = require('./db');
const { getPatientById, createNewPatient } = require('../service/patient');
const supertest = require('supertest');
const { app, openServer, closeServer } = require('../server');

beforeAll(async () => {
    await db.connect();
    openServer();
});

afterEach(async () => {
    await db.clearDatabase();
});

afterAll(async () => {
    await db.closeDatabase();
    closeServer();
});

const name = "Marcos Siolin";
const email = "marcossiolin@mail.com";
const cpf = "11223344556";
const cellphone = "11945158787";
const birth = 1005530400000;
const password = "senhasegura";

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
        })
        it('creating the patient without password', async done => {
            const t = await createNewPatient(name, email, cpf, cellphone, birth, "");
            expect(t.name).toEqual(name);
            expect(t.email).toEqual(email);
            expect(t.cpf).toEqual(cpf);
            expect(t.cellphone).toEqual(cellphone);
            expect(t.birth).toEqual(birth);
            expect(t.password).toEqual("");
            done();
        })
    })
    describe('Testing failed create', () => {
        it('failing to create the patient, name missing', async (done) => {
            expect.assertions(1);
            try{
                await createNewPatient("", email, cpf, cellphone, birth, "");
            }
            catch (error){
                expect(error.code).toEqual(400);
            }
            done()
        })
        it('failing to create the patient, email missing', async (done) => {
            expect.assertions(1);
            try{
                await createNewPatient(name, "", cpf, cellphone, birth, "");
            }
            catch (error){
                expect(error.code).toEqual(400);
            }
            done()
        })
        it('failing to create the patient, cpf error', async (done) => {
            expect.assertions(1);
            try{
                await createNewPatient(name, email, "1111111111", cellphone, birth, "");
            }
            catch (error){
                expect(error.code).toEqual(400);
            }
            done()
        })
        it('failing to create the patient, cellphone missing', async (done) => {
            expect.assertions(1);
            try{
                await createNewPatient(name, email, cpf, "", birth, "");
            }
            catch (error){
                expect(error.code).toEqual(400);
            }
            done()
        })
        it('failing to create the patient, birth missing', async (done) => {
            expect.assertions(1);
            try{
                await createNewPatient(name, email, cpf, cellphone, "", "");
            }
            catch (error){
                expect(error.code).toEqual(400);
            }
            done()
        })
    })
})

describe('Testing post patient request', () => {
    describe('Testing successful requests', () => {
        it('create new patient', async done => {
            const resp = await supertest(app).post('/open-api/patient/').send({
                name: name,
                email: email,
                cpf: cpf,
                cellphone: cellphone,
                birth: birth,
                password: password
            });
            expect(resp.statusCode).toEqual(200);
            expect(resp.body.name).toEqual(name);
            done()
        })
    })
    describe('Testing fail requests', () => {
        it('blank name', async done => {
            const resp = await supertest(app).post('/open-api/patient/').send({
                email: email,
                cpf: cpf,
                cellphone: cellphone,
                birth: birth,
                password: password
            });
            expect(resp.statusCode).toEqual(400);
            done()
        })
    })
})