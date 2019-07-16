'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// действия с системными объектами
const schemaInstance = new Schema({
  name: { required: true, type: String, unique: true }, // Наименование
  tag: { required: true, type: String, unique: true }, // Тэг
  enabled: { required: true, type: Boolean }, // Валидность
});

module.exports = mongoose.model('SystemObjectAction', schemaInstance, 'system_object_actions');
