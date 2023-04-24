'use strict';

const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;


let VoucherSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true
    },
    relatedPatient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patients',
        required: true
    },
    referDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctors',
        required: true
    },
    options: {
        type: String,
        enum: ['Collect', 'Email']
    },
    testSelection: [{
        name: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Services'
        },
        qty: Number,
        unitCharge: Number,
        subCharge: Number,
        result:{
            type:String,
            default:null
        }
    }],
    totalCharge: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    netDiscount: {
        type: Number,
        required: true
    },
    pay: {
        type: Number,
        required: true
    },
    change: {
        type: Number,
        required: true
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
