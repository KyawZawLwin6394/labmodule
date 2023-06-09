'use strict';
const AccountSubHeader = require('../models/accountSubHeader');

exports.listAllAccountSubHeaders = async (req, res) => {
  let { keyword, role, limit, skip } = req.query;
  let count = 0;
  let page = 0;
  try {
    limit = +limit <= 100 ? +limit : 20; //limit
    skip = +skip || 0;
    let query = {isDeleted:false},
      regexKeyword;
    role ? (query['role'] = role.toUpperCase()) : '';
    keyword && /\w/.test(keyword)
      ? (regexKeyword = new RegExp(keyword, 'i'))
      : '';
    regexKeyword ? (query['name'] = regexKeyword) : '';
    let result = await AccountSubHeader.find(query).limit(limit).skip(skip).populate('relatedAccountType').populate('relatedAccountHeader');
    count = await AccountSubHeader.find(query).count();
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

exports.getAccountSubHeader = async (req, res) => {
  const result = await AccountSubHeader.find({ _id: req.params.id,isDeleted:false }).populate('relatedAccountType').populate('relatedAccountHeader');
  if (!result)
    return res.status(500).json({ error: true, message: 'No Record Found' });
  return res.status(200).send({ success: true, data: result });
};

exports.getRelatedAccountSubHeader = async (req, res) => {
  const result = await AccountSubHeader.find({ relatedAccountHeader: req.params.id,isDeleted:false }).populate('relatedAccountType').populate('relatedAccountHeader');
  if (!result)
    return res.status(500).json({ error: true, message: 'No Record Found' });
  return res.status(200).send({ success: true, data: result });
};

exports.createAccountSubHeader = async (req, res, next) => {
  try {
    const newBody = req.body;
    const newAccountSubHeader = new AccountSubHeader(newBody);
    const result = await newAccountSubHeader.save();
    res.status(200).send({
      message: 'AccountHeader create success',
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).send({ "error": true, message: error.message })
  }
};

exports.updateAccountSubHeader = async (req, res, next) => {
  try {
    const result = await AccountSubHeader.findOneAndUpdate(
      { _id: req.body.id },
      req.body,
      { new: true },
    ).populate('relatedAccountHeader');
    return res.status(200).send({ success: true, data: result });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })
  }
};

exports.deleteAccountSubHeader = async (req, res, next) => {
  try {
    const result = await AccountSubHeader.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: true },
      { new: true },
    );
    return res.status(200).send({ success: true, data: { isDeleted: result.isDeleted } });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })
  }
}

exports.activateAccountSubHeader = async (req, res, next) => {
  try {
    const result = await AccountSubHeader.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: false },
      { new: true },
    );
    return res.status(200).send({ success: true, data: { isDeleted: result.isDeleted } });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })
  }
};
