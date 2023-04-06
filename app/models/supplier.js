'use strict';

const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;
const validator = require('validator');


let SupplierSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phone:{
    type: String,
    unique: true,
    required: [true, 'Phone Number Required!'],
  },
  address: {
    type:String,
    required:true
  },
  creditAmount: {
    type: Number,
    default:0
  },
  purchaseAmount: {
    type: Number,
    default:0,
  },
  status:{
    type:Boolean
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
  }
});

module.exports = mongoose.model('Suppliers', SupplierSchema);

//Author: Kyaw Zaw Lwin
