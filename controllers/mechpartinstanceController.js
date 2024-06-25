const MechPartInstance = require("../models/mechpartinstance");
const asyncHandler = require("express-async-handler");

exports.mechpartinstance_list = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: MechPartInstance list`);
});
exports.mechpartinstance_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: MechPartInstance detail ${req.params.id}`);
});

exports.mechpartinstance_create_GET = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: MechPartInstance create GET`);
});
exports.mechpartinstance_create_POST = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: MechPartInstance create POST`);
});

exports.mechpartinstance_delete_GET = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: MechPartInstance delete GET`);
});
exports.mechpartinstance_delete_DELETE = asyncHandler(
  async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: MechPartInstance delete DELETE`);
  }
);

exports.mechpartinstance_update_GET = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: MechPartInstance update GET`);
});
exports.mechpartinstance_update_PUT = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: MechPartInstance update PUT`);
});
