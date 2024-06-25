const Storage = require("../models/storage");
const asyncHandler = require("express-async-handler");

exports.storage_list = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Storage list`);
});
exports.storage_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Storage detail ${req.params.id}`);
});

exports.storage_create_GET = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Storage create GET`);
});
exports.storage_create_POST = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Storage create POST`);
});

exports.storage_delete_GET = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Storage delete GET`);
});
exports.storage_delete_DELETE = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Storage delete DELETE`);
});

exports.storage_update_GET = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Storage update GET`);
});
exports.storage_update_PUT = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Storage update PUT`);
});
