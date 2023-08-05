'use strict';
const Service = require('../models/services');
const { ObjectId } = require("mongodb");
const Usage = require('../models/usage');
const UsageRecords = require('../models/usageRecord');
const Reagents = require('../models/reagent');
const Log = require('../models/log');

exports.listAllServices = async (req, res) => {
  try {
    let result = await Service.find({ isDeleted: false }).populate('relatedCategory').populate('referDoctor').populate('reagentItems.item_id')
    let count = await Service.find({ isDeleted: false }).count();
    res.status(200).send({
      success: true,
      count: count,
      data: result
    });
  } catch (error) {
    return res.status(500).send({ error: true, message: 'No Record Found!' });
  }
};

exports.getService = async (req, res) => {
  const result = await Service.find({ _id: req.params.id, isDeleted: false }).populate('relatedCategory').populate('referDoctor').populate('reagentItems.item_id')
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
    console.log(error)
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

exports.servicesUsage = async (req, res) => {
  let [reagentErrors, reagentFinished] = [[], []]
  let { relatedService, reagents } = req.body;
  const createdBy = req.credentials.id
  let status;

  try {
    const checkUsageFlag = await Service.find({ _id: relatedService, isDeleted: false })
    if (checkUsageFlag.length === 0) return res.status(404).send({ error: true, message: 'Service Not Found!' })
    if (checkUsageFlag[0].usageStatus === undefined) {
      for (const item of reagents) {
        if (item.stock < item.actual) {
          reagentErrors.push(item)
        } else if (item.stock > item.actual) {
          let qtyUpdate = item.stock - item.actual
          try {
            const updateResult = await Reagents.findOneAndUpdate({ _id: item.item_id }, { qty: totalQty }, { new: true })
          } catch (error) {
            reagentErrors.push(item)
            //return res.status(500).send({ error: true, message: error.message })
          }
          reagentFinished.push(item)
          const logResult = await Log.create({
            "relatedService": relatedService,
            "relatedReagent": item.item_id,
            "currentQty": item.stock,
            "actualQty": item.actual,
            "finalQty": totalQty,
            "type": "Usage",
            "createdBy": createdBy,
            "date": Date.now()
          });
        }
      }
      if (reagentErrors.length > 0) status = 'In Progress'
      if (reagentErrors.length === 0) status = 'Finished'
      req.body = { ...req.body, reagentErrors: reagentErrors, usageStatus: status, reagents: reagentFinished }
      var usageResult = await Usage.create(req.body);
      var appointmentUpdate = await Service.findOneAndUpdate(
        { _id: relatedService },
        { usageStatus: usageResult._id },
        { new: true }
      )
      var usageRecordResult = await UsageRecords.create({
        relatedUsage: usageResult._id,
        usageStatus: status,
        reagents: reagentFinished,
        reagentErrors: reagentErrors,
        createdAt: Date.now(),
        createdBy: createdBy
      })
    } else {
      var usageRecordResult = await UsageRecords.find({ relatedUsage: checkUsageFlag[0].usageStatus }, { sort: { createdAt: -1 } })
      if (usageRecordResult.length > 0) var URResult = await UsageRecords.find({ _id: usageRecordResult[0]._id })
      const newReagent = req.body.reagents.filter(value => {
        const match = URResult[0].reagentErrors.some(errorItem => errorItem.item_id.toString() === value.item_id);
        return match;
      });
      if (newReagent.length > 0) {
        for (const item of newReagent) {
          if (item.stock < item.actual) {
            reagentErrors.push(item)
          } else if (item.stock > item.actual) {
            let qtyUpdate = item.stock - item.actual
            try {
              const updateResult = await Reagents.findOneAndUpdate({ _id: item.item_id }, { qty: totalQty }, { new: true })
            } catch (error) {
              reagentErrors.push(item)
              //return res.status(500).send({ error: true, message: error.message })
            }
            reagentFinished.push(item)
            const logResult = await Log.create({
              "relatedService": relatedService,
              "relatedReagent": item.item_id,
              "currentQty": item.stock,
              "actualQty": item.actual,
              "finalQty": totalQty,
              "type": "Usage",
              "createdBy": createdBy,
              "date": Date.now()
            });
          }
        }
      }
      req.body = { ...req.body, reagentErrors: reagentErrors }
      if (reagentErrors.length > 0) status = 'In Progress'
      if (reagentErrors.length === 0) status = 'Finished'
      var usageUpdate = await Usage.findOneAndUpdate(
        { _id: checkUsageFlag[0].usageStatus },
        {
          $push: {
            reagents: { $each: reagentFinished }
          },
          reagentErrors: reagentErrors,
          usageStatus: status
        },
        { new: true }
      );
      var usageRecordResult = await UsageRecords.create({
        relatedUsage: usageUpdate._id,
        usageStatus: status,
        reagentErrors: reagentErrors,
        reagents: reagentFinished,
        createdAt: Date.now(),
        createdBy: createdBy
      })
    }
    let response = { success: true }
    if (reagentErrors.length > 0) response.reagentErrors = reagentErrors
    if (usageResult !== undefined) response.usageResult = usageResult
    if (usageRecordResult !== undefined) response.usageRecordResult = usageRecordResult
    if (appointmentUpdate !== undefined) response.appointmentUpdate = appointmentUpdate
    if (URResult !== undefined) response.URResult = URResult
    if (usageUpdate !== undefined) response.usageUpdate = usageUpdate

    return res.status(200).send(response)
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message })
  }
}