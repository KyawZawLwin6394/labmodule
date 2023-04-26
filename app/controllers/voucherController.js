'use strict';
const Voucher = require('../models/voucher');
const Patient = require('../models/patient');
const Commission = require('../models/commission');

exports.listAllVouchers = async (req, res) => {
  let { keyword, role, limit, skip } = req.query;
  let count = 0;
  let page = 0;
  try {
    limit = +limit <= 100 ? +limit : 10; //limit
    skip = +skip || 0;
    let query = { isDeleted: false },
      regexKeyword;
    role ? (query['role'] = role.toUpperCase()) : '';
    keyword && /\w/.test(keyword)
      ? (regexKeyword = new RegExp(keyword, 'i'))
      : '';
    regexKeyword ? (query['name'] = regexKeyword) : '';
    let result = await Voucher.find(query).limit(limit).skip(skip).populate('relatedPatient').populate('referDoctor').populate('testSelection.name')
    count = await Voucher.find(query).count();
    const division = count / limit;
    page = Math.ceil(division);

    res.status(200).send({
      success: true,
      count: count,
      _metadata: {
        current_page: skip / limit + 1,
        per_page: limit,
        page_count: page,
        total_count: count,
      },
      data: result,
    });
  } catch (e) {
    return res.status(500).send({ error: true, message: e.message });
  }
};

exports.getVoucher = async (req, res) => {
  const result = await Voucher.find({ _id: req.params.id, isDeleted: false }).populate('relatedPatient').populate('referDoctor').populate('testSelection.name')
  if (!result)
    return res.status(500).json({ error: true, message: 'No Record Found' });
  return res.status(200).send({ success: true, data: result[0] });
};

async function handleCommission(data) {
  const voucherResult = await Voucher.find({ _id: data._id, isDeleted: false }).populate('relatedPatient').populate('referDoctor').populate('testSelection.name')
  let totalRefer = 0
  voucherResult[0].testSelection.map(function (element, index) {
    console.log(element)
    if (element.name) {
      totalRefer = totalRefer + element.name.referAmount
    }
  })
  return totalRefer
}

exports.createVoucher = async (req, res, next) => {
  try {
    const newBody = req.body;
    const newVoucher = new Voucher(newBody);
    const result = await newVoucher.save();
    // handling commission
    const commissionResult = await handleCommission(result)
    const newCommission = new Commission({
      "relatedDoctor":req.body.referDoctor,
      "relatedVoucher":result._id,
      "totalCommission":commissionResult,
      "relatedPatient":req.body.relatedPatient
    })
    const commissionSave = await newCommission.save()
    // end of handleCommission
    const patientResult = await Patient.updateOne(
      { _id: req.body.patientID },
      { $push: { relatedVoucher: result._id } }
    )
    res.status(200).send({
      message: 'Voucher create success',
      success: true,
      data: result,
      patientData: patientResult,
      commission:commissionSave
    });
  } catch (error) {
    console.log(error)
    return res.status(500).send({ "error": true, message: error.message })
  }
};

exports.updateVoucher = async (req, res, next) => {
  try {
    const result = await Voucher.findOneAndUpdate(
      { _id: req.body.id },
      req.body,
      { new: true },
    ).populate('relatedPatient').populate('referDoctor');
    return res.status(200).send({ success: true, data: result });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })
  }
};

exports.updateRemarkAndResult = async (req, res, next) => {
  try {
    const result = await Voucher.updateOne(
      { "_id": req.body.voucherID, "testSelection._id": req.body.testSelectionID },
      { $set: { "testSelection.$.result": req.body.result, "testSelection.$.remark": req.body.remark } }
    ).populate('relatedPatient').populate('referDoctor');
    return res.status(200).send({ success: true, data: result });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })
  }
};

exports.deleteVoucher = async (req, res, next) => {
  try {
    const result = await Voucher.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: true },
      { new: true },
    );
    return res.status(200).send({ success: true, data: { isDeleted: result.isDeleted } });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })

  }
}

exports.activateVoucher = async (req, res, next) => {
  try {
    const result = await Voucher.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: false },
      { new: true },
    );
    return res.status(200).send({ success: true, data: { isDeleted: result.isDeleted } });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })
  }
};

exports.getRelatedVouchers = async (req, res) => {
  const result = await Patient.find({ _id: req.params.patientid, isDeleted: false }).populate('relatedVoucher')
  if (!result)
    return res.status(500).json({ error: true, message: 'No Record Found' });
  return res.status(200).send({ success: true, data: result[0] });
};

exports.getTodaysVoucher = async (req, res) => {
  try {
    var start = new Date();
    var end = new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    const result = await Voucher.find({ createdAt: { $gte: start, $lt: end } }).populate('relatedPatient').populate('referDoctor').populate('testSelection.name')
    if (result.length === 0) return res.status(404).json({ error: true, message: 'No Record Found!' })
    return res.status(200).send({ success: true, data: result })
  } catch (error) {
    return res.status(500).send({error:true, message:error.message})
  }
}