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
    .sort({ weight: 1 })
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
  res.render("mechs_detail", {
    title: "Mech Detail",
    data: mechs_data,
  });
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
  body("tech", "Tech level must not be empty.")
    .trim()
    .escape()
    .custom((tech) => {
      console.log(`tech: `, tech.length);
      return tech.length !== 0;
    }),
  body(`equipment`, `Armaments is empty.`)
    .trim()
    .isLength({ min: 1 })
    .isWhitelisted(
      "abcdefghijklmnopqrstuvwxyz-QWERTYUIOPASDFGHJKLZXCVBNM 0123456789,/"
    )
    .withMessage(
      `Armaments is invalid format. Use a comma-separated list (ie. 1x SRM4, 2x medium laser)`
    ),
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
    console.log(`req.file.url: `, req.file.url);
    // get the category property based on weight from form in req.body.weight
    // console.log(`req.body.weight - ${req.body.weight}`);
    const mechCategory = await Category.findOne()
      .where("weightMin")
      .lte(req.body.weight)
      .where("weightMax")
      .gte(req.body.weight)
      .exec();

    // console.log(`mechCategory - `, mechCategory);
    err.array().map((e) => console.log(e));

    const mech = new Mechs({
      name: req.body.name,
      model: req.body.model,
      era: req.body.era,
      tech: req.body.tech,
      description: req.body.description
        .replaceAll("&#x27;", "'")
        .replaceAll("&#x2F;", "/")
        .replaceAll("&quot;", "'"),
      weight: req.body.weight,
      price: req.body.price,
      battle_value: req.body.battle_value,
      equipment: req.body.equipment.split(","),
      imageURL: req.file.url || req.body.imageURL,
      category: mechCategory,
    });
    // console.log(mech);
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
  }),
];

exports.mechs_delete_GET = asyncHandler(async (req, res, next) => {
  const [mechs_data, mech_part_instances] = await Promise.all([
    Mechs.findById(req.params.id).populate("category").exec(),
    MechPartInstance.find({
      mechs: req.params.id,
    })
      .sort({ status: 1 })
      .exec(),
  ]);

  console.log(
    `mechs_data ${mechs_data} | mech_part_instances ${mech_part_instances}`
  );
  if (!mechs_data) {
    res.redirect("/shopwiki/mechs");
    return;
  }
  res.render("mechs_delete", {
    title: "Delete Mech",
    data: mechs_data,
    mech_part_instances: mech_part_instances,
  });
});
exports.mechs_delete_DELETE = asyncHandler(async (req, res, next) => {
  const [mechs_data, mech_part_instances] = await Promise.all([
    Mechs.findById(req.params.id).populate("category").exec(),
    MechPartInstance.find({
      mechs: req.params.id,
    })
      .sort({ status: 1 })
      .exec(),
  ]);

  console.log(
    `mechs_data ${mechs_data} | mech_part_instances ${mech_part_instances} | req.body.mechs_id ${req.body.mechs_id}`
  );
  if (mech_part_instances.length > 0) {
    res.render("mechs_delete", {
      title: "Delete Mech",
      data: mechs_data,
      mech_part_instances: mech_part_instances,
    });
    return;
  } else {
    await Mechs.findByIdAndDelete(req.body.mechs_id).exec();
    res.redirect("/shopwiki/mechs");
  }
});

exports.mechs_update_GET = asyncHandler(async (req, res, next) => {
  const mech_data = await Mechs.findOne({ _id: req.params.id }).exec();

  if (!mech_data) {
    const err = new Error("Mech Not Found.");
    err.status = 404;
    return next(err);
  }
  res.render("mechs_form", {
    title: "Update Mech",
    errors: undefined,
    mechs: mech_data,
  });
});
exports.mechs_update_UPDATE = [
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
  body("tech", "Tech level must not be empty.")
    .trim()
    .escape()
    .custom((tech) => {
      console.log(`tech: `, tech.length);
      return tech.length !== 0;
    }),
  body(`equipment`, `Armaments is empty.`)
    .trim()
    .isLength({ min: 1 })
    .isWhitelisted(
      "abcdefghijklmnopqrstuvwxyz-QWERTYUIOPASDFGHJKLZXCVBNM 0123456789,/"
    )
    .withMessage(
      `Armaments is invalid format. Use a comma-separated list (ie. 1x SRM4, 2x medium laser)`
    ),
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
      description: req.body.description
        .replaceAll("&#x27;", "'")
        .replaceAll("&#x2F;", "/")
        .replaceAll("&quot;", "'"),
      weight: req.body.weight,
      price: req.body.price,
      battle_value: req.body.battle_value,
      equipment: req.body.equipment.split(","),
      imageURL: req.body.imageURL,
      category: mechCategory,
      _id: req.params.id,
    });
    console.log(mech);
    if (!err.isEmpty()) {
      res.render("mechs_form", {
        title: `Update Mech`,
        errors: err.array(),
        mechs: mech,
      });
    } else {
      const updatedMech = await Mechs.findOneAndUpdate(
        { _id: req.params.id },
        mech,
        {}
      ).exec();
      res.redirect(updatedMech.url);
    }
  }),
];
