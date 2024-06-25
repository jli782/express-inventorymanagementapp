const Category = require("../models/category");
const asyncHandler = require("express-async-handler");

exports.category_list = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Category list`);
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Category detail: ${req.params.id}`);
});

exports.category_create_GET = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Category create GET`);
});

exports.category_create_POST = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Category create POST`);
});

exports.category_delete_GET = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Category delete GET`);
});

exports.category_delete_DELETE = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Category delete DELETE`);
});

exports.category_update_GET = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Category update GET`);
});

exports.category_update_PUT = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Category update PUT`);
});
