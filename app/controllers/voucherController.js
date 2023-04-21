'use strict';
const Voucher = require('../models/voucher');

exports.listAllVouchers = async (req, res) => {
  let { keyword, role, limit, skip } = req.query;
  let count = 0;
  let page = 0;
  try {
    limit = +limit <= 100 ? +limit : 10; //limit
    skip = +skip || 0;
    let query = {isDeleted:false},
      regexKeyword;
    role ? (query['role'] = role.toUpperCase()) : '';
    keyword && /\w/.test(keyword)
      ? (regexKeyword = new RegExp(keyword, 'i'))
      : '';
    regexKeyword ? (query['name'] = regexKeyword) : '';
    let result = await Voucher.find(query).limit(limit).skip(skip).populate('relatedPatient').populate('referDoctor');
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
  const result = await Voucher.find({ _id: req.params.id,isDeleted:false }).populate('relatedPatient').populate('referDoctor')
  if (!result)
    return res.status(500).json({ error: true, message: 'No Record Found' });
  return res.status(200).send({ success: true, data: result[0] });
};

exports.createVoucher = async (req, res, next) => {
  try {
    const newBody = req.body;
    const newVoucher = new Voucher(newBody);
    const result = await newVoucher.save();
    res.status(200).send({
      message: 'Voucher create success',
      success: true,
      data: result
    });
  } catch (error) {
    console.log(error )
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