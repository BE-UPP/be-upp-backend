const db = require('./db');
const { setTemplate } = require('../service/template');
const Template = require('../data/models/template');
const supertest = require('supertest');
const { app, server } = require('../server');

beforeAll(async () => await db.connect());

afterEach(async () => await db.clearDatabase());

afterAll(async () =>{
    await db.closeDatabase();
    server.close();
});

const pages = [
    {
        pageLabel: "A page label",
        questions: {
            name: {
                questionLabel: "Nome Incompleto",
                placeholder: "Ex: José Fernando da Silva",
                type: "text"
            },
            telephone: {
                questionLabel: "Número de Celular (DDD + Telefone)",
                placeholder: "Ex: 119XXXXXXXX",
                type: "text"
            }
        }
    },
    {
        pageLabel: "another page label",
        questions: {
            name2: {
                questionLabel: "Nome Incompleto",
                placeholder: "Ex: José Fernando da Silva",
                type: "text"
            },
            telephone2: {
                questionLabel: "Número de Celular (DDD + Telefone)",
                placeholder: "Ex: 119XXXXXXXX",
                type: "text"
            }
        }
    }
]

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