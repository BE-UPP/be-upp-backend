const Model = require('../data/models/template');

exports.getTemplateById = async (id) => {
  try {
    const dado = await Model.findById(id).exec();
    return dado;
  }
  catch(error) {
    throw {
      err: error,
      code: 500,
    }
  }
}

exports.getLastestTemplate = async () => {
  try {
    const dado = await Model.findOne().sort({createAt: -1}).exec();
    return dado;
  }
  catch(error) {
    throw {
      err: error,
      code: 500,
    }
  }
}
