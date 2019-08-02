'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Страна
const schemaInstance = new Schema({
  name_ru: { required: true, type: String, unique: true }, // Наименование рус
  name_en: { type: String }, // Наименование англ.
  country: {
    type: Schema.Types.ObjectId,
    ref: 'Country',
    // eslint-disable-next-line prettier/prettier
    validate: v => mongoose.model('Country').findById(v).exec(),    // валидация наличия в базе id страны
  }, // ссылка на Страна
});

// schemaInstance.pre('findOneAndUpdate', function(next) {
//   this._update.date_updated = Date.now();
//   next();
// });

module.exports = mongoose.model('Manufacturer', schemaInstance);
