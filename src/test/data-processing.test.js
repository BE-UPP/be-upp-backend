const db = require('./db');
const supertest = require('supertest');
// const { ObjectId } = require('mongodb');
const {omit, clone} = require('../service/helper');
const { processData, addProcessData,
  getProcessData } = require('../service/data-processing');
const { app, openServer, closeServer } = require('../server');
const moment = require('moment');

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


const formDataDb = {
  templateVersion: 0,
  questions: [
    {
      id: 'text',
      variables: ['text'],
      values: ['josé'],
    },
    {
      id: 'select',
      variables: ['selectId', 'select'],
      values: [2, 'Feminino'],
    },
    {
      id: 'scale',
      variables: ['scale'],
      values: [4],
    },
    {
      id: 'radio',
      variables: ['radioId', 'radio'],
      values: [
        1, 'Não',
      ],
    },
    {
      id: 'table',
      variables: ['tableId1', 'table1', 'tableId2', 'table2', 'tableId3', 'table3'],
      values: [0, '1', 1, '3', 2, '2'],
    },
    {
      id: 'checkbox',
      variables: ['checkbox1', 'checkbox2'],
      values: [ 1, 0 ],
    },
  ],
};

const variablesValues = {
  variables: ['text', 'selectId', 'select', 'scale', 'radioId',
    'radio', 'tableId1', 'table1', 'tableId2', 'table2', 'tableId3',
    'table3', 'checkbox1', 'checkbox2' ],
  values: ['josé', '2', 'Feminino', 4, 1, 'Não', 0, '1', 1, '3', 2, '2', 1, 0],
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
        '==1,0': 'Sim',
        __: 'Não',
      },
    },
  ],
};

const output = {
  text: 'josé',
  selectId: '2',
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
  checkbox1: 1,
  checkbox2: 0,
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
    let u = clone(t);

    delete u._id;
    delete u.__v;
    for (let i = 0; i < u.operations.length; i++)
      delete u.operations[i]._id;

    expect(u).toEqual(dataProcessing);

    done();
  });
  it('Processing 1 user', async done => {

    await addProcessData(dataProcessing);
    const t = await processData(formDataDb, variablesValues);
    let u = clone(t);

    omit(u, '_id');
    omit(u, '__v');

    expect(u).toEqual(output);

    done();
  });
  it('Processing 2 users', async done => {

    await addProcessData(dataProcessing);
    const t = await processData(formDataDb, variablesValues);
    let u = clone(t);

    omit(u, '_id');
    omit(u, '__v');

    expect(u).toEqual(output);

    const t2 = await processData(formDataDb, variablesValues);
    let u2 = clone(t2);

    omit(u2, '_id');
    omit(u2, '__v');

    expect(u2).toEqual(output);

    done();
  });
  it('Processing type Date', async done => {

    let dp = {
      version: 0,
      operations: [
        {
          name: 'Idade',
          type: 'Date',
          input: [
            'data',
          ],
          output: [
            'anos', 'meses', 'dias',
          ],
        },
        {
          name: 'Idade2',
          type: 'Date',
          input: [
            'data2',
          ],
          output: [
            'anos2', 'meses2', 'dias2',
          ],
        },
      ],
    };
    let date = moment('2001/12/11', 'YYYY/M/D');
    let date3 = moment('1998/07/18', 'YYYY/M/D');
    let date2 = moment().utcOffset('-0300');
    let y = date2.diff(date, 'years');
    date2 = date2.add(-y, 'years');
    let m = date2.diff(date, 'months');
    date2 = date2.add(-m, 'months');
    let d = date2.diff(date, 'days');

    date2 = moment().utcOffset('-0300');
    let y2 = date2.diff(date3, 'years');
    date2 = date2.add(-y2, 'years');
    let m2 = date2.diff(date3, 'months');
    date2 = date2.add(-m2, 'months');
    let d2 = date2.diff(date3, 'days');

    let output2 = {
      data: '11/12/2001',
      anos: y,
      meses: m,
      dias: d,
      data2: '18/07/1998',
      anos2: y2,
      meses2: m2,
      dias2: d2,
    };

    let variablesValues2 = {
      variables: ['data', 'data2'],
      values: ['11/12/2001', '18/07/1998'],
    };

    await addProcessData(dp);
    const t = await processData(formDataDb, variablesValues2);
    let u = clone(t);

    u = omit(u, '_id');
    u = omit(u, '__v');

    expect(u).toEqual(output2);

    done();
  });
  it('Processing type Table', async done => {

    let dp = {
      version: 0,
      operations: [
        {
          name: 'idade',
          type: 'Table',
          input: [
            { label: 'idade', type: 'number' },
          ],
          output: [
            'anos', 'meses',
          ],
          body: {
            '==20': [1, 2],
            __: [3, 4],
          },
        },
      ],
    };

    let output2 = {
      idade: 20,
      anos: 1,
      meses: 2,
    };

    let variablesValues2 = {
      variables: ['idade'],
      values: [20],
    };

    await addProcessData(dp);
    const t = await processData(formDataDb, variablesValues2);
    let u = clone(t);

    u = omit(u, '_id');
    u = omit(u, '__v');

    expect(u).toEqual(output2);

    done();
  });
  it('Processing type String', async done => {

    let variablesValues2 = {
      variables: ['a', 'b', 'c', 'x', 'y', 'z', 'aaa', 'bbb', 'ccc'],
      values: [true, false, true, '', 'A', '', '1', '', '2'],
    };
    let dp = {
      version: 0,
      operations: [
        {
          type: 'String',
          input: [
            {variable: 'a', label: 'A', validation: 'bool' },
            {variable: 'b', label: 'B', validation: 'bool'},
            {variable: 'c', label: 'C', validation: 'bool'},
          ],
          output: [
            'abc',
          ],
        }, {
          type: 'String',
          input: [
            {variable: 'x', label: 'X', validation: 'empty' },
            {variable: 'y', label: 'Y', validation: 'empty' },
            {variable: 'z', label: 'Z', validation: 'empty' },
          ],
          output: [
            'xyz',
          ],
        },
        {
          type: 'String',
          input: [
            {variable: 'aaa' },
            {variable: 'bbb' },
            {variable: 'ccc' },
          ],
          output: [
            'az',
          ],
        },
      ],
    };

    let output2 = {
      a: true,
      b: false,
      c: true,
      x: '',
      y: 'A',
      z: '',
      aaa: '1',
      bbb: '',
      ccc: '2',
      abc: 'A, C.',
      xyz: 'X, Z.',
      az: '1, 2.',

    };


    await addProcessData(dp);
    const t = await processData(formDataDb, variablesValues2);
    let u = clone(t);

    u = omit(u, '_id');
    u = omit(u, '__v');

    expect(u).toEqual(output2);

    done();
  });
  it('Processing type Table 2', async done => {

    let dp = {
      version: 0,
      operations: [
        {
          name: 'idade',
          type: 'Table',
          input: [
            { label: 'idade', type: 'number' },
          ],
          output: [
            'anos', 'meses',
          ],
          body: {
            '==20': [9, 11],
          },
        },
      ],
    };

    let output2 = {
      idade: 33,
      anos: null,
      meses: null,
    };

    let variablesValues2 = {
      variables: ['idade'],
      values: [33],
    };

    await addProcessData(dp);
    const t = await processData(formDataDb, variablesValues2);
    let u = clone(t);

    u = omit(u, '_id');
    u = omit(u, '__v');

    expect(u).toEqual(output2);

    done();
  });
});

