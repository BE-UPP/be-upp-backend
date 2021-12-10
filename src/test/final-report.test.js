const db = require('./db');
const { addFinalReportTemplate, getFinalReportTemplateByVersion,
  addFinalReportData, getFinalReportData } = require('../service/final-report');
const { createNewPatient } = require('../service/patient');
const { createNewDoctor, validateDoctorLogin } = require('../service/doctor');
const { createNewAppointment } = require('../service/appointment');
const { app,
  openServer, closeServer } = require('../server');
const { clone } = require('../service/helper');
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

const FinalReportTemplate = {
  version: 1,
  pages: [
    {
      pageLabel: 'Dados Gerais',
      values: [
        'nome',
        'sexo',
        'idade',
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
          label: 'Sexo biológico:',
          type: 'text',
          content: [
            1,
          ],
        },
        {
          label: 'Idade:',
          type: 'text',
          content: [
            2,
            'anos',
          ],
        },
      ],
    },

  ],
};

const answers = {
  questions: [
    {
      id: 'nome',
      values: ['José da Silva'],
    },
    {
      id: 'sexo',
      values: ['Masculino'],
    } ],
  templateVersion: 1,
};

const variables = {
  nome: 'José da Silva',
  sexo: 'Masculino',
  idade: 90,
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

describe('Testing FinalReport services', () => {

  it('create new FinalReportTemplate', async(done) => {
    let FRTemplate = await addFinalReportTemplate(FinalReportTemplate);
    let output = clone(FinalReportTemplate);
    output.isTemplate = true;

    let t = clone(FRTemplate);
    delete t._id;
    delete t.__v;

    for (let i in t.pages)
      delete t.pages[i]._id;

    expect(t).toEqual(output);
    done();
  });

  it('get FinalReportTemplate', async(done) => {
    let FRTemplate = await addFinalReportTemplate(FinalReportTemplate);
    let t = clone(FRTemplate);
    let t2 = await getFinalReportTemplateByVersion(FinalReportTemplate.version);
    let t3 = clone(t2.toObject());

    delete t._id;
    delete t.__v;
    for (let i in t.pages)
      delete t.pages[i]._id;

    delete t3._id;
    delete t3.__v;
    for (let i in t3.pages)
      delete t3.pages[i]._id;

    expect(t3).toEqual(t);
    done();
  });

  it('create new FinalReportData', async(done) => {
    const pat = await createNewPatient(p.name, p.email, p.cpf, p.cellphone,
      p.birth, p.password);
    const doc = await createNewDoctor(d.name, d.email, d.password, d.cellphone,
      d.phone, d.rcn);
    const date = Date.now();
    const t = await createNewAppointment(date, pat._id, doc._id);
    let formData = clone(answers);
    formData.appointmentId = t._id;

    await addFinalReportTemplate(FinalReportTemplate);
    let FRData = await addFinalReportData(formData, variables);
    let output = clone(FinalReportTemplate);
    output.appointmentId = String(t._id);
    delete output.isTemplate;

    output.pages[0].values = [
      'José da Silva',
      'Masculino',
      '90' ];

    let t2 = clone(FRData);
    delete t2._id;
    delete t2.__v;
    for (let i in t2.pages)
      delete t2.pages[i]._id;

    expect(t2).toEqual(output);
    done();
  });

  it('get new FinalReportData', async(done) => {
    const pat = await createNewPatient(p.name, p.email, p.cpf, p.cellphone,
      p.birth, p.password);
    const doc = await createNewDoctor(d.name, d.email, d.password, d.cellphone,
      d.phone, d.rcn);
    const date = Date.now();
    const t = await createNewAppointment(date, pat._id, doc._id);
    let formData = clone(answers);
    formData.appointmentId = t._id;

    await addFinalReportTemplate(FinalReportTemplate);
    let FRData = await addFinalReportData(formData, variables);
    let FRData2 = await getFinalReportData(t._id);

    expect(FRData2.toObject()).toEqual(FRData.toObject());
    done();
  });
  // describe('Testing failed creates', () => {
  // });
});


describe('Testing API final-report', () => {
  describe('Testing successful requests', () => {
    it('create new FinalReportTemplte', async done => {
      await createNewDoctor(d.name, d.email, d.password, d.cellphone,
        d.phone, d.rcn);
      const login = await validateDoctorLogin(d.email, d.password);

      const resp = await supertest(app).post('/close-api/final-report/new').set(
        'x-access-token', login.token).send(FinalReportTemplate);

      const id = mongoose.Types.ObjectId(resp.body);
      const id2 = await getFinalReportTemplateByVersion(FinalReportTemplate.version);

      expect(resp.statusCode).toEqual(200);
      expect(id).toEqual(id2._id);
      done();
    });
    it('get FinalReportData', async done => {
      const pat = await createNewPatient(p.name, p.email, p.cpf, p.cellphone,
        p.birth, p.password);
      const doc = await createNewDoctor(d.name, d.email, d.password, d.cellphone,
        d.phone, d.rcn);
      const login = await validateDoctorLogin(d.email, d.password);
      const date = Date.now();
      const t = await createNewAppointment(date, pat._id, doc._id);


      let formData = clone(answers);
      formData.appointmentId = t._id;

      await addFinalReportTemplate(FinalReportTemplate);
      let FRData = await addFinalReportData(formData, variables);
      let aux = clone(FRData.toObject());
      aux._id = String(aux._id);

      const resp = await supertest(app).get(`/close-api/final-report/by-id/${t._id}`).set(
        'x-access-token', login.token);

      const data = resp.body;


      expect(resp.statusCode).toEqual(200);
      expect(data).toEqual(aux);
      done();
    });
  });
});
