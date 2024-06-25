const Client = require("../models/client");
const asyncHandler = require("express-async-handler");

exports.client_list = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Client list`);
});

exports.client_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Client detail ${req.params.id}`);
});

exports.client_create_GET = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Client create GET`);
});

exports.client_create_POST = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Client create POST`);
});

exports.client_delete_GET = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Client delete GET`);
});

exports.client_delete_DELETE = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Client delete DELETE`);
});

exports.client_update_GET = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Client update GET`);
});

exports.client_update_PUT = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Client update PUT`);
});
