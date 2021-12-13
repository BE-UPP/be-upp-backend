const db = require('./db');
const { addFormData } = require('../service/form-data');
const { createNewPatient } = require('../service/patient');
const { createNewDoctor } = require('../service/doctor');
const { createNewAppointment } = require('../service/appointment');
const { setTemplate } = require('../service/template');
const { addProcessData } = require('../service/data-processing');
const { addFinalReportTemplate } = require('../service/final-report');
const { app, openServer, closeServer } = require('../server');
const supertest = require('supertest');
const mongoose = require('mongoose');

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
      values: ['Ex: José Fernando da Silva'],
    },
    {
      id: 'telephone',
      values: ['12341234'],
    },
    {
      id: 'email',
      values: ['willian@hiroshi.com.br.mogi'],
    },
    {
      id: 'birthday',
      values: ['30/05/1999'],
    },
    {
      id: 'city',
      values: ['Mogi'],
    }],
  templateVersion: 0,
};

const p = {
  name: 'Marcos Siolin',
  email: 'marcossiolin@mail.com',
  cpf: '11223344556',
  cellphone: '11945158787',
  birth: 1005530400000,
  password: 'senhasegura',
};

const d = {
  name: 'Doutor',
  email: 'doutor@medi.co',
  password: 'medicina123',
  cellphone: '11945150909',
  phone: '1135150909',
  rcn: '22359',
};

const pages = [
  {
    pageLabel: 'A page label',
    questions: {
      name: {
        questionLabel: 'Nome Incompleto',
        placeholder: 'Ex: José Fernando da Silva',
        type: 'text',
        variables: ['name'],
      },
      telephone: {
        questionLabel: 'Número de Celular (DDD + Telefone)',
        placeholder: 'Ex: 119XXXXXXXX',
        type: 'text',
        variables: ['telephone'],
      },
      email: {
        questionLabel: '',
        placeholder: '',
        type: 'text',
        variables: ['email'],
      },
      birthday: {
        questionLabel: '',
        placeholder: '',
        type: 'text',
        variables: ['birthday'],
      },
      city: {
        questionLabel: '',
        placeholder: '',
        type: 'text',
        variables: ['city'],
      },
    },
  },
];

const dataProcessing = {
  version: 0,
  operations: [
    {
      type: 'Table',
      input: [{ label: 'city', type: 'text' }],
      output: ['mogi'],
      body: {
        Mogi: 'Sim',
        __: 'Não',
      },
    },
  ],
};

const FinalReportTemplate = {
  version: 0,
  pages: [
    {
      pageLabel: 'Dados Gerais',
      values: [
        'name',
        'telephone',
        'email',
        'birthday',
        'city',
        'mogi',
      ],
      items: [
        {
          label: 'Nome:',
          type: 'text',
          content: [
            0,
          ],
        },
        {
          label: 'Telefone:',
          type: 'text',
          content: [
            1,
          ],
        },
        {
          label: 'Email:',
          type: 'text',
          content: [
            2,
          ],
        },
        {
          label: 'Aniversário:',
          type: 'text',
          content: [
            3,
          ],
        },
        {
          label: 'Cidade:',
          type: 'text',
          content: [
            5,
            4,
          ],
        },
      ],
    },

  ],
};


describe('Testing addFormData service', () => {
  describe('Testing successfully creates', () => {
    it('create new form-data', async(done) => {
      const pat = await createNewPatient(p.name, p.email, p.cpf, p.cellphone,
        p.birth, p.password);
      const doc = await createNewDoctor(d.name, d.email, d.password, d.cellphone,
        d.phone, d.rcn);
      const date = Date.now();
      const t = await createNewAppointment(date, pat._id, doc._id);
      answers.appointmentId = t._id;
      const t2 = await addFormData(answers);
      expect(t2.templateVersion).toEqual(0);
      done();
    });
  });
  describe('Testing failed creates', () => {
    it('wrong appointmentId', async(done) => {
      expect.assertions(1);
      answers.appointmentId = mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
      try {
        const t2 = await addFormData(answers);
        expect(t2.templateVersion).toEqual(1);
      } catch (error){
        expect(error.code).toEqual(400);
      }
      done();
    });
  });
});

describe('Testing post form-data request', () => {
  describe('Testing successful requests', () => {
    it('create new form-data', async done => {
      const pat = await createNewPatient(p.name, p.email, p.cpf, p.cellphone,
        p.birth, p.password);
      const doc = await createNewDoctor(d.name, d.email, d.password, d.cellphone,
        d.phone, d.rcn);
      const date = Date.now();
      const t = await createNewAppointment(date, pat._id, doc._id);
      await addFinalReportTemplate(FinalReportTemplate);
      answers.appointmentId = t._id;
      setTemplate(pages);
      addProcessData(dataProcessing);

      const resp = await supertest(app).post('/open-api/form-data/new')
        .send(answers);
      const ans = resp.body;
      expect(resp.statusCode).toEqual(200);
      expect(ans.templateVersion).toEqual(answers.templateVersion);
      done();
    });
  });
  describe('Testing fail requests', () => {
    it('failing to create form-data', async done => {
      answers.appointmentId = mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
      setTemplate(pages);
      addProcessData(dataProcessing);
      const resp = await supertest(app).post('/open-api/form-data/new')
        .send(answers);
      expect(resp.statusCode).toEqual(400);
      done();
    });
  });
});
