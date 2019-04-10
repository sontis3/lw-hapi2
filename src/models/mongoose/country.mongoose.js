"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Страна
const countrySchema = new Schema({
  name_ru: { required: true, type: String, unique: true },    // Наименование рус
  name_en: { required: true, type: String, unique: true },    // Наименование англ.
  enabled: { required: true, type: Boolean }                  // Валидность
});

// countrySchema.pre('findOneAndUpdate', function(next) {
//   this._update.date_updated = Date.now();
//   next();
// });

module.exports = mongoose.model('Country', countrySchema);