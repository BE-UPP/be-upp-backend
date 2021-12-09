const Model = require('../data/models/template');

const getTemplateById = async(id) => {
  try {
    const dado = await Model.findById(id).exec();
    return dado;
  } catch (error) {
    const err = {
      err: error,
      code: 500,
    };
    throw err;
  }
};

const getLatestTemplate = async() => {
  try {
    const dado = await Model.findOne().sort({
      createAt: -1,
    }).exec();
    return dado;
  } catch (error) {
    const err = {
      err: error,
      code: 500,
    };
    throw err;
  }
};

const getTemplateByVersion = async(version) => {

  try {
    const dado = await Model.findOne({templateVersion: version}).exec();
    return dado;
  } catch (error) {
    const err = {
      err: error,
      code: 500,
    };
    throw err;
  }

};

const setTemplate = async(pages) => {
  try {
    const now = Date.now();
    const latest_template = await getLatestTemplate();
    const version = latest_template ? latest_template.templateVersion + 1 : 0;
    const dado = {
      templateVersion: version,
      pages: pages,
      createAt: now,
    };
    const result = await Model.create(dado);
    return result;
  } catch (error) {
    const err = {
      message: error.message,
      code: 400,
    };
    throw err;
  }

};

const getVariables = async(formData) => {
  try {
    let version = formData.templateVersion;
    let template = await getTemplateByVersion(version);

    const output = {
      variables: [],
      values: [],
    };

    let questions = {};

    for (let page of template.pages) {
      for (let key in page.questions) {
        questions[key] = page.questions[key].variables;
      }
    }

    for (let i in formData.questions) {
      let id = formData.questions[i].id;
      let v = questions[id];
      Array.prototype.push.apply(output.variables, v);
      Array.prototype.push.apply(output.values, formData.questions[i].values);
    }
    return output;
  } catch (error) {
    const err = {
      message: error.message,
      code: 400,
    };
    throw err;
  }

};

module.exports = {
  getTemplateById: getTemplateById,
  getLatestTemplate: getLatestTemplate,
  setTemplate: setTemplate,
  getTemplateByVersion: getTemplateByVersion,
  getVariables: getVariables,
};
