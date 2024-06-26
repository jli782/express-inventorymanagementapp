const MechPartInstance = require("../models/mechpartinstance");
const asyncHandler = require("express-async-handler");

exports.mechpartinstance_list = asyncHandler(async (req, res, next) => {
  const mech_part_instance_data = await MechPartInstance.find({})
    .populate("mechs storage client manufacturer", "name price")
    .sort({ status: -1 })
    .exec();
  console.log(mech_part_instance_data);
  res.render("mech_part_instance_list", {
    title: "List of Mech Part Instances",
    data: mech_part_instance_data,
  });
});
exports.mechpartinstance_detail = asyncHandler(async (req, res, next) => {
  const mech_part_instance_data = await MechPartInstance.findById(req.params.id)
    .populate("mechs storage client manufacturer", "name model price imageURL")
    .exec();
  console.log(mech_part_instance_data);
  res.render("mech_part_instance_detail", {
    title: "Mech Part Instance Detail",
    data: mech_part_instance_data,
  });
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
