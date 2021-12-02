const db = require('./db');
const supertest = require('supertest');
// const { ObjectId } = require('mongodb');
const { app, openServer, closeServer } = require('../server');
const { processData, addProcessData,
  getProcessData } = require('../service/data-processing');

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

const formData = {
  templateVersion: 0,
  text: {
    type: 'text',
    variables: ['text'],
    values: ['josé'],
  },
  select: {
    type: 'select',
    variables: ['selectId', 'select'],
    values: [2, 'Feminino'],
  },
  scale: {
    type: 'scale',
    variables: ['scale'],
    values: [4],
  },
  radio: {
    type: 'radio',
    variables: ['radioId', 'radio'],
    values: [
      1, 'Não',
    ],
  },
  table: {
    type: 'table',
    variables: ['tableId1', 'table1', 'tableId2', 'table2', 'tableId3', 'table3'],
    values: [0, '1', 1, '3', 2, '2'],
  },
  checkbox: {
    type: 'checkbox',
    variables: ['checkbox'],
    values: [{
      3: 'Melhora de humor',
      9: 'Melhorar a saúde mental',
      10: 'Emagrecimento',
    }],
  },
};

const dataProcessing = {
  version: 0,
  operations: [
    {
      type: 'Math',
      input: ['scale', 'selectId', 'radioId'],
      output: ['math1'],
      body: 'scale * selectId + radioId',
    },
    {
      type: 'Table',
      input: [{ label: 'tableId1', type: 'number' }],
      output: ['tableProcessing1'],
      body: {
        '==1': 'Sim',
        __: 'Não',
      },
    },
  ],
};

const output = {
  text: 'josé',
  selectId: 2,
  select: 'Feminino',
  scale: 4,
  radioId: 1,
  radio: 'Não',
  tableId1: 0,
  table1: '1',
  tableId2: 1,
  table2: '3',
  tableId3: 2,
  table3: '2',
  checkbox: {
    3: 'Melhora de humor',
    9: 'Melhorar a saúde mental',
    10: 'Emagrecimento',
  },
  math1: 9,
  tableProcessing1: 'Não',
};


describe('Testing data-processing services', () => {
  it('Adding Process data', async done => {

    await addProcessData(dataProcessing);

    done();
  });
  it('Get process data', async done => {

    await addProcessData(dataProcessing);
    let t = await getProcessData(dataProcessing.version);
    let u = JSON.parse(JSON.stringify(t));

    delete u['_id'];
    delete u['__v'];
    for (let i = 0; i < u.operations.length; i++)
      delete u.operations[i]['_id'];

    expect(u).toEqual(dataProcessing);

    done();
  });
  it('Processing data 1', async done => {

    await addProcessData(dataProcessing);
    const t = await processData(formData);
    let u = JSON.parse(JSON.stringify(t));

    delete u['_id'];
    delete u['__v'];

    expect(u).toEqual(output);

    done();
  });

  describe('Testing invalid process', () => {
    it('Processing data 2', async done => {
      expect.assertions(1);

      try {
        let invalidProcessing = JSON.parse(JSON.stringify(dataProcessing));
        invalidProcessing.operations[0] = {body: 'scale * selectId + radioId' };

        await addProcessData(invalidProcessing);
        await processData(formData);
      } catch (error) {
        expect(error.code).toEqual(400);
      }

      done();
    });
    it('Processing data 3', async done => {
      expect.assertions(1);

      try {
        let invalidProcessing = JSON.parse(JSON.stringify(dataProcessing));
        invalidProcessing.operations[0].input = [];

        await addProcessData(invalidProcessing);
        await processData(formData);
      } catch (error) {
        expect(error.code).toEqual(400);
      }

      done();
    });
  });
});


describe('Testing post dataProcessing request', () => {

  describe('Testing successful requests', () => {
    it('create new dataProcessing', async done => {
      const resp = await supertest(app).post('/open-api/data-processing/')
        .send(dataProcessing);
      expect(resp.statusCode).toEqual(200);
      expect(resp.body.version).toEqual(dataProcessing.version);
      done();
    });
  });

  describe('Testing fail requests', () => {
    it('null data-processing', async done => {
      const resp = await supertest(app).post('/open-api/data-processing/').send({});
      expect(resp.statusCode).toEqual(400);
      done();
    });
  });

  describe('Testing successful requests', () => {
    it('get dataProcessing by version', async done => {
      const resp1 = await supertest(app).post('/open-api/data-processing/')
        .send(dataProcessing);
      const resp2 = await supertest(app).get('/open-api/data-processing/by-version/0');
      expect(resp2.statusCode).toEqual(200);
      expect(resp2.body).toEqual(resp1.body);
      done();
    });
  });

  describe('Testing fail requests', () => {
    it('wrong data-processing version', async done => {
      await supertest(app).post('/open-api/data-processing/').send(dataProcessing);
      const resp2 = await supertest(app).get('/open-api/data-processing/by-version/1');
      expect(resp2.statusCode).toEqual(200);
      expect(resp2.body).toEqual({});
      done();
    });
  });
});
