const Model = require('../data/models/template');

const getTemplateById = async(id) => {
  try {
    const dado = await Model.findById(id).exec();
    return dado;
  } catch (error) {
    throw {
      err: error,
      code: 500,
    };
  }
};

const getLatestTemplate = async() => {
  try {
    const dado = await Model.findOne().sort({
      createAt: -1,
    }).exec();
    return dado;
  } catch (error) {
    throw {
      err: error,
      code: 500,
    };
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
    throw {
      message: error.message,
      code: 400,
    };
  }

};


module.exports = {
  getTemplateById: getTemplateById,
  getLatestTemplate: getLatestTemplate,
  setTemplate: setTemplate,
};
