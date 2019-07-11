'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Объект системы
const schemaInstance = new Schema({
  name: { required: true, type: String, unique: true }, // Наименование
  tag: { required: true, type: String, unique: true }, // Тэг
  enabled: { required: true, type: Boolean }, // Валидность
  createdAt: { required: true, type: Date, default: Date.now }, // дата создания документа
  updatedAt: { required: false, type: Date, default: Date.now }, // дата последнего изменения документа
});

schemaInstance.pre('findOneAndUpdate', function(next) {
  this._update.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SystemObject', schemaInstance, 'system_objects');
