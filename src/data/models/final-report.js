const mongoose = require('../../infra/database');

const ReportPageSchema = new mongoose.Schema({
  pageLabel: {
    type: String,
    required: [true, 'pageLabel required'],
  },

  values: {
    type: Array,
    default: [],
  },

  items: {
    type: [Object],
    default: [],
  },
});

const FinalReportSchema = new mongoose.Schema({
  version: {
    type: Number,
    required: [true, 'version required'],
  },

  isTemplate: {
    type: Boolean,
  },

  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AppointmentSchema',
    required: [ function() {
      return !(this.isTemplate);
    },
    'Appointment id required'],
  },

  pages: {
    type: [ReportPageSchema],
    validate: V => Array.isArray(V) && V.length > 0,
    required: [true, 'pages required'],
  },

});

const FinalReportModel = mongoose.model('FinalReportSchema', FinalReportSchema);

module.exports = FinalReportModel;
