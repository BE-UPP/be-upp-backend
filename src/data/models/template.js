const mongoose = require('../../infra/database');

const TemplateSchema = new mongoose.Schema({
  templateVersion: {
    type: Number,
    required: [true, 'Template Version Required'],
  }, 
  pages: {
    type: Array,
  },
  createAt: {
    type: Number,
  },
})

const TemplateModel = mongoose.model('TemplateSchema', TemplateSchema);

module.exports = TemplateModel;