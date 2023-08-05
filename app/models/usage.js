'use strict';

const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;


let UsageSchema = new Schema({
  relatedService: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'relatedService',
    required: true
  },
  reagents: [{
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reagents'
    },
    stock: Number,
    actual: Number,
    remark: String,
    quantity: Number,
    perUsageQTY: Number
  }],
  isDeleted: {
    type: Boolean,
    required: true,
    default: false
  },
  reagentErrors: [{
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reagents'
    },
    stock: Number,
    actual: Number,
    remark: String,
    quantity: Number,
    perUsageQTY: Number
  }],
  usageStatus: {
    type: String,
    enum: ['Pending', 'In Progress', 'Finished']
  }
});

module.exports = mongoose.model('Usages', UsageSchema);

//Author: Kyaw Zaw Lwin
