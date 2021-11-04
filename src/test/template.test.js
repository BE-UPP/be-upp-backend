const db = require('./db');
const {
    getLatestTemplate,
    setTemplate,
    getTemplateById
} = require('../service/template');
const supertest = require('supertest');
const { app, openServer, closeServer } = require('../server');
const { ObjectId } = require('mongodb');

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

describe('Testing getTemplateById service', () => {
    it('Testing successfuly retrieving a template', async done => {
        const t = await setTemplate(pages)
        const t2 = await getTemplateById(t._id)
        expect(t2._id).toEqual(t._id)
        done()
    })
    it('Testing unsuccessfuly retrieving a template', async done => {
        expect.assertions(1)
        try{
            await getTemplateById(3)
        }
        catch(e){
            expect(e.code).toEqual(500)
        }
        done()
    })
})

describe('Testing getLatestTemplate service', () => {
    it('Testing retrieving the last template', async done => {
        const t = await setTemplate(pages)
        const t2 = await setTemplate(pages)
        const r = await getLatestTemplate()
        expect(r._id).toEqual(t2._id)
        done()
    })
    it('Failing to retrieve template due to non existence', async done => {
        const r = await getLatestTemplate()
        expect(r).toBeNull()
        done()
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

describe('Testing get template by id request', () => {
    describe('Testing successful requests', () => {
        it('template by id', async done => {
            const t = await setTemplate(pages)
            const resp = await supertest(app).get(`/open-api/template/by-id/${t._id}`);
            const t2 = resp.body
            const id = ObjectId(t2._id)
            expect(id).toEqual(t._id)
            done()
        })

        it('latest template', async done => {
            const t = await setTemplate(pages)
            const resp = await supertest(app).get(`/open-api/template/latest`);
            const t2 = resp.body
            const id = ObjectId(t2._id)
            expect(id).toEqual(t._id)
            done()
        })
    })

    describe('Testing fail requests', () => {
        it('template by id', async done => {
            const t = await setTemplate(pages)
            const resp = await supertest(app).get(`/open-api/template/by-id/-1`);
            expect(resp.statusCode).toEqual(500)
            done()
        })
        it('latest template', async done => {
            const resp = await supertest(app).get(`/open-api/template/latest`);
            const t2 = resp.body
            expect(t2).toEqual({})
            done()
        })
    })
})