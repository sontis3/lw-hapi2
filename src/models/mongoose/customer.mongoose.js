'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Заказчик
const schemaInstance = new Schema({
  name: { required: true, type: String, unique: true }, // Наименование
  enabled: { required: true, type: Boolean }, // Валидность
  country: {
    type: Schema.Types.ObjectId,
    ref: 'Country',
    // eslint-disable-next-line prettier/prettier
    validate: v => mongoose.model('Country').findById(v).exec(),    // валидация наличия в базе id страны
  }, // ссылка на Страна
  zip_code: { type: String }, // Почтовый индекс
  city: { type: String }, // Населённый пункт
  region: { type: String }, // Область/край/республика
  address_line_1: { type: String }, // Адрес1
  address_line_2: { type: String }, // Адрес2
  address_line_3: { type: String }, // Адрес3
  email: { required: true, type: String, unique: true }, // Почта
  phone_1: { required: true, type: String, unique: true }, // Телефон1
  phone_2: { type: String }, // Телефон2
  person: { type: String }, // Контактное лицо
  createdAt: { required: true, type: Date, default: Date.now }, // дата создания документа
  updatedAt: { required: false, type: Date, default: Date.now }, // дата последнего изменения документа
});

schemaInstance.pre('findOneAndUpdate', function(next) {
  this._update.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Customer', schemaInstance);
