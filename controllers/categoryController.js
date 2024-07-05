const Category = require("../models/category");
const Mechs = require("../models/mechs");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const debug = require("debug")("category");

exports.category_list = asyncHandler(async (req, res, next) => {
  const category_data = await Category.find({}, "name weightMin weightMax")
    .sort({ weightMin: 1 })
    .exec();
  debug(`category_list`, category_data);

  res.render("category_list", {
    title: "List of Mech Categories",
    data: category_data,
  });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  const category_detail_data = await Category.findById(req.params.id).exec();
  const mech_list_by_category = await Mechs.find({}, "name model")
    .where("weight")
    .gte(category_detail_data.weightMin)
    .lte(category_detail_data.weightMax)
    .exec();
  debug(`category_detail`, category_detail_data, mech_list_by_category);

  res.render("category_detail", {
    title: `Category Detail`,
    data: category_detail_data,
    category_description: category_detail_data.description
      .replaceAll("&quot;", '"')
      .replaceAll("&#x27;", "'"),
    mech_list_data: mech_list_by_category,
  });
});

exports.category_create_GET = asyncHandler(async (req, res, next) => {
  res.render("category_form", {
    title: `Create Category`,
    errors: undefined,
    category: undefined,
  });
});

exports.category_create_POST = [
  body("name", "Category name must not be empty.")
    .trim()
    .isLength({ min: 4 })
    .withMessage(`Category name is too short.`)
    .isAlphanumeric()
    .withMessage(`Category name is not alphanumeric`)
    .escape(),
  body("weightMin", "Minimum weight is empty.")
    .trim()
    .isInt({
      gt: -1,
      lt: 999,
    })
    .withMessage(`Minimum Weight is not a positive integer or out of bounds.`),
  body("weightMax", "Maximum weight is empty.")
    .trim()
    .isInt({ gt: -1, lt: 999 })
    .withMessage(`Maximum Weight is not a positive integer or out of bounds.`)
    .ltrim(`0`),
  body(`description`, `Category description is empty.`)
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const err = validationResult(req);

    const category = new Category({
      name: req.body.name,
      weightMin: req.body.weightMin,
      weightMax: req.body.weightMax,
      description: req.body.description,
    });
    if (!err.isEmpty()) {
      debug(`category_create_POST err`, category);
      res.render("category_form", {
        title: `Create Category`,
        errors: err.array(),
        category: category,
      });
      return;
    } else {
      // form data is valid category, check if exists and if not, then save to db.
      console.log(`form data is valid category`);
      const categoryExists = await Category.findOne({
        name: req.body.name,
      })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        res.redirect(category.url);
      }
    }
  }),
];

exports.category_delete_GET = asyncHandler(async (req, res, next) => {
  const category_detail_data = await Category.findById(req.params.id).exec();

  const mech_list_by_category = await Mechs.find({}, "name model")
    .where("weight")
    .gte(category_detail_data.weightMin)
    .lte(category_detail_data.weightMax)
    .exec();

  debug(`category_delete_GET`, category_detail_data, mech_list_by_category);
  if (!category_detail_data) {
    res.redirect("/shopwiki/categories");
    return;
  }
  res.render("category_delete", {
    title: `Delete Category`,
    data: category_detail_data,
    mech_list_data: mech_list_by_category,
  });
});

exports.category_delete_DELETE = asyncHandler(async (req, res, next) => {
  const category_detail_data = await Category.findById(req.params.id).exec();
  const mech_list_by_category = await Mechs.find({}, "name model")
    .where("weight")
    .gte(category_detail_data.weightMin)
    .lte(category_detail_data.weightMax)
    .exec();

  debug(`category_delete_DELETE`, category_detail_data, mech_list_by_category);
  if (mech_list_by_category.length > 0) {
    res.render("category_delete", {
      title: `Delete Category`,
      data: category_detail_data,
      mech_list_data: mech_list_by_category,
    });
  } else {
    await Category.findByIdAndDelete(req.body.category_id).exec();
    res.redirect("/shopwiki/categories");
  }
});

exports.category_update_GET = asyncHandler(async (req, res, next) => {
  const category_data = await Category.findOne({ _id: req.params.id }).exec();
  debug(`category_update_GET`, category_data);
  if (!category_data) {
    const err = new Error("Category not found.");
    err.status = 404;
    return next(err);
  }
  res.render("category_form", {
    title: `Update Category`,
    errors: undefined,
    category: category_data,
  });
});

exports.category_update_POST = [
  body("name", "Category name must not be empty.")
    .trim()
    .isLength({ min: 4 })
    .withMessage(`Category name is too short`)
    .isAlphanumeric()
    .withMessage(`Category name is not alphanumeric`)
    .escape(),
  body("weightMin", "Minimum weight is empty.")
    .trim()
    .isInt({
      gt: -1,
      lt: 999,
    })
    .withMessage(`Minimum Weight is not a positive integer or out of bounds.`),
  body("weightMax", "Maximum weight is empty.")
    .trim()
    .isInt({ gt: -1, lt: 999 })
    .withMessage(`Maximum Weight is not a positive integer or out of bounds.`)
    .ltrim(`0`),
  body(`description`, `Category description is empty.`)
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const err = validationResult(req);

    const category = new Category({
      name: req.body.name,
      weightMin: req.body.weightMin,
      weightMax: req.body.weightMax,
      description: req.body.description
        .replaceAll("&#x27;", "'")
        .replaceAll("&#x2F;", "/")
        .replaceAll("&quot;", "'"),
      _id: req.params.id,
    });
    if (!err.isEmpty()) {
      err.array().map((e) => debug(`category_update_POST err: `, e.msg));
      res.render("category_form", {
        title: `Update Category`,
        errors: err.array(),
        category: category,
      });
      return;
    } else {
      const updatedCategory = await Category.findOneAndUpdate(
        { _id: req.params.id },
        category,
        {}
      ).exec();
      res.redirect(updatedCategory.url);
    }
  }),
];
