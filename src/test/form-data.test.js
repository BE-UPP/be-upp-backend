const db = require('./db');
const { addFormData } = require('../service/form-data');
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

const answers = {
  questions: [
    {
      id: 'name',
      value: 'Ex: José Fernando da Silva',
    },
    {
      id: 'telephone',
      value: '12341234',
    },
    {
      id: 'email',
      value: 'willian@hiroshi.com.br.mogi',
    },
    {
      id: 'birthday',
      value: '30/05/1999',
    },
    {
      id: 'city',
      value: 'Mogi',
    }],
  templateVersion: 1,
  appointmentId: 1,
};

describe('Testing addFormData service', () => {
  describe('Testing successfully creates', () => {
    it('create new form-data', async(done) => {
      const t = await addFormData(answers);
      expect(t.templateVersion).toEqual(1);
      done();
    });
  });
});
