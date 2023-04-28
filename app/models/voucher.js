'use strict';

const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;


let VoucherSchema = new Schema({
    code: {
        type: String,
    },
    date: {
        type: Date,
    },
    relatedPatient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patients',
    },
    referDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctors',
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
        },
        remark:{
            type:String,
            default:null
        }
    }],
    totalCharge: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    netDiscount: {
        type: Number,
    },
    pay: {
        type: Number,
    },
    change: {
        type: Number,
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
    comment:{
        type:String
    },
    status:{
        type:String,
        enum:['Pending','In Progress','Finished']
    }
});

module.exports = mongoose.model('Vouchers', VoucherSchema);

//Author: Kyaw Zaw Lwin
