'use strict';

const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;
const validator = require('validator');


let DoctorSchema = new Schema({
  selection: {
    type: String,
    enum: ['Pathologist', 'Clinic', 'ReferDoctor']
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      isAsync: true,
      validator: validator.isEmail,
      message: 'Invalid Email Address.',
    },
    required: [true, 'User email required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false
  },
  position: {
    type: String
  },
  education: {
    type: String
  }
});

module.exports = mongoose.model('Doctors', DoctorSchema);

//Author: Kyaw Zaw Lwin
