'use strict';

const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;
const validator = require('validator');


let VoucherSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true
    },
    referDoctor :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctors',
        required:true
    },
    options:{
      type:String,
      enum:['Collect','Email']  
    },
    stockUnit: [{
        unitName: String,
        stock: String,
        purchasePrice: Number
    }],
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Suppliers',
        required: true,
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
    }
});

module.exports = mongoose.model('Vouchers', VoucherSchema);

//Author: Kyaw Zaw Lwin
