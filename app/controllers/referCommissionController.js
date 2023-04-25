'use strict';
const ReferCommission = require('../models/referCommission');

exports.listAllReferCommissions = async (req, res) => {
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
    let result = await ReferCommission.find(query).limit(limit).skip(skip).populate('relatedCategory').populate('referDoctor').populate('referCommission.item_id');
    count = await ReferCommission.find(query).limit(limit).skip(skip).count();
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
      list: result,
    });
  } catch (e) {
    return res.status(500).send({ error: true, message: e.message });
  }
};

exports.getReferCommission = async (req, res) => {
  const result = await ReferCommission.find({ _id: req.params.id,isDeleted:false }).populate('relatedCategory').populate('referDoctor').populate('referCommission.item_id');
  if (!result)
    return res.status(500).json({ error: true, message: 'No Record Found' });
  return res.status(200).send({ success: true, data: result });
};

exports.createReferCommission = async (req, res, next) => {
  try {
    const newBody = req.body;
    const newReferCommission = new ReferCommission(newBody);
    const result = await newReferCommission.save();
    res.status(200).send({
      message: 'ReferCommission create success',
      success: true,
      data: result
    });
  } catch (error) {
    console.log(error )
    return res.status(500).send({ "error": true, message: error.message })
  }
};

exports.updateReferCommission = async (req, res, next) => {
  try {
    const result = await ReferCommission.findOneAndUpdate(
      { _id: req.body.id },
      req.body,
      { new: true },
    ).populate('relatedCategory').populate('referDoctor').populate('referCommission.item_id');
    return res.status(200).send({ success: true, data: result });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })
  }
};

exports.deleteReferCommission = async (req, res, next) => {
  try {
    const result = await ReferCommission.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: true },
      { new: true },
    );
    return res.status(200).send({ success: true, data: { isDeleted: result.isDeleted } });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })

  }
}

exports.activateReferCommission = async (req, res, next) => {
  try {
    const result = await ReferCommission.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: false },
      { new: true },
    );
    return res.status(200).send({ success: true, data: { isDeleted: result.isDeleted } });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })
  }
};
