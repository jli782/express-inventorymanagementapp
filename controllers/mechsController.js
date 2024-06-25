const Mechs = require("../models/mechs");
const MechPartInstance = require("../models/mechpartinstance");
const Storage = require("../models/storage");
const Category = require("../models/category");
const Client = require("../models/client");
const Manufacturer = require("../models/manufacturer");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  // res.send(`NOT IMPLEMENTED: Site Home Page`);
  const indexData = {};
  [
    indexData.mechs_count,
    indexData.mech_part_instance_count,
    indexData.storage_count,
    indexData.category_count,
    indexData.client_count,
    indexData.manufacturer_count,
  ] = await Promise.all([
    Mechs.countDocuments({}).exec(),
    MechPartInstance.countDocuments({ status: `Available` }).exec(),
    Storage.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
    Client.countDocuments({}).exec(),
    Manufacturer.countDocuments({}).exec(),
  ]);
  res.render("index", {
    title: "BT Inventory Management",
    shop_data: indexData,
  });
});

exports.mechs_list = asyncHandler(async (req, res, next) => {
  // res.send(`NOT IMPLEMENTED: Mechs list`);
  const mechs_data = await Mechs.find({}, "name model imageURL weight")
    .populate("category")
    .exec();
  console.log(mechs_data);
  res.render("mechs_list", { title: "List of Mechs", data: mechs_data });
});

exports.mechs_detail = asyncHandler(async (req, res, next) => {
  // res.send(`NOT IMPLEMENTED: Mechs detail ${req.params.id}`);
  const mechs_data = await Mechs.findById(req.params.id)
    .populate("category")
    .exec();
  console.log(mechs_data);
  res.render("mechs_detail", { title: "Mech", data: mechs_data });
});

exports.mechs_create_GET = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Mechs create GET`);
});
exports.mechs_create_POST = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Mechs create POST`);
});

exports.mechs_delete_GET = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Mechs delete GET`);
});
exports.mechs_delete_DELETE = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Mechs delete DELETE`);
});

exports.mechs_update_GET = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Mechs update GET`);
});
exports.mechs_update_UPDATE = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Mechs update PUT`);
});
