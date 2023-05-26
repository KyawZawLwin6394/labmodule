'use strict';

const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;


let TransactionSchema = new Schema({
  relatedAccounting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AccountingLists'
  },
  amount: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true
  },
  remark: {
    type: String
  },
  type: {
    type: String,
    enum: ['Debit', 'Credit'],
    // required:true,
  },
  relatedBank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AccountingLists',
  },
  relatedCash: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AccountingLists',
  },
  relatedExpense: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expenses'
  },
  relatedIncome: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Income'
  },
  treatmentFlag: {
    type: Boolean,
    // required:true
  },
  relatedTransaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transactions',
    default: null
  },
  isDeleted: {
    type: Boolean,
    // required:true,
    default: false
  },
  JEFlag: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Transactions', TransactionSchema);

//Author: Kyaw Zaw Lwin
