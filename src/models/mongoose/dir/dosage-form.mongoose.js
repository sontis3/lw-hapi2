'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Лекарственная форма
const schemaInstance = new Schema({
  name: { required: true, type: String, unique: true }, // Наименование
});

// schemaInstance.pre('findOneAndUpdate', function(next) {
//   this._update.date_updated = Date.now();
//   next();
// });

module.exports = mongoose.model('DosageForm', schemaInstance, 'dosage_forms');
