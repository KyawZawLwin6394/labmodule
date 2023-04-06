'use strict';
const Supplier = require('../models/supplier');

exports.listAllSuppliers = async (req, res) => {
  try {
    let result = await Supplier.find({isDeleted:false});
    let count = await Supplier.find({isDeleted:false}).count();
    res.status(200).send({
      success: true,
      count: count,
      data: result
    });
  } catch (error) {
    return res.status(500).send({ error:true, message:'No Record Found!'});
  }
};

exports.getSupplier = async (req, res) => {
  const result = await Supplier.find({ _id: req.params.id,isDeleted:false });
  if (!result)
    return res.status(500).json({ error: true, message: 'No Record Found' });
  return res.status(200).send({ success: true, data: result });
};

exports.createSupplier = async (req, res, next) => {
  try {
    const newSupplier = new Supplier(req.body);
    const result = await newSupplier.save();
    res.status(200).send({
      message: 'Supplier create success',
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).send({ "error": true, message: error.message })
  }
};

exports.updateSupplier = async (req, res, next) => {
  try {
    const result = await Supplier.findOneAndUpdate(
      { _id: req.body.id },
      req.body,
      { new: true },
    );
    return res.status(200).send({ success: true, data: result });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })
  }
};

exports.deleteSupplier = async (req, res, next) => {
  try {
    const result = await Supplier.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: true },
      { new: true },
    );
    return res.status(200).send({ success: true, data: { isDeleted: result.isDeleted } });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })

  }
};

exports.activateSupplier = async (req, res, next) => {
  try {
    const result = await Supplier.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: false },
      { new: true },
    );
    return res.status(200).send({ success: true, data: { isDeleted: result.isDeleted } });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })
  }
};
