'use strict';
const Service = require('../models/services');

exports.listAllServices = async (req, res) => {
  try {
    let result = await Service.find({isDeleted:false}).populate('relatedCategory').populate('referDoctor').populate('reagentItems.item_id')
    let count = await Service.find({isDeleted:false}).count();
    res.status(200).send({
      success: true,
      count: count,
      data: result
    });
  } catch (error) {
    return res.status(500).send({ error:true, message:'No Record Found!'});
  }
};

exports.getService = async (req, res) => {
  const result = await Service.find({ _id: req.params.id,isDeleted:false }).populate('relatedCategory').populate('referDoctor').populate('reagentItems.item_id')
  if (!result)
    return res.status(500).json({ error: true, message: 'No Record Found' });
  return res.status(200).send({ success: true, data: result[0] });
};

exports.createService = async (req, res, next) => {
  try {
    const newBody = req.body;
    const newService = new Service(newBody);
    const result = await newService.save();
    res.status(200).send({
      message: 'Service create success',
      success: true,
      data: result
    });
  } catch (error) {
    console.log(error )
    return res.status(500).send({ "error": true, message: error.message })
  }
};

exports.updateService = async (req, res, next) => {
  try {
    const result = await Service.findOneAndUpdate(
      { _id: req.body.id },
      req.body,
      { new: true },
    ).populate('relatedCategory').populate('referDoctor').populate('reagentItems.item_id');
    return res.status(200).send({ success: true, data: result });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })
  }
};

exports.deleteService = async (req, res, next) => {
  try {
    const result = await Service.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: true },
      { new: true },
    );
    return res.status(200).send({ success: true, data: { isDeleted: result.isDeleted } });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })

  }
}

exports.activateService = async (req, res, next) => {
  try {
    const result = await Service.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: false },
      { new: true },
    );
    return res.status(200).send({ success: true, data: { isDeleted: result.isDeleted } });
  } catch (error) {
    return res.status(500).send({ "error": true, "message": error.message })
  }
};
