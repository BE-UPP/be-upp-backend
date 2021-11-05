const mongoose = require('../../infra/database');

const QuestionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },

  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

const FormDataSchema = new mongoose.Schema({
  templateVersion: {
    type: Number,
    required: [true, 'Template version required'],
  },

  questions: {
    type: [QuestionSchema],
    validate: V => Array.isArray(V) && V.length > 0,
    required: [true, 'Questions required'],
  },

  answeredAt: {
    type: Number,
    required: [true, 'Answer time required'],
  },

  doctorId: {
    type: Number,
    required: [true, 'Doctor id required'],
  },
});

const FormDataModel = mongoose.model('FormDataSchema', FormDataSchema);

module.exports = FormDataModel;
