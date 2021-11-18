const db = require('./db');
const {
  getLatestTemplate,
  setTemplate,
  getTemplateById,
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

const formData = {
  templateVersion: 1,
  "text": {
    "type": "text",
    "variables": ["text"],
    "values": ["josé"]
  },
  "select": {
    "type": "select",
    "variables": ["selectId", "select"],
    "values": [2, "Feminino"]
  },
  "scale": {
    "type": "scale",
    "variables": ["scale"],
    "values": [4]
  },
  "radio": {
    "type": "radio",
    "variables": ["radioId", "radio"],
    "values": [
      1, "Não"
    ]
  },
  "table": {
    "type": "table",
    "variables": ["tableId1", "table1", "tableId2", "table2", "tableId3", "table3"],
    "values": [0, "1", 1, "3", 2, "2"]
  },
  "checkbox": {
    "type": "checkbox",
    "variables": ["checkbox"],
    "values": [{
      "3": "Melhora de humor",
      "9": "Melhorar a saúde mental",
      "10": "Emagrecimento"
    }]
  },
};

const dataProcessing = {
  "version": 1,
  "operations": {
    "math1":
    {
      "type": "Math",
      "input": ["scale", "selectId", "radioId"],
      "output": ["math1"],
      "body": "scale * selectId + radioId"
    }
  },
  "tableProcessing1":
  {
    "type": "Table",
    "input": [{ "label": "tableId1", "type": "number" }],
    "output": ["tableProcessing1"],
    "body": {
      "==1": "Sim",
      "__": "Não"
    }
  }
};

const output = {
  "text": "josé",
  "selectId": 2,
  "select": "Feminino",
  "scale": 4,
  "radioId": 1,
  "radio": "Não",
  "tableId1": 0,
  "table1": "1",
  "tableId2": 1,
  "table2": "3",
  "tableId3": 2,
  "table3": "2",
  "checkbox": {
    "3": "Melhora de humor",
    "9": "Melhorar a saúde mental",
    "10": "Emagrecimento"
  },
  "math1": 9,
  "tableProcessing1": "Não",
};


describe('Testing data-processing service', () => {
  describe('Testing successfully process', () => {
    it('creating the first template', async done => {
      const t = await processData(formData, dataProcessing);


      console.log(t);
      expect(t).toEqual(output);




      done();
    });
  });
});

/*
describe('Testing getTemplateById service', () => {
  it('Testing successfuly retrieving a template', async done => {
    const t = await setTemplate(pages);
    const t2 = await getTemplateById(t._id);
    expect(t2._id).toEqual(t._id);
    done();
  });
  it('Testing unsuccessfuly retrieving a template', async done => {
    expect.assertions(1);
    try {
      await getTemplateById(3);
    } catch (e) {
      expect(e.code).toEqual(500);
    }
    done();
  });
});

describe('Testing getLatestTemplate service', () => {
  it('Testing retrieving the last template', async done => {
    await setTemplate(pages);
    const t2 = await setTemplate(pages);
    const r = await getLatestTemplate();
    expect(r._id).toEqual(t2._id);
    done();
  });
  it('Failing to retrieve template due to non existence', async done => {
    const r = await getLatestTemplate();
    expect(r).toBeNull();
    done();
  });
});

describe('Testing post template request', () => {
  describe('Testing successful requests', () => {
    it('create new template', async done => {
      const resp = await supertest(app).post('/open-api/template/').send({
        pages: pages,
      });
      expect(resp.statusCode).toEqual(200);
      expect(resp.body.templateVersion).toEqual(0);
      done();
    });
  });
  describe('Testing fail requests', () => {
    it('pages blank', async done => {
      const resp = await supertest(app).post('/open-api/template/').send({
        pages: {},
      });
      expect(resp.statusCode).toEqual(400);
      done();
    });
  });
});

describe('Testing get template by id request', () => {
  describe('Testing successful requests', () => {
    it('template by id', async done => {
      const t = await setTemplate(pages);
      const resp = await supertest(app).get(`/open-api/template/by-id/${t._id}`);
      const t2 = resp.body;
      const id = ObjectId(t2._id);
      expect(id).toEqual(t._id);
      done();
    });

    it('latest template', async done => {
      const t = await setTemplate(pages);
      const resp = await supertest(app).get('/open-api/template/latest');
      const t2 = resp.body;
      const id = ObjectId(t2._id);
      expect(id).toEqual(t._id);
      done();
    });
  });

  describe('Testing fail requests', () => {
    it('template by id', async done => {
      await setTemplate(pages);
      const resp = await supertest(app).get('/open-api/template/by-id/-1');
      expect(resp.statusCode).toEqual(500);
      done();
    });
    it('latest template', async done => {
      const resp = await supertest(app).get('/open-api/template/latest');
      const t2 = resp.body;
      expect(t2).toEqual({});
      done();
    });
  });
});
*/