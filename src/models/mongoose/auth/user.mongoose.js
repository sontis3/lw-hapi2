'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Аутентификация
const schemaInstance = new Schema({
  name: { required: true, type: String, unique: true }, // Наименование
  enabled: { required: true, type: Boolean }, // Валидность
  email: { required: true, type: String, unique: true }, // Почта
  password: { required: true, type: String }, // хеш пароля
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    // eslint-disable-next-line prettier/prettier
    validate: v => mongoose.model('Role').findById(v).exec(),    // валидация наличия в базе id роли
    message: props => `Попытка использовать отсутствующую роль: ${props.value}`,
  }, // ссылка на Роль
  createdAt: { required: true, type: Date, default: Date.now }, // дата создания документа
  updatedAt: { required: false, type: Date, default: Date.now }, // дата последнего изменения документа
});

schemaInstance.pre('findOneAndUpdate', function(next) {
  this._update.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', schemaInstance);
