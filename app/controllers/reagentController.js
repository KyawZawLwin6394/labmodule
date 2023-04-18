'use strict';
const Reagent = require('../models/reagent');

exports.listAllReagents = async (req, res) => {
  try {
    let result = await Reagent.find({isDeleted:false}).populate('supplier');
    let count = await Reagent.find({isDeleted:false}).count();
    res.status(200).send({
      success: true,
      count: count,
      data: result
    });
  } catch (error) {
    return res.status(500).send({ error:true, message:'No Record Found!'});
  }
};



exports.getReagent = async (req, res) => {
  const result = await Reagent.find({ _id: req.params.id,isDeleted:false }).populate('supplier');
  if (!result)
    return res.status(500).json({ error: true, message: 'No Record Found' });
  return res.status(200).send({ success: true, data: result[0] });
};

exports.createReagent = async (req, res, next) => {
  try {
    const newReagent = new Reagent(req.body);
    const result = await newReagent.save();
    res.status(200).send({
      message: 'Reagent create success',
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).send({ "error": true, message: error.message })
  }
};

exports.updateReagent = async (req, res, next) => {
  try {
    const result = await Reagent.findOneAndUpdate(
      { _id: req.body.id },
      req.body,
      { new: true },
    ).populate('supplier');
    return res.status(200).send({ success: true, data: result });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })
  }
};

exports.deleteReagent = async (req, res, next) => {
  try {
    const result = await Reagent.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: true },
      { new: true },
    );
    return res.status(200).send({ success: true, data: { isDeleted: result.isDeleted } });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })

  }
};

exports.activateReagent = async (req, res, next) => {
  try {
    const result = await Reagent.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: false },
      { new: true },
    );
    return res.status(200).send({ success: true, data: { isDeleted: result.isDeleted } });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })
  }
};
