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


module.exports = {
  getTemplateById: getTemplateById,
  getLatestTemplate: getLatestTemplate,
  setTemplate: setTemplate,
  getTemplateByVersion: getTemplateByVersion,
};
