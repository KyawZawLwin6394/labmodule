'use strict';
const Transaction = require('../models/transaction');
const AccountingList = require('../models/accountingList')

exports.listAllTransactions = async (req, res) => {
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
    let result = await Transaction.find(query).skip(skip).populate('relatedAccounting').populate('relatedTransaction').populate('relatedBank').populate('relatedCash');
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
  const result = await Transaction.find({ _id: req.params.id, isDeleted: false }).populate('relatedAccounting').populate('relatedTransaction').populate('relatedBank').populate('relatedCash');
  if (!result)
    return res.status(500).json({ error: true, message: 'No Record Found' });
  return res.status(200).send({ success: true, data: result });
};

exports.getRelatedTransaction = async (req, res) => {
  const result = await Transaction.find({ relatedAccounting: req.params.id, isDeleted: false }).populate('relatedAccounting').populate('relatedTransaction').populate('relatedBank').populate('relatedCash');
  if (!result)
    return res.status(500).json({ error: true, message: 'No Record Found' });
  return res.status(200).send({ success: true, data: result });
};

exports.getRelatedTransactions = async (req, res, next) => {
  const result = await Transaction.find({ relatedAccounting: { "$in": [req.body.account, req.body.bankorcash] }, isDeleted: false }).populate('relatedAccounting').populate('relatedTransaction').populate('relatedBank').populate('relatedCash');
  if (!result)
    return res.status(500).json({ error: true, message: 'No Record Found' });
  return res.status(200).send({ success: true, data: result });
};

exports.getRelatedTransactionExpense = async (req, res) => {
  const result = await Transaction.find({ relatedExpense: req.params.id, isDeleted: false }).populate('relatedAccounting').populate('relatedTransaction').populate('relatedBank').populate('relatedCash').populate('relatedExpense');
  if (!result)
    return res.status(500).json({ error: true, message: 'No Record Found' });
  return res.status(200).send({ success: true, data: result });
};

exports.getRelatedTransactionIncome = async (req, res) => {
  const result = await Transaction.find({ relatedIncome: req.params.id, isDeleted: false }).populate('relatedAccounting').populate('relatedTransaction').populate('relatedBank').populate('relatedCash').populate('relatedIncome');
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

exports.trialBalance = async (req, res) => {
  let finalResult = []
  let { start, end } = req.query
  try {
    const allAccounts = await AccountingList.find({}).populate('relatedType')
    for (let i = 0; i < allAccounts.length; i++) {
      const id = allAccounts[i]._id
      let netType = '';
      let netAmount = 0;
      console.log(id)
      const debit = await Transaction.find({ relatedAccounting: id, type: 'Debit', date: { $gte: start, $lte: end } })
      // if (debit.length === 0) return res.status(500).send({error:true, message:'Debit Data Not Found!'})
      const totalDebit = debit.reduce((acc, curr) => acc + Number.parseInt(curr.amount), 0);

      const credit = await Transaction.find({ relatedAccounting: id, type: 'Credit', date: { $gte: start, $lte: end } })
      // if (credit.length === 0) return res.status(500).send({error:true, message:'Credit Data Not Found!'})
      const totalCredit = credit.reduce((acc, curr) => acc + Number.parseInt(curr.amount), 0);

      if (totalDebit === totalDebit) {
        netType = null
        netAmount = 0
      }
      netAmount = totalDebit - totalCredit
      if (netAmount > 0) netType = 'Debit'
      if (netAmount < 0) netType = 'Credit'
      finalResult.push({ totalCredit: totalCredit, totalDebit: totalDebit, netType: netType, netAmount: netAmount, accName: allAccounts[i].name, type: allAccounts[i].relatedType })
    }
    if (allAccounts.length === finalResult.length) return res.status(200).send({ success: true, data: finalResult })
  } catch (err) {
    return res.status(500).send({ error: true, message: err.message })
  }
}

exports.trialBalanceWithType = async (req, res) => {
  let finalResult = []
  let { start, end, type } = req.query
  try {
    const allAccounts = await AccountingList.find({ relatedType: type }).populate('relatedType')
    for (let i = 0; i < allAccounts.length; i++) {
      const id = allAccounts[i]._id
      let netType = '';
      let netAmount = 0;
      const debit = await Transaction.find({ relatedAccounting: id, type: 'Debit', date: { $gte: start, $lte: end } })
      // if (debit.length === 0) return res.status(500).send({error:true, message:'Debit Data Not Found!'})
      const totalDebit = debit.reduce((acc, curr) => acc + Number.parseInt(curr.amount), 0);

      const credit = await Transaction.find({ relatedAccounting: id, type: 'Credit', date: { $gte: start, $lte: end } })
      // if (credit.length === 0) return res.status(500).send({error:true, message:'Credit Data Not Found!'})
      const totalCredit = credit.reduce((acc, curr) => acc + Number.parseInt(curr.amount), 0);

      if (totalDebit === totalDebit) {
        netType = null
        netAmount = 0
      }
      netAmount = totalDebit - totalCredit
      if (netAmount > 0) netType = 'Debit'
      if (netAmount < 0) netType = 'Credit'
      finalResult.push({ totalCredit: totalCredit, totalDebit: totalDebit, netType: netType, netAmount: netAmount, accName: allAccounts[i].name, type: allAccounts[i].relatedType })
    }
    if (allAccounts.length === finalResult.length) return res.status(200).send({ success: true, data: finalResult })
  } catch (err) {
    return res.status(500).send({ error: true, message: err.message })
  }
}

// exports.trialBalance = async (req, res) => {
//   try {
//     const { start, end } = req.query;
//     const allAccounts = await AccountingList.find({}).populate('relatedType');

//     const finalResult = await Promise.all(
//       allAccounts.map(async (account) => {
//         const id = account._id;

//         const debit = await Transaction.aggregate([
//           {
//             $match: {
//               relatedAccounting: id,
//               type: 'Debit',
//               date: { $gte: start, $lte: end }
//             }
//           },
//           {
//             $group: {
//               _id: null,
//               totalDebit: { $sum: { $convert: { input: '$amount', to: 'decimal' } } }
//             }
//           }
//         ]);

//         const totalDebit = debit.length > 0 ? debit[0].totalDebit : 0;

//         const credit = await Transaction.aggregate([
//           {
//             $match: {
//               relatedAccounting: id,
//               type: 'Credit',
//               date: { $gte: start, $lte: end }
//             }
//           },
//           {
//             $group: {
//               _id: null,
//               totalCredit: { $sum: { $convert: { input: '$amount', to: 'decimal' } } }
//             }
//           }
//         ]);

//         const totalCredit = credit.length > 0 ? credit[0].totalCredit : 0;

//         let netType = null;
//         let netAmount = totalDebit - totalCredit;

//         if (netAmount > 0) {
//           netType = 'Debit';
//         } else if (netAmount < 0) {
//           netType = 'Credit';
//         }

//         return {
//           totalCredit,
//           totalDebit,
//           netType,
//           netAmount,
//           accName: account.name,
//           type: account.relatedType
//         };
//       })
//     );

//     return res.status(200).send({ success: true, data: finalResult });
//   } catch (err) {
//     return res.status(500).send({ error: true, message: err.message });
//   }
// };


