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
    storage: storage,
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

  if (!storage) {
    res.redirect(`/storages`);
    return;
  }
  res.render("storage_delete", {
    title: `Delete Storage`,
    storage: storage,
    storage_mechs: storage_mechs_data,
  });
});
exports.storage_delete_DELETE = asyncHandler(async (req, res, next) => {
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
  console.log(`req.body.storage_id: `);
  if (storage_mechs_data.length > 0) {
    res.render("storage_delete", {
      title: `Delete Storage`,
      storage: storage,
      storage_mechs: storage_mechs_data,
    });
    return;
  } else {
    await Storage.findByIdAndDelete(req.body.storage_id);
    res.redirect("/shopwiki/storages");
  }
});

exports.storage_update_GET = asyncHandler(async (req, res, next) => {
  const storage_data = await Storage.findById(req.params.id).exec();

  if (!storage_data) {
    const err = new Error("Storage not found.");
    err.status = 404;
    return next(err);
  }
  res.render("storage_form", {
    title: `Update Storage`,
    errors: undefined,
    storage: storage_data,
  });
});
exports.storage_update_POST = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Storage is empty")
    .escape(),
  asyncHandler(async (req, res, next) => {
    const err = validationResult(req);

    const storage = new Storage({ name: req.body.name, _id: req.params.id });
    if (!err.isEmpty()) {
      err.array().map((e) => console.log(e.msg));

      res.render("storage_form", {
        title: `Update Storage`,
        errors: err.array(),
        storage: storage,
      });
    } else {
      const updatedStorage = await Storage.findOneAndUpdate(
        { _id: req.params.id },
        storage,
        {}
      ).exec();
      res.redirect(updatedStorage.url);
    }
  }),
];
