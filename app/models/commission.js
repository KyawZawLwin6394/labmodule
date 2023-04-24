'use strict';

const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;

let CommissionSchema = new Schema({
    createdDate: {
        type: Date,
        default: Date.now
    },
    relatedDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Doctors',
        required: true,
    },
    relatedVoucher: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Vouchers',
        required:true
    },
    totalCommission:{
        type:Number,
        required:true
    },
    relatedPatient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Patients',
        required:true
    }
});

module.exports = mongoose.model('Commissions', CommissionSchema);
