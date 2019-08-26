'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Приложение к договору
const addendumSchema = new Schema({
  reg_code: { required: true, type: String, unique: true }, // Регистрационный номер
  reg_date: { required: true, type: Date, default: Date.now }, // дата регистрации
  theme: { required: true, type: String, unique: true }, // Тема
  fileRef: { type: Schema.Types.ObjectId, unique: true }, // ссылка на файл
});

// Договор
const schemaInstance = new Schema({
  reg_code: { required: true, type: String, unique: true }, // Регистрационный номер
  theme: { required: true, type: String, unique: true }, // Тема
  reg_date: { required: true, type: Date, default: Date.now }, // дата регистрации
  deadline_date: { type: Date, default: Date.now }, // Срок действия договора
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
  fileRef: { type: Schema.Types.ObjectId, unique: true }, // ссылка на файл
  addendums: [addendumSchema], // дополнения к договору
  createdAt: { required: true, type: Date, default: Date.now }, // дата создания документа
  updatedAt: { required: false, type: Date, default: Date.now }, // дата последнего изменения документа
});

schemaInstance.pre('findOneAndUpdate', function(next) {
  this._update.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Contract', schemaInstance);
