'use strict';

const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;


let UsageRecordSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now()
    },
    relatedUsage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usages'
    },
    usageStatus: {
        type: String,
        enum: ['Pending', 'In Progress', 'Finished']
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
        default: false,
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
    }]
});

module.exports = mongoose.model('UsageRecords', UsageRecordSchema);

//Author: Kyaw Zaw Lwin
