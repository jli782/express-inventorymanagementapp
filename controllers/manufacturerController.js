const Manufacturer = require("../models/manufacturer");
const asyncHandler = require("express-async-handler");

exports.manufacturer_list = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Manufacturer list`);
});

exports.manufacturer_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Manufacturer detail ${req.params.id}`);
});

exports.manufacturer_create_GET = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Manufacturer create GET`);
});

exports.manufacturer_create_POST = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Manufacturer create POST`);
});

exports.manufacturer_delete_GET = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Manufacturer delete GET`);
});

exports.manufacturer_delete_DELETE = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Manufacturer delete DELETE`);
});

exports.manufacturer_update_GET = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Manufacturer update GET`);
});

exports.manufacturer_update_PUT = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Manufacturer update PUT`);
});
