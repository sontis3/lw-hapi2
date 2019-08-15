'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// исследуемый препарат
const testDrugSchema = new Schema({
  name_ru: { required: true, type: String, unique: true }, // Наименование рус
  name_en: { type: String }, // Наименование англ.
  dosage_form: {
    type: Schema.Types.ObjectId,
    ref: 'DosageForm',
    required: true,
    // eslint-disable-next-line prettier/prettier
    validate: {
      validator: v =>
        mongoose
          .model('DosageForm')
          .findById(v)
          .exec(),
      message: props => `Попытка использовать отсутствующую лекарственную форму: ${props.value}`,
    }, // валидация наличия в базе id Лекарственной формы
  }, // ссылка на Лекарственную форму
  dosage: { required: true, type: String }, // Дозировка
  manufacturer: {
    type: Schema.Types.ObjectId,
    ref: 'Manufacturer',
    required: true,
    // eslint-disable-next-line prettier/prettier
    validate: {
      validator: v =>
        mongoose
          .model('Manufacturer')
          .findById(v)
          .exec(),
      message: props => `Попытка использовать отсутствующего производителя: ${props.value}`,
    }, // валидация наличия в базе id Производителя
  }, // ссылка на Производителя
});

// Исследование
const schemaInstance = new Schema({
  reg_code: { required: true, type: String, unique: true }, // Регистрационный номер
  name: { required: true, type: String, unique: true }, // Наименование
  plan_year: { required: true, type: String, unique: true }, // Плановый год
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
    // eslint-disable-next-line prettier/prettier
    validate: {
      validator: v =>
        mongoose
          .model('Customer')
          .findById(v)
          .exec(),
      message: props => `Попытка использовать отсутствующего заказчика: ${props.value}`,
    },
  }, // Заказчик исследования
  sponsor: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
    // eslint-disable-next-line prettier/prettier
    validate: {
      validator: v =>
        mongoose
          .model('Customer')
          .findById(v)
          .exec(),
      message: props => `Попытка использовать отсутствующего заказчика: ${props.value}`,
    },
  }, // Спонсор исследования
  t_drug: testDrugSchema, // Тестируемый прапарат
  r_drug: testDrugSchema, // Референтный прапарат
  enabled: { required: true, type: Boolean }, // Валидность
  createdAt: { required: true, type: Date, default: Date.now() }, // дата создания документа
  updatedAt: { required: false, type: Date, default: Date.now() }, // дата последнего изменения документа
});

schemaInstance.pre('findOneAndUpdate', function(next) {
  this._update.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Study', schemaInstance);
