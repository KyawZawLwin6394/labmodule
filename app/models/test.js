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
    relatedPatient : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Patients',
        required:true
    },
    referDoctor :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctors',
        required:true
    },
    testResultList: [{
        name:String,
        result:String,
        nominalValue:String,
        unit:Number
    }],
    draft:{
        type:Boolean,
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
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('Vouchers', VoucherSchema);

//Author: Kyaw Zaw Lwin