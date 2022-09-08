const Resource = require("../entity/resource.entity");
const mongoose = require("mongoose");
const logger = require("../logger");

exports.createResource = (req, res) => {
  Resource.find({ email: req.body.email }).then((user) => {
    if (user.length >= 1) {
      return res.status(404).json({
        message: "email already exists",
      });
    }
    const resource = new Resource({
      _id: new mongoose.Types.ObjectId(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      insertedAt: new Date(),
      insertedBy: "kashyap patel",
      role: "user",
    });
    resource
      .save()
      .then((result) => {
        console.log(result);
        return res.status(200).json({
          success: true,
          message: "resource create successfully",
        });
      })
      .catch((e) => {
        return res.status(400).json({
          success: false,
          message: e,
        });
      });
  });
};
exports.login = (req, res) => {
  Resource.findOne({ email: req.body.email })
    .then((resource) => {
      if (resource && resource.password === req.body.password) {
        return res.status(200).json({
          success: true,
          data: resource,
        });
      }
    })
    .catch((err) => {
      console.log({
        error: err,
      });
      return res.status(500).json({
        error: err,
      });
    });
};

exports.getAllResource = (req, res) => {
  Resource.find()
    .then((resource) => {
      return res.status(200).json(resource);
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};
exports.getResourceByID = (req, res) => {
  let reqData = requestData(req);
  logger.info(`${JSON.stringify(reqData)}`);
  Resource.findOne({ _id: req.params.id })
    .then((resource) => {
      let resp = {
        trackId: req?.body?.trackId || "",
        success: true,
        data: resource,
      };
      logger.info(`${JSON.stringify(resp)}`);
      return res.status(200).json({ success: true, data: resource });
    })
    .catch((err) => {
      const error = {
        trackId: req.body?.trackId,
        errorMessage: 'Resource Not Found',
      };
      logger.error(`${JSON.stringify(error)}`);
      return res.status(500).json({
        success: false,
        message: 'Resource Not Found',
      });
    });
};
function requestData(req) {
  return {
    trackId: req.body?.trackId,
    url: req?.originalUrl || "",
    method: req.method || "",
    body: req.body || "",
  };
}
