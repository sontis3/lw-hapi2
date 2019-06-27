'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionSchema = new Schema({
  system_object: {
    type: Schema.Types.ObjectId,
    ref: 'SystemObject',
    // eslint-disable-next-line prettier/prettier
    validate: v => mongoose.model('SystemObject').findById(v).exec(),    // валидация наличия в базе id Системного объекта
  }, // ссылка на Системный объект
  actions: [
    {
      system_object_action: {
        type: Schema.Types.ObjectId,
        ref: 'SystemObjectAction',
        // eslint-disable-next-line prettier/prettier
        validate: v => mongoose.model('SystemObjectAction').findById(v).exec(),    // валидация наличия в базе id Системного объекта
      }, // ссылка на Действие над Системным объектом
    },
  ],
});

// разрешение на действия с системными объектами
const schemaInstance = new Schema({
  name: { required: true, type: String, unique: true }, // Наименование
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    // eslint-disable-next-line prettier/prettier
    validate: v => mongoose.model('Role').findById(v).exec(),    // валидация наличия в базе id роли
  }, // ссылка на Роль
  permissions: [permissionSchema],
  // system_object: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'SystemObject',
  //   // eslint-disable-next-line prettier/prettier
  //   validate: v => mongoose.model('SystemObject').findById(v).exec(),    // валидация наличия в базе id Системного объекта
  // }, // ссылка на Системный объект
  // system_object_action: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'SystemObjectAction',
  //   // eslint-disable-next-line prettier/prettier
  //   validate: v => mongoose.model('SystemObjectAction').findById(v).exec(),    // валидация наличия в базе id Системного объекта
  // }, // ссылка на Действие над Системным объектом
  createdAt: { required: true, type: Date, default: Date.now }, // дата создания документа
  updatedAt: { required: false, type: Date, default: Date.now }, // дата последнего изменения документа
});

schemaInstance.pre('findOneAndUpdate', function(next) {
  this._update.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Rule', schemaInstance);