describe('Testing invalid process', () => {
  it('Operations with only body', async done => {
    expect.assertions(1);
    try {
      let invalidProcessing = clone(dataProcessing);
      invalidProcessing.operations[0] = {body: 'scale * selectId + radioId' };

      await addProcessData(invalidProcessing);
      await processData(formDataDb, {});
    } catch (error) {
      expect(error.code).toEqual(400);
    }

    done();
  });
  it('Processing without input', async done => {
    expect.assertions(1);

    try {
      let invalidProcessing = clone(dataProcessing);
      invalidProcessing.operations[0].input = [];

      await addProcessData(invalidProcessing);
      await processData(formDataDb, {});
    } catch (error) {
      expect(error.code).toEqual(400);
    }

    done();
  });
});


describe('Testing post dataProcessing request', () => {

  describe('Testing successful requests', () => {
    it('create new dataProcessing', async done => {
      const resp = await supertest(app).post('/open-api/data-processing/new')
        .send(dataProcessing);
      expect(resp.statusCode).toEqual(200);
      expect(resp.body.version).toEqual(dataProcessing.version);
      done();
    });
  });

  describe('Testing fail requests', () => {
    it('null data-processing', async done => {
      const resp = await supertest(app).post('/open-api/data-processing/new').send({});
      expect(resp.statusCode).toEqual(400);
      done();
    });
  });

  describe('Testing successful requests', () => {
    it('get dataProcessing by version', async done => {
      const resp1 = await supertest(app).post('/open-api/data-processing/new')
        .send(dataProcessing);
      const resp2 = await supertest(app).get('/open-api/data-processing/by-version/0');
      expect(resp2.statusCode).toEqual(200);
      expect(resp2.body).toEqual(resp1.body);
      done();
    });
  });

  describe('Testing fail requests', () => {
    it('wrong data-processing version', async done => {
      await supertest(app).post('/open-api/data-processing/new').send(dataProcessing);
      const resp2 = await supertest(app).get('/open-api/data-processing/by-version/1');
      expect(resp2.statusCode).toEqual(200);
      expect(resp2.body).toEqual({});
      done();
    });
  });
});
