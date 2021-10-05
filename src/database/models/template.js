const mongoose = require('../../database');

const TemplateSchema = new mongoose.Schema({
  templateVersion: {
    type: Number,
    require: true,
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