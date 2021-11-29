const db = require('./db');
const { processData,
  addProcessData,
  getProcessData,
} = require('../service/data-processing');
const {omit, clone} = require('../service/helper');
const { openServer, closeServer } = require('../server');

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
    const t = await processData(formDataDb);
    let u = clone(t);

    omit(u, '_id');
    omit(u, '__v');

    expect(u).toEqual(output);

    done();
  });
  it('Processing 2 users', async done => {

    await addProcessData(dataProcessing);
    const t = await processData(formDataDb);
    let u = clone(t);

    omit(u, '_id');
    omit(u, '__v');

    expect(u).toEqual(output);

    const t2 = await processData(formDataDb);
    let u2 = clone(t2);

    omit(u2, '_id');
    omit(u2, '__v');

    expect(u2).toEqual(output);

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
      await processData(formDataDb);
    } catch (error) {
      expect(error.code).toEqual(400);
    }

    done();
  });
  it('Processing without input', async done => {
    expect.assertions(1);

    try {
      let invalidProcessing = clone(dataProcessing);
      console.log(invalidProcessing);
      invalidProcessing.operations[0].input = [];

      await addProcessData(invalidProcessing);
      await processData(formDataDb);
    } catch (error) {
      expect(error.code).toEqual(400);
    }

    done();
  });
});
