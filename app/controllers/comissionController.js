'use strict';
const Commission = require('../models/commission');
const ComissionPay = require('../models/commissionPay');
const { ObjectId } = require('mongodb');

exports.searchCommission = async (req, res) => {
    let total = 0
    try {
        const { month, doctor } = req.query;
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

        // Check if the provided month value is valid
        // if (!months.includes(month)) {
        //     return res.status(400).json({ error: 'Invalid month' });
        // }

        // Get the start and end dates for the specified month
        const startDate = new Date(Date.UTC(new Date().getFullYear(), months.indexOf(month), 1));
        const endDate = new Date(Date.UTC(new Date().getFullYear(), months.indexOf(month) + 1, 1));
        console.log(startDate, endDate)
        let query =  {}
        //{ status: 'Unclaimed' }
        if (month) query.createdDate = { $gte: startDate, $lte: endDate }
        if (doctor) query.relatedDoctor = doctor
        console.log(query)
        const result = await Commission.find(query)
        // .populate('relatedDoctor relatedVoucher relatedPatient')
        for (let i = 0; i < result.length; i++) {
            total = result[i].totalCommission + total
        }

        return res.status(200).send({ success: true, data: result, collectAmount: total, startDate: startDate, endDate: endDate })
    } catch (e) {
        return res.status(500).send({ error: true, message: e.message });
    }
};

exports.collectComission = async (req, res) => {
    try {
        let { update, startDate, endDate, collectAmount, remark, relatedDoctor } = req.body
        // Convert string IDs to MongoDB ObjectIds
        const objectIds = update.map((id) => ObjectId(id));

        // Perform the update operation
        const updateResult = await Commission.updateMany(
            { _id: { $in: objectIds } }, // Use $in operator to match multiple IDs
            { status: 'Claimed' },
            { new: true }
        );
        const cPayResult = await ComissionPay.create({
            startDate: startDate,
            endDate: endDate,
            collectAmount: collectAmount,
            remark: remark,
            relatedDoctor: relatedDoctor
        })
        return res.status(200).send({ success: true, updateResult: updateResult, comissionPayResult: cPayResult })
    } catch (e) {
        return res.status(500).send({ error: true, message: e.message });
    }
}