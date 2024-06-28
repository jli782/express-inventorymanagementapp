const MechPartInstance = require("../models/mechpartinstance");
const Mechs = require("../models/mechs");
const Storage = require("../models/storage");
const Client = require("../models/client");
const Manufacturer = require("../models/manufacturer");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
  const [mechs, storages, clients, manufacturers] = await Promise.all([
    Mechs.find({}, "model name").sort("weight").exec(),
    Storage.find({}, "name").sort("name").exec(),
    Client.find({}, "name").sort("name").exec(),
    Manufacturer.find({}, "name").sort("name").exec(),
  ]);
  console.log(
    `mechs: ${mechs} \n storages: ${storages} \n clients: ${clients} \n manufacturers: ${manufacturers}`
  );
  res.render("mech_part_instance_form", {
    title: "Create Mech Part Instance",
    errors: undefined,
    mech_part_instance: undefined,
    mechs: mechs,
    storages: storages,
    clients: clients,
    manufacturers: manufacturers,
  });
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
