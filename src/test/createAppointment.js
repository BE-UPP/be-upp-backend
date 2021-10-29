const db = require('./db');
const { createNewAppointment } = require('../service/appointment');
const { createNewAppointment } = require('../service/appointment');
const { createNewAppointment } = require('../service/appointment');
const supertest = require('supertest');
const { app, server } = require('../server');

beforeAll(async () => await db.connect());

afterEach(async () => await db.clearDatabase());

afterAll(async () =>{
    await db.closeDatabase();
    server.close();
});

const date = Date.parse('11/12/2002');
const ;


describe('Testing setTemplate service', () => {
    describe('Testing successfully creates', () => {
        it('creating the first template', async done => {
            const t = await setTemplate(pages)
            expect(t.templateVersion).toEqual(0)
            done()
        })
        it('creating a second template', async done => {
            const t = await setTemplate(pages)
            const t2 = await setTemplate(pages)
            expect(t2.templateVersion).toEqual(t.templateVersion + 1)
            done()
        })
    })
})

describe('Testing post template request', () => {
    describe('Testing successful requests', () => {
        it('create new template', async done => {
            const resp = await supertest(app).post('/open-api/template/').send({
                pages: pages
            });
            expect(resp.statusCode).toEqual(200);
            expect(resp.body.templateVersion).toEqual(0);
            done()
        })
    })
    describe('Testing fail requests', () => {
        it('pages blank', async done => {
            const resp = await supertest(app).post('/open-api/template/').send({
                pages: {}
            });
            expect(resp.statusCode).toEqual(400);
            done()
        })
    })
})