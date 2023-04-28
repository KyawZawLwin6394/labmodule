'use strict';
const Voucher = require('../models/voucher');
const Patient = require('../models/patient');
const Commission = require('../models/commission');

async function handleCommission(data) {
  const voucherResult = await Voucher.findOne({ _id: data._id, isDeleted: false }).populate([
    { path: 'relatedPatient' },
    { path: 'referDoctor' },
    { path: 'testSelection.name' },
  ]);
  const totalRefer = calculateTotalRefer(voucherResult.testSelection);
  return totalRefer;
}

function calculateTotalRefer(testSelection) {
  let totalRefer = 0;
  testSelection.forEach((element) => {
    if (element.name && element.name.referAmount) {
      totalRefer += element.name.referAmount;
    }
  });
  return totalRefer;
}

async function checkStatus(data) {
  const [statusResult] = await Voucher.find({ "_id": data.voucherID, isDeleted: false })
    .populate('relatedPatient')
    .populate('referDoctor')
    .populate('testSelection.name');

  if (statusResult.length === 0) return res.status(500).send({ error: true, message: 'No Record Found!' });

  const completedCount = statusResult.testSelection.filter(element => element.result).length;
  const totalCount = statusResult.testSelection.length;
  const status = completedCount === totalCount
    ? 'Finished'
    : completedCount === 0
      ? 'Pending'
      : 'In Progress';

  return status;
}

exports.listAllVouchers = async (req, res) => {
  const { keyword, role, limit = 10, skip = 0 } = req.query;
  try {
    const isRoleProvided = !!role;
    const isKeywordProvided = keyword && /\w/.test(keyword);
    const query = {
      isDeleted: false,
      ...(isRoleProvided && { role: role.toUpperCase() }),
      ...(isKeywordProvided && { name: new RegExp(keyword, 'i') }),
    };

    const [vouchers, count] = await Promise.all([
      Voucher.find(query).limit(+limit).skip(+skip)
        .populate('relatedPatient referDoctor testSelection.name'),
      Voucher.countDocuments(query)
    ]);
    const pageCount = Math.ceil(count / +limit);
    res.status(200).send({
      success: true,
      count,
      _metadata: {
        current_page: +skip / +limit + 1,
        per_page: +limit,
        page_count: pageCount,
        total_count: count,
      },
      data: vouchers
    });
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};


exports.getVoucher = async (req, res) => {
  const result = await Voucher.find({ _id: req.params.id, isDeleted: false }).populate('relatedPatient').populate('referDoctor').populate('testSelection.name')
  if (!result)
    return res.status(500).json({ error: true, message: 'No Record Found' });
  return res.status(200).send({ success: true, data: result[0] });
};

exports.createVoucher = async (req, res, next) => {
  try {
    const newBody = req.body;
    const newVoucher = new Voucher(newBody);
    const result = await newVoucher.save();
    // handling commission
    const commissionResult = await handleCommission(result)
    const newCommission = new Commission({
      "relatedDoctor": req.body.referDoctor,
      "relatedVoucher": result._id,
      "totalCommission": commissionResult,
      "relatedPatient": req.body.relatedPatient
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
      commission: commissionSave
    });
  } catch (error) {
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
    ).populate('relatedPatient').populate('referDoctor').populate('testSelection.name')

    const statusResult = await checkStatus(req.body)

    const statusUpdate = await Voucher.findOneAndUpdate(
      { _id: req.body.voucherID },
      { $set: { status: statusResult } },
      { new: true },
    ).populate('relatedPatient').populate('referDoctor').populate('testSelection.name')
    return res.status(200).send({ success: true, data: statusUpdate });
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
  const result = await Patient.find({ _id: req.params.patientid, isDeleted: false }).populate('relatedVoucher').populate('relatedPatient').populate('referDoctor').populate('testSelection.name')
  if (!result)
    return res.status(500).json({ error: true, message: 'No Record Found' });
  return res.status(200).send({ success: true, data: result[0] });
};

exports.getTodaysVoucher = async (req, res) => {
  try {
    const result = await Voucher.find({ createdAt: { $gte: new Date(new Date().setHours("0", 0, 0)), $lt: new Date(new Date().setHours("23", 59, 59)) } })
      .populate('relatedPatient').populate('referDoctor').populate('testSelection.name')
    if (result.length === 0) return res.status(404).json({ error: true, message: 'No Record Found!' })
    return res.status(200).send({ success: true, data: result })
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message })
  }
}