const Manufacturer = require("../models/manufacturer");
const MechPartInstance = require("../models/mechpartinstance");
const asyncHandler = require("express-async-handler");

exports.manufacturer_list = asyncHandler(async (req, res, next) => {
  const manufacturer_list_data = await Manufacturer.find({})
    .sort({ name: 1 })
    .exec();
  console.log(manufacturer_list_data);

  res.render("manufacturer_list", {
    title: "List of Manufacturers and Suppliers",
    data: manufacturer_list_data,
  });
});

exports.manufacturer_detail = asyncHandler(async (req, res, next) => {
  const [manufacturer_data, manufacturer_mechs_data] = await Promise.all([
    Manufacturer.findById(req.params.id).exec(),
    MechPartInstance.find({
      manufacturer: req.params.id,
    })
      .populate("storage client mechs")
      .exec(),
  ]);

  console.log(manufacturer_data, manufacturer_mechs_data);
  res.render("manufacturer_detail", {
    title: `Manufacturer Detail`,
    manufacturer: manufacturer_data,
    data: manufacturer_mechs_data,
  });
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
