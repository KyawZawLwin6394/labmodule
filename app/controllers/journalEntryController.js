// relatedCreditAccount:id (credit)
// relatedDebitAccount:id (debit)'use strict';
const Transaction = require('../models/transaction')
const AccList = require('../models/accountingList');
exports.getAllJournals = async (req, res) => {
    let { keyword, role, limit, skip } = req.query;
    let count = 0;
    let page = 0;
    try {
        limit = +limit <= 100 ? +limit : 30; //limit
        skip = +skip || 0;
        let query = { isDeleted: false },
            regexKeyword;
        role ? (query['role'] = role.toUpperCase()) : '';
        keyword && /\w/.test(keyword)
            ? (regexKeyword = new RegExp(keyword, 'i'))
            : '';
        regexKeyword ? (query['name'] = regexKeyword) : '';
        let result = await Transaction.find(query).populate('relatedAccounting')
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

exports.getJournal = async (req, res) => {
    try {
        const result = await Transaction.find({ _id: req.params.id, isDeleted: false, JEFlag:true }).populate('relatedAccounting');
        if (!result)
            return res.status(500).json({ error: true, message: 'No Record Found' });
        return res.status(200).send({ success: true, data: result });
    } catch (error) {
        return res.status(500).send({ "error": true, message: error.message })
    }
};



exports.createJournal = async (req, res, next) => {
    console.log('journal')
    let { remark, fromAcc, toAcc, amount, date, fromAccType, toAccType,fromAccNature,toAccNature } = req.body;
    try {
        const firstTrans = await Transaction.create({
            relatedAccounting: fromAcc,
            amount: amount,
            date: date,
            remark: remark,
            type: fromAccType,
            JEFlag:true
        })

      
       
            if(fromAccType === fromAccNature){
                
              const accUpdate = await AccList.findOneAndUpdate(
                { _id: firstTrans.relatedAccounting._id },
                { $inc: { amount: firstTrans.amount } },
                { new: true },
              );
            }else{
              const accUpdate = await AccList.findOneAndUpdate(
                { _id: firstTrans.relatedAccounting._id },
                { $inc: { amount: -firstTrans.amount } },
                { new: true },
              );
            }
          

        const secondTrans = await Transaction.create({
            relatedAccounting: toAcc,
            amount: amount,
            date: date,
            remark: remark,
            type: toAccType,
            relatedTransaction: firstTrans._id,
            JEFlag:true
        })

        const relatedTrans = await Transaction.updateOne(
            { _id: firstTrans._id },
            { $set:
               {
                 relatedTransaction: secondTrans._id,
               }
            }
        )

       const secondAccount = await AccList.find({ _id: toAcc, isDeleted: false})

       
            if(toAccType === toAccNature){
              const accUpdate = await AccList.findOneAndUpdate(
                { _id: secondTrans.relatedAccounting._id },
                { $inc: { amount: secondTrans.amount } },
                { new: true },
              );
            }else{
              const accUpdate = await AccList.findOneAndUpdate(
                { _id: secondTrans.relatedAccounting._id },
                { $inc: { amount: -secondTrans.amount } },
                { new: true },
              );
            }
          

        // if(toAccType === "Debit"){
        //     const fromAccUpdate = await AccList.findOneAndUpdate(
        //         { _id: toAcc },
        //         { $inc: { amount: amount } },
        //         { new: true },
        //       );
        // }else if(toAccType === "Credit"){
        //     const fromAccUpdate = await AccList.findOneAndUpdate(
        //         { _id: toAcc },
        //         { $inc: { amount: -amount } },
        //         { new: true },
        //       );
        // }

        res.status(200).send({
            message: 'Journal create success',
            success: true,
            firstTrans: firstTrans,
            secondTrans: secondTrans
        });
    } catch (error) {
        return res.status(500).send({ "error": true, message: error.message })
    }
};

exports.updateJournal = async (req, res, next) => {
    console.log('journal')
    let { remark, firstTransId,secondTransId, fromPreAcc, toPreAcc,fromCurAcc, toCurAcc, preAmount,curAmount, date, fromPreAccType, toPreAccType,fromPreAccNature,toPreAccNature,fromCurAccType, toCurAccType,fromCurAccNature,toCurAccNature } = req.body;
    try {

        const firstUpdateTrans = await Transaction.findOneAndUpdate(
            { _id: firstTransId },
            { relatedAccounting: fromCurAcc, amount: curAmount, date: date, remark : remark, type: fromCurAccType },
            { new: true },
          );
        

      
       
            if(fromPreAccType === fromPreAccNature){
                
              const accUpdate = await AccList.findOneAndUpdate(
                { _id: fromPreAcc },
                { $inc: { amount: -preAmount } },
                { new: true },
              );
            }else{
              const accUpdate = await AccList.findOneAndUpdate(
                { _id: fromPreAcc },
                { $inc: { amount: preAmount } },
                { new: true },
              );
            }

            if(fromCurAccType === fromCurAccNature){
                
                const accUpdate = await AccList.findOneAndUpdate(
                  { _id: fromCurAcc },
                  { $inc: { amount: curAmount } },
                  { new: true },
                );
              }else{
                const accUpdate = await AccList.findOneAndUpdate(
                  { _id: fromCurAcc },
                  { $inc: { amount: -curAmount } },
                  { new: true },
                );
              }
          
              const secondUpdateTrans = await Transaction.findOneAndUpdate(
                { _id: secondTransId },
                { relatedAccounting: toCurAcc, amount: curAmount, date: date, remark : remark, type: toCurAccType,relatedTransaction: firstUpdateTrans._id },
                { new: true },
              );  
              

       

        const relatedTrans = await Transaction.updateOne(
            { _id: firstUpdateTrans._id },
            { $set:
               {
                 relatedTransaction: secondUpdateTrans._id,
               }
            }
        )

        if(toPreAccType === toPreAccNature){
                
            const accUpdate = await AccList.findOneAndUpdate(
              { _id: toPreAcc },
              { $inc: { amount: -preAmount } },
              { new: true },
            );
          }else{
            const accUpdate = await AccList.findOneAndUpdate(
              { _id: toPreAcc },
              { $inc: { amount: preAmount } },
              { new: true },
            );
          }

          if(toCurAccType === toCurAccNature){
              
              const accUpdate = await AccList.findOneAndUpdate(
                { _id: toCurAcc },
                { $inc: { amount: curAmount } },
                { new: true },
              );
            }else{
              const accUpdate = await AccList.findOneAndUpdate(
                { _id: toCurAcc },
                { $inc: { amount: -curAmount } },
                { new: true },
              );
            }

       

        res.status(200).send({
            message: 'Journal create success',
            success: true,
            firstTrans: firstUpdateTrans,
            secondTrans: secondUpdateTrans
        });
    } catch (error) {
        return res.status(500).send({ "error": true, message: error.message })
    }
};

exports.deleteJournal = async (req, res, next) => {
    try {

      //  const result = await Transaction.find({ _id: req.params.id, isDeleted: false, JEFlag:true }).populate('relatedAccounting').populate('relatedTransaction');

        //const secondTransId = result.relatedTransaction;
      
      const firstTrans = await Transaction.findOneAndUpdate(
        { _id: req.params.id },
        { isDeleted: true },
        { new: true },
      );

    //   if(result.relatedAccounting.accountNature === result.type){
    //     const accUpdate = await AccList.findOneAndUpdate(
    //         { _id: req.params.id },
    //         { $inc: { amount: -result.amount } },
    //         { new: true },
    //       );
    //   }else{
    //     const accUpdate = await AccList.findOneAndUpdate(
    //         { _id: req.params.id },
    //         { $inc: { amount: result.amount } },
    //         { new: true },
    //       );
    //   }



    //   const secondTrans = await Transaction.findOneAndUpdate(
    //     { _id: secondTransId },
    //     { isDeleted: true },
    //     { new: true },
    //   );


      return res.status(200).send({ success: true, data: { isDeleted: firstTrans.isDeleted } });
    } catch (error) {
      return res.status(500).send({ "error": true, "message": error.message })
  
    }
  }


