const Manufacturer = require("../models/manufacturer");
const MechPartInstance = require("../models/mechpartinstance");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
  res.render("manufacturer_form", {
    title: `Create Manufacturer`,
    manufacturer: undefined,
    errors: undefined,
  });
});

exports.manufacturer_create_POST = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Manufacturer name must be specified.")
    .isAlphanumeric(["en-US"], { ignore: " _-" })
    .withMessage("Manufacturer name has non-alphanumeric characters."),
  body("location")
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape()
    .withMessage("Location must be specified and not be over 50 characters."),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Description must be provided for the manufacturer."),
  asyncHandler(async (req, res, next) => {
    const err = validationResult(req);

    const manufacturer = new Manufacturer({
      name: req.body.name,
      location: req.body.location
        .replaceAll("&#x27;", "'")
        .replaceAll("&#x2F;", "/")
        .replaceAll("&quot;", "'"),
      description: req.body.description
        .replaceAll("&#x27;", "'")
        .replaceAll("&#x2F;", "/")
        .replaceAll("&quot;", "'"),
    });
    if (!err.isEmpty()) {
      res.render("manufacturer_form", {
        title: `Create Manufacturer`,
        manufacturer: manufacturer,
        errors: err.array(),
      });
      return;
    } else {
      const manufacturerExists = await Manufacturer.findOne({
        name: req.body.name,
      })
        .collation({ locale: "en", strength: 2 })
        .exec();

      if (manufacturerExists) {
        res.redirect(manufacturerExists.url);
      } else {
        await manufacturer.save();
        res.redirect(manufacturer.url);
      }
    }
  }),
];

exports.manufacturer_delete_GET = asyncHandler(async (req, res, next) => {
  const [manufacturer_data, manufacturer_mechs_data] = await Promise.all([
    Manufacturer.findById(req.params.id).exec(),
    MechPartInstance.find({
      manufacturer: req.params.id,
    })
      .populate("storage client mechs")
      .exec(),
  ]);

  console.log(manufacturer_data, manufacturer_mechs_data);
  if (!manufacturer_data) {
    res.redirect("/shopwiki/manufacturers");
  }
  res.render("manufacturer_delete", {
    title: `Delete Manufacturer`,
    manufacturer: manufacturer_data,
    data: manufacturer_mechs_data,
  });
});

exports.manufacturer_delete_DELETE = asyncHandler(async (req, res, next) => {
  const [manufacturer_data, manufacturer_mechs_data] = await Promise.all([
    Manufacturer.findById(req.params.id).exec(),
    MechPartInstance.find({
      manufacturer: req.params.id,
    })
      .populate("storage client mechs")
      .exec(),
  ]);
  console.log(`req.body.manufacturer_id : ${req.body.manufacturer_id}`);
  console.log(manufacturer_data, manufacturer_mechs_data);
  if (manufacturer_mechs_data.length > 0) {
    res.render("manufacturer_delete", {
      title: `Delete Manufacturer`,
      manufacturer: manufacturer_data,
      data: manufacturer_mechs_data,
    });
  } else {
    await Manufacturer.findByIdAndDelete(req.body.manufacturer_id);
    res.redirect("/shopwiki/manufacturers");
  }
});

exports.manufacturer_update_GET = asyncHandler(async (req, res, next) => {
  const manufacturer_data = await Manufacturer.findById(req.params.id).exec();
  if (!manufacturer_data) {
    const err = new Error("Manufacturer not found.");
    err.status = 404;
    return next(err);
  }
  res.render("manufacturer_form", {
    title: `Update Manufacturer`,
    manufacturer: manufacturer_data,
    errors: undefined,
  });
});

exports.manufacturer_update_POST = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Manufacturer name must be specified.")
    .isAlphanumeric(["en-US"], { ignore: " _-" })
    .withMessage("Manufacturer name has non-alphanumeric characters."),
  body("location")
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape()
    .withMessage("Location must be specified and not be over 50 characters."),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Description must be provided for the manufacturer."),
  asyncHandler(async (req, res, next) => {
    const err = validationResult(req);

    const manufacturer = new Manufacturer({
      name: req.body.name,
      location: req.body.location
        .replaceAll("&#x27;", "'")
        .replaceAll("&#x2F;", "/")
        .replaceAll("&quot;", "'"),
      description: req.body.description
        .replaceAll("&#x27;", "'")
        .replaceAll("&#x2F;", "/")
        .replaceAll("&quot;", "'"),
      _id: req.params.id,
    });
    if (!err.isEmpty()) {
      err.array().map((e) => console.log(e.msg));

      res.render("manufacturer_form", {
        title: `Update Manufacturer`,
        manufacturer: manufacturer,
        errors: err.array(),
      });
      return;
    } else {
      const updatedManufacturer = await Manufacturer.findOneAndUpdate(
        { _id: req.params.id },
        manufacturer,
        {}
      ).exec();
      res.redirect(updatedManufacturer.url);
    }
  }),
];
