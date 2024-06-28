const Mechs = require("../models/mechs");
const MechPartInstance = require("../models/mechpartinstance");
const Storage = require("../models/storage");
const Category = require("../models/category");
const Client = require("../models/client");
const Manufacturer = require("../models/manufacturer");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
  res.render("mechs_detail", { title: "Mech Detail", data: mechs_data });
});

exports.mechs_create_GET = asyncHandler(async (req, res, next) => {
  res.render("mechs_form", {
    title: "Create Mech",
    errors: undefined,
    mechs: undefined,
  });
});
exports.mechs_create_POST = [
  body(`name`, `Battlemech name is empty.`)
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isAlphanumeric(["en-US"], { ignore: " _-" })
    .withMessage(`Battlemech name has non-alphanumeric characters.`),
  body(`model`, `Model is empty.`)
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isAlphanumeric(["en-US"], { ignore: " _-" })
    .withMessage(`Battlemech model has non-alphanumeric characters.`),
  body(`era`, `Era is empty.`)
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isAlphanumeric(["en-US"], { ignore: " _-" })
    .withMessage(`Era has non-alphanumeric characters.`),
  body(`imageURL`)
    .trim()
    .isLength({ min: 1 })
    .isURL()
    .withMessage(`ImageURL is invalid.`),
  body("tech", "Tech must not be empty.").trim().isLength({ min: 1 }).escape(),
  body(`equipment`, `Armaments is empty.`)
    .trim()
    .isLength({ min: 1 })
    .isWhitelisted(
      "abcdefghijklmnopqrstuvwxyz-QWERTYUIOPASDFGHJKLZXCVBNM 0123456789,"
    )
    .withMessage(
      `Armaments is invalid format. Use a comma-separated list (ie. 1x SRM4, 2x medium laser)`
    )
    .escape(),
  body(`description`)
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Description must be provided for the manufacturer."),
  body(`weight`)
    .trim()
    .ltrim(`0`)
    .isInt({
      gt: -1,
      lt: 999,
    })
    .withMessage(`Mech Weight is not a positive integer or out of bounds.`),
  body(`price`)
    .trim()
    .ltrim(`0`)
    .isInt({
      gt: -1,
    })
    .withMessage(`Price is not a positive integer.`),
  body(`battle_value`)
    .trim()
    .ltrim(`0`)
    .isInt({
      gt: -1,
    })
    .withMessage(`Battle Value is not a positive integer.`),
  asyncHandler(async (req, res, next) => {
    const err = validationResult(req);

    // get the category property based on weight from form in req.body.weight
    console.log(`req.body.weight - ${req.body.weight}`);
    const mechCategory = await Category.findOne()
      .where("weightMin")
      .lte(req.body.weight)
      .where("weightMax")
      .gte(req.body.weight)
      .exec();

    console.log(`mechCategory - `, mechCategory);
    err.array().map((e) => console.log(e));

    const mech = new Mechs({
      name: req.body.name,
      model: req.body.model,
      era: req.body.era,
      tech: req.body.tech,
      description: req.body.description,
      weight: req.body.weight,
      price: req.body.price,
      battle_value: req.body.battle_value,
      equipment: req.body.equipment.split(","),
      imageURL: req.body.imageURL,
      category: mechCategory,
    });
    console.log(mech);
    if (!err.isEmpty()) {
      res.render("mechs_form", {
        title: `Create Mech`,
        errors: err.array(),
        mechs: mech,
      });
    } else {
      const mechExists = await Mechs.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();

      if (mechExists) {
        res.redirect(mechExists.url);
      } else {
        await mech.save();
        res.redirect(mech.url);
      }
    }
    next();
  }),
];

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
