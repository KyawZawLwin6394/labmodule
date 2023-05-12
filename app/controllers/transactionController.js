'use strict';
const Transaction = require('../models/transaction');

exports.listAllTransactions = async (req, res) => {
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
    let result = await Transaction.find(query).limit(limit).skip(skip).populate('relatedAccounting').populate('relatedTransaction').populate('relatedBank').populate('relatedCash');
    console.log(result)
    count = await Transaction.find(query).count();
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

exports.getTransaction = async (req, res) => {
  const result = await Transaction.find({ _id: req.params.id,isDeleted:false }).populate('relatedAccounting').populate('relatedTransaction').populate('relatedBank').populate('relatedCash');
  if (!result)
    return res.status(500).json({ error: true, message: 'No Record Found' });
  return res.status(200).send({ success: true, data: result });
};

exports.getRelatedTransaction = async (req, res) => {
  const result = await Transaction.find({ relatedAccounting: req.params.id,isDeleted:false }).populate('relatedAccounting').populate('relatedTransaction').populate('relatedBank').populate('relatedCash');
  if (!result)
    return res.status(500).json({ error: true, message: 'No Record Found' });
  return res.status(200).send({ success: true, data: result });
};

exports.createTransaction = async (req, res, next) => {
  try {
    const newBody = req.body;
    const newTransaction = new Transaction(newBody);
    const result = await newTransaction.save();
    res.status(200).send({
      message: 'Transaction create success',
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).send({ "error": true, message: error.message })
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const result = await Transaction.findOneAndUpdate(
      { _id: req.body.id },
      req.body,
      { new: true },
    ).populate('relatedAccounting').populate('relatedTreatment').populate('relatedBank').populate('relatedCash');
    return res.status(200).send({ success: true, data: result });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    const result = await Transaction.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: true },
      { new: true },
    );
    return res.status(200).send({ success: true, data: { isDeleted: result.isDeleted } });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })

  }
}

exports.activateTransaction = async (req, res, next) => {
  try {
    const result = await Transaction.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: false },
      { new: true },
    );
    return res.status(200).send({ success: true, data: { isDeleted: result.isDeleted } });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })
  }
};

exports.trialBalance = async (req,res) => {
  const {id} = req.params
  let netType = '';
  let netAmount = 0;
  try{
    const debit = await Transaction.find({relatedAccounting:id, type:'Debit'})
    // if (debit.length === 0) return res.status(500).send({error:true, message:'Debit Data Not Found!'})
    const totalDebit = debit.reduce((acc, curr) => acc+ Number.parseInt(curr.amount), 0);

    const credit = await Transaction.find({relatedAccounting:id, type:'Credit'})
    // if (credit.length === 0) return res.status(500).send({error:true, message:'Credit Data Not Found!'})
    const totalCredit = credit.reduce((acc, curr) => acc+ Number.parseInt(curr.amount), 0);

    if (totalDebit === totalDebit) {
      netType = null
      netAmount = 0
    }

    netAmount = totalDebit- totalCredit
    if (netAmount > 0) netType = 'Debit'
    if (netAmount < 0) netType = 'Credit'
    
    return res.status(200).send({success:true, totalDebit:totalDebit, totalCredit:totalCredit, netAmount:netAmount, netType:netType})
  } catch (err) {
    return res.status(500).send({error:true, message:err.message})
  }
}
