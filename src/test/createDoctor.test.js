const db = require('./db');
const { createNewDoctor } = require('../service/doctor');
const supertest = require('supertest');
const { app, openServer, closeServer } = require('../server');

beforeAll(async () => {
    await db.connect();
    openServer();
});

afterEach(async () => {
    await db.clearDatabase();
});

afterAll(async () =>{
    await db.closeDatabase();
    closeServer();
});

const name = "Doutor";
const email = "doutor@medi.co";
const senha = "medicina123";

describe('Testing doctor service', () => {
    describe('Testing successfully creates', () => {
        it('creating the doctor', async done => {
            const t = await createNewDoctor(name, email, senha);
            expect(t.name).toEqual(name);
            expect(t.email).toEqual(email);
            expect(t.password).toEqual(senha);
            done();
        })
    })
    describe('Testing failed create', () => {
        it('failing to create the doctor, email error', async (done) => {
            expect.assertions(1);
            try{
                await createNewDoctor(name, "", senha);
            }
            catch (error){
                expect(error.code).toEqual(400);
            }
            done()
        })
        it('failing to create the doctor, name error', async (done) => {
            expect.assertions(1);
            try{
                await createNewDoctor("", email, senha)
            }
            catch (error){
                expect(error.code).toEqual(400)
            }
            done()
        })
    })
})