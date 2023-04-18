'use strict';

const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;


let CategorySchema = new Schema({
  code: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type:String,
    required:true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date
  },
  isDeleted: {
    type:Boolean,
    required:true,
    default:false
  },
  flag: {
    type:String,
    enum:['Service','Reagent'],
    required:true
  }
});

module.exports = mongoose.model('Categories', CategorySchema);

//Author: Kyaw Zaw Lwin
