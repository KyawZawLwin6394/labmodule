'use strict';

const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;

let ReferCommissionSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    relatedDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Doctors',
        required: true,
    },
    date: {
        type: String,
        required:true
    },
    collected:{
        type:Boolean,
        required:true
    },
    collectDate: {
        type:Date
    },
    remark:{
        type:String
    }
});

module.exports = mongoose.model('ReferCommissions', ReferCommissionSchema);
