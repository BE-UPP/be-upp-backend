const mongoose = require('../../infra/database');

const PageSchema = new mongoose.Schema({
  pageLabel: {
    type: String,
    required: [true, 'pageLabel required'],
  },

  questions: {
    type: Object,
  },
});

const TemplateSchema = new mongoose.Schema({
  templateVersion: {
    type: Number,
    required: [true, 'Template version required'],
  },

  pages: {
    type: [PageSchema],
    validate: V => Array.isArray(V) && V.length > 0,
  },

  createAt: {
    type: Number,
    required: [true, 'createAt required'],
  },
});

const TemplateModel = mongoose.model('TemplateSchema', TemplateSchema);

module.exports = TemplateModel;