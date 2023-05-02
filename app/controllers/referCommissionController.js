'use strict';
const ReferCommission = require('../models/refercommission');

exports.listAllReferCommissions = async (req, res) => {
  try {
    let result = await ReferCommission.find({isDeleted:false}).populate('relatedCategory').populate('referDoctor').populate('referCommission.item_id');
    let count = await ReferCommission.find({isDeleted:false}).count();
    res.status(200).send({
      success: true,
      count: count,
      data: result
    });
  } catch (error) {
    return res.status(500).send({ error:true, message:'No Record Found!'});
  }
};

exports.getReferCommission = async (req, res) => {
  const result = await ReferCommission.find({ _id: req.params.id,isDeleted:false }).populate('relatedCategory').populate('referDoctor').populate('referCommission.item_id');
  if (!result)
    return res.status(500).json({ error: true, message: 'No Record Found' });
  return res.status(200).send({ success: true, data: result });
};

exports.getReferCommissionByDoctorID = async (req, res) => {
  const result = await ReferCommission.find({ relatedDoctor: req.params.id,isDeleted:false }).populate('relatedCategory').populate('referDoctor').populate('referCommission.item_id');
  if (result.length === 0)
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
