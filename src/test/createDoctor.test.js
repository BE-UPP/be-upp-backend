const db = require('./db');
const { createNewDoctor } = require('../service/doctor');
const supertest = require('supertest');
const { app, server } = require('../server');

beforeAll(async () => await db.connect());

afterEach(async () => await db.clearDatabase());

afterAll(async () =>{
    await db.closeDatabase();
    // server.close();
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
            expect(t.senha).toEqual(senha);
            done();
        })
    })
    describe('Testing failed create', () => {
        it('failing to create the doctor, email error', async done => {
            await expect(await createNewDoctor(name, "", senha)).toThrowError();
            done();
        })
    })
})

// describe('Testing post template request', () => {
//     describe('Testing successful requests', () => {
//         it('create new template', async done => {
//             const resp = await supertest(app).post('/open-api/template/').send({
//                 pages: pages
//             });
//             expect(resp.statusCode).toEqual(200);
//             expect(resp.body.templateVersion).toEqual(0);
//             done()
//         })
//     })
//     describe('Testing fail requests', () => {
//         it('pages blank', async done => {
//             const resp = await supertest(app).post('/open-api/template/').send({
//                 pages: {}
//             });
//             expect(resp.statusCode).toEqual(400);
//             done()
//         })
//     })
// })