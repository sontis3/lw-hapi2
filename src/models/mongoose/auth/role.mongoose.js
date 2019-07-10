'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Разрешение роли
const permissionSchema = new Schema({
  system_object: {
    type: Schema.Types.ObjectId,
    ref: 'SystemObject',
    required: true,
    // eslint-disable-next-line prettier/prettier
    validate: {
      validator: v =>
        mongoose
          .model('SystemObject')
          .findById(v)
          .exec(),
      message: props => `Попытка использовать в разрешении роли отсутствующий системный объект: ${props.value}`,
    }, // валидация наличия в базе id Системного объекта
  }, // ссылка на Системный объект
  actions: [
    {
      action: {
        type: Schema.Types.ObjectId,
        ref: 'SystemObjectAction',
        // eslint-disable-next-line prettier/prettier
        validate: {
          validator: v =>
            mongoose
              .model('SystemObjectAction')
              .findById(v)
              .exec(),
          message: props =>
            `Попытка использовать в разрешении роли отсутствующее действие над системным объектом: ${props.value}`,
        }, // валидация наличия в базе id Системного объекта
      }, // ссылка на Действие над Системным объектом
      enabled: { required: true, type: Boolean }, // Валидность
    },
  ],
});

// Роль
const schemaInstance = new Schema({
  name: { required: true, type: String, unique: true }, // Наименование
  permissions: [permissionSchema], // разрешения
  enabled: { required: true, type: Boolean }, // Валидность
  createdAt: { required: true, type: Date, default: Date.now }, // дата создания документа
  updatedAt: { required: false, type: Date, default: Date.now }, // дата последнего изменения документа
});

schemaInstance.pre('findOneAndUpdate', function (next) {
  this._update.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Role', schemaInstance);
