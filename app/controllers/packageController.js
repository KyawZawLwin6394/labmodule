'use strict';
const Package = require('../models/package');

exports.listAllPackages = async (req, res) => {
  try {
    let result = await Package.find({isDeleted:false}).populate('supplier');
    let count = await Package.find({isDeleted:false}).count();
    res.status(200).send({
      success: true,
      count: count,
      data: result
    });
  } catch (error) {
    return res.status(500).send({ error:true, message:'No Record Found!'});
  }
};

exports.getPackage = async (req, res) => {
  const result = await Package.find({ _id: req.params.id,isDeleted:false }).populate('relatedCategory').populate('referDoctor').populate('package.item_id');
  if (!result)
    return res.status(500).json({ error: true, message: 'No Record Found' });
  return res.status(200).send({ success: true, data: result });
};

exports.createPackage = async (req, res, next) => {
  try {
    const newBody = req.body;
    const newPackage = new Package(newBody);
    const result = await newPackage.save();
    res.status(200).send({
      message: 'Package create success',
      success: true,
      data: result
    });
  } catch (error) {
    console.log(error )
    return res.status(500).send({ "error": true, message: error.message })
  }
};

exports.updatePackage = async (req, res, next) => {
  try {
    const result = await Package.findOneAndUpdate(
      { _id: req.body.id },
      req.body,
      { new: true },
    ).populate('relatedCategory').populate('referDoctor').populate('package.item_id');
    return res.status(200).send({ success: true, data: result });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })
  }
};

exports.deletePackage = async (req, res, next) => {
  try {
    const result = await Package.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: true },
      { new: true },
    );
    return res.status(200).send({ success: true, data: { isDeleted: result.isDeleted } });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })

  }
}

exports.activatePackage = async (req, res, next) => {
  try {
    const result = await Package.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: false },
      { new: true },
    );
    return res.status(200).send({ success: true, data: { isDeleted: result.isDeleted } });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })
  }
};
