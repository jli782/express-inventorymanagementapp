const Storage = require("../models/storage");
const MechPartInstance = require("../models/mechpartinstance");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.storage_list = asyncHandler(async (req, res, next) => {
  const storage_data = await Storage.find({}).sort({ name: 1 }).exec();
  let count = [],
    i = 0;
  for (let storage of storage_data) {
    count[i++] = await MechPartInstance.countDocuments({
      storage: storage._id,
    }).exec();
  }
  console.log(storage_data);
  res.render("storage_list", {
    title: "List of Storage Bays",
    data: storage_data,
    storage_count: count,
  });
});
exports.storage_detail = asyncHandler(async (req, res, next) => {
  const [storage, storage_mechs_data] = await Promise.all([
    Storage.findById(req.params.id).exec(),
    MechPartInstance.find({
      storage: req.params.id,
    })
      .populate("mechs client manufacturer")
      .sort({ name: 1 })
      .exec(),
  ]);
  console.log(`storage: `, storage);
  console.log(`stored mechs: `, storage_mechs_data);

  res.render("storage_detail", {
    title: storage.name,
    storage_mechs: storage_mechs_data,
  });

  // res.send(`NOT IMPLEMENTED: Storage detail ${req.params.id}`);
});

exports.storage_create_GET = asyncHandler(async (req, res, next) => {
  res.render("storage_form", {
    title: `Create Storage`,
    errors: undefined,
    storage: undefined,
  });
});
exports.storage_create_POST = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Storage is empty")
    .escape(),
  asyncHandler(async (req, res, next) => {
    const err = validationResult(req);

    const storage = new Storage({ name: req.body.name });
    if (!err.isEmpty()) {
      err.array().map((e) => console.log(e.msg));
      res.render("storage_form", {
        title: `Create Storage`,
        errors: err.array(),
        storage: storage,
      });
    } else {
      const storageExists = await Storage.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (storageExists) {
        res.redirect(storageExists.url);
      } else {
        await storage.save();
        res.redirect(storage.url);
      }
    }
  }),
];

exports.storage_delete_GET = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Storage delete GET`);
});
exports.storage_delete_DELETE = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Storage delete DELETE`);
});

exports.storage_update_GET = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Storage update GET`);
});
exports.storage_update_PUT = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Storage update PUT`);
});
