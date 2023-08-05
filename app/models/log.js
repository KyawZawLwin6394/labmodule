'use strict';

const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;


let LogSchema = new Schema({
    relatedReagent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reagents'
    },
    relatedService: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Services'
    },
    date: {
        type: Date,
        default: Date.now
    },
    currentQty: {
        type: Number,
    },
    actualQty: {
        type: Number,
    },
    finalQty: {
        type: Number,
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    type: {
        type: String,
        enum: ['Stock Transfer', 'Usage', 'Request Recieved', 'Stock Update', 'Medicine Sale']
    }
});

module.exports = mongoose.model('Logs', LogSchema);

//Author: Kyaw Zaw Lwin
