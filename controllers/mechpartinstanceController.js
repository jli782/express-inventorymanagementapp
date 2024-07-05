const MechPartInstance = require("../models/mechpartinstance");
const Mechs = require("../models/mechs");
const Storage = require("../models/storage");
const Client = require("../models/client");
const Manufacturer = require("../models/manufacturer");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const debug = require("debug")("mechpartinstance");

exports.mechpartinstance_list = asyncHandler(async (req, res, next) => {
  const mech_part_instance_data = await MechPartInstance.find({})
    .populate("mechs storage client manufacturer", "name price")
    .sort({ status: -1 })
    .exec();
  debug(`mechpartinstance_list :`, mech_part_instance_data);
  res.render("mech_part_instance_list", {
    title: "List of Mech Part Instances",
    data: mech_part_instance_data,
  });
});
exports.mechpartinstance_detail = asyncHandler(async (req, res, next) => {
  const mech_part_instance_data = await MechPartInstance.findById(req.params.id)
    .populate("mechs storage client manufacturer", "name model price imageURL")
    .exec();
  debug(`mechpartinstance_detail: `, mech_part_instance_data);
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

  debug(`mechpartinstance_create_GET - mechs: `, mechs);
  debug(`mechpartinstance_create_GET - storages: `, storages);
  debug(`mechpartinstance_create_GET - manufacturers: `, manufacturers);

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
exports.mechpartinstance_create_POST = [
  body(`serialNo`)
    .trim()
    .isLength({ min: 15 })
    .withMessage(`Serial No. must have minimum 15 digits.`)
    .isNumeric()
    .withMessage(`Serial No. has non-numeric characters.`)
    .escape(),
  body(`status`).trim().isLength({ min: 1 }).withMessage(`Status is empty.`),
  body(`dateReceived`, `Invalid date received.`).toDate(),
  body(`dateSold`, `Invalid date sold.`)
    .optional({ values: "falsy" })
    .toDate()
    .custom((dateSold, { req }) => {
      if (dateSold.getTime() < req.body.dateReceived.getTime())
        throw new Error(`Date sold is before date received.`);
      if (req.body.client === undefined) throw new Error(`Client is empty.`);
      return true;
    }),
  body("mechs", `Mech must be specified.`)
    .trim()
    .escape()
    .custom((mech) => {
      console.log(`req.body.mechs`, mech.length);
      return mech.length !== 0;
    }),
  body("storage", "Storage must be specified")
    .trim()
    .escape()
    .custom((storage) => {
      console.log(`req.body.storage ${storage}`);
      return storage.length !== 0;
    }),
  body("manufacturer", "Manufacturer must be specified")
    .trim()
    .escape()
    .custom((manufacturer) => {
      console.log(`req.body.manufacturer ${manufacturer}`);
      return manufacturer.length !== 0;
    }),
  body("client", "Client must be specified")
    .optional({ values: `falsy` })
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom((client, { req }) => {
      if (client.length == 0 && req.body.status != `Available`) return false;
      return true;
    }),
  asyncHandler(async (req, res, next) => {
    const err = validationResult(req);
    const [mechs, storages, clients, manufacturers] = await Promise.all([
      Mechs.find({}, "model name").sort("weight").exec(),
      Storage.find({}, "name").sort("name").exec(),
      Client.find({}, "name").sort("name").exec(),
      Manufacturer.find({}, "name").sort("name").exec(),
    ]);

    debug(
      `mechpartinstance_create_POST - creating mechpartinstance: ${
        req.body.client ? true : false
      }`
    );
    const mech_part_instance = new MechPartInstance({
      serialNo: parseInt(req.body.serialNo, 10),
      status: req.body.status,
      dateReceived: req.body.dateReceived,
      dateSold: req.body.dateSold,
      mechs: req.body.mechs,
      storage: req.body.storage,
      client: req.body.client,
      manufacturer: req.body.manufacturer,
    });
    // console.log(
    //   `mech_part_instance.mechs._id : ${
    //     mech_part_instance.mechs._id.toString() == mechs[0]._id.toString()
    //   } | ${mechs[0]._id} | ${mech_part_instance.mechs._id}`
    // );
    debug(
      `mechpartinstance_create_POST - mech_part_instance: `,
      mech_part_instance
    );
    if (!err.isEmpty()) {
      err
        .array()
        .map((e) => debug(`mechpartinstance_create_POST - err: `, e.msg));
      res.render("mech_part_instance_form", {
        title: "Create Mech Part Instance",
        errors: err.array(),
        mech_part_instance: mech_part_instance,
        mechs: mechs,
        storages: storages,
        clients: clients,
        manufacturers: manufacturers,
      });
      return;
    } else {
      await mech_part_instance.save();
      res.redirect(mech_part_instance.url);
    }
  }),
];

exports.mechpartinstance_delete_GET = asyncHandler(async (req, res, next) => {
  const mech_part_instance_data = await MechPartInstance.findById(req.params.id)
    .populate("mechs storage client manufacturer", "name model price imageURL")
    .exec();
  debug(`mechpartinstance_delete_GET: `, mech_part_instance_data);

  if (!mech_part_instance_data) {
    res.redirect("/shopwiki/mechpartinstances");
    return;
  }
  res.render("mech_part_instance_delete", {
    title: "Delete Mech Part Instance",
    data: mech_part_instance_data,
  });
});
exports.mechpartinstance_delete_DELETE = asyncHandler(
  async (req, res, next) => {
    const mech_part_instance_data = await MechPartInstance.findById(
      req.params.id
    )
      .populate(
        "mechs storage client manufacturer",
        "name model price imageURL"
      )
      .exec();
    debug(`mechpartinstance_delete_DELETE: `, mech_part_instance_data);

    if (!mech_part_instance_data) {
      res.redirect("/shopwiki/mechpartinstances");
      return;
    } else {
      await MechPartInstance.findByIdAndDelete(
        req.body.mechpartinstance_id
      ).exec();
      res.redirect("/shopwiki/mechpartinstances");
    }
  }
);

exports.mechpartinstance_update_GET = asyncHandler(async (req, res, next) => {
  const [mechs, storages, clients, manufacturers, mechpartinstance] =
    await Promise.all([
      Mechs.find({}, "model name").sort("weight").exec(),
      Storage.find({}, "name").sort("name").exec(),
      Client.find({}, "name").sort("name").exec(),
      Manufacturer.find({}, "name").sort("name").exec(),
      MechPartInstance.findOne({ _id: req.params.id }).exec(),
    ]);

  debug(`mechpartinstance_update_GET - mechs: `, mechs);
  debug(`mechpartinstance_update_GET - storages: `, storages);
  debug(`mechpartinstance_update_GET - clients: `, clients);
  debug(`mechpartinstance_update_GET - manufacturers: `, manufacturers);
  debug(`mechpartinstance_update_GET - mechpartinstance: `, mechpartinstance);

  if (!mechpartinstance) {
    const err = new Error("Mech part instance not found.");
    err.status = 404;
    return next(err);
  }
  res.render("mech_part_instance_form", {
    title: "Update Mech Part Instance",
    errors: undefined,
    mech_part_instance: mechpartinstance,
    mechs: mechs,
    storages: storages,
    clients: clients,
    manufacturers: manufacturers,
  });
});
exports.mechpartinstance_update_POST = [
  body(`serialNo`)
    .trim()
    .isLength({ min: 15 })
    .withMessage(`Serial No. must have minimum 15 digits.`)
    .isNumeric()
    .withMessage(`Serial No. has non-numeric characters.`)
    .escape(),
  body(`status`).trim().isLength({ min: 1 }).withMessage(`Status is empty.`),
  body(`dateReceived`, `Invalid date received.`).toDate(),
  body(`dateSold`, `Invalid date sold.`)
    .optional({ values: "falsy" })
    .toDate()
    .custom((dateSold, { req }) => {
      console.log(
        `dateSold UTC: ${dateSold.getTime()} | dateReceived UTC: ${req.body.dateReceived.getTime()}`
      );
      if (dateSold.getTime() < req.body.dateReceived.getTime())
        throw new Error(`Date sold is before date received.`);
      if (req.body.client === undefined) throw new Error(`Client is empty.`);
      return true;
    }),
  body("mechs", `Mech must be specified.`)
    .trim()
    .escape()
    .custom((mech) => {
      console.log(`req.body.mechs`, mech.length);
      return mech.length !== 0;
    }),
  body("storage", "Storage must be specified")
    .trim()
    .escape()
    .custom((storage) => {
      console.log(`req.body.storage ${storage}`);
      return storage.length !== 0;
    }),
  body("manufacturer", "Manufacturer must be specified")
    .trim()
    .escape()
    .custom((manufacturer) => {
      console.log(`req.body.manufacturer ${manufacturer}`);
      return manufacturer.length !== 0;
    }),
  body("client", "Client must be specified")
    .optional({ values: `falsy` })
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom((client, { req }) => {
      if (client.length == 0 && req.body.status != `Available`) return false;
      return true;
    }),
  asyncHandler(async (req, res, next) => {
    const err = validationResult(req);
    const [mechs, storages, clients, manufacturers, mechpartinstance] =
      await Promise.all([
        Mechs.find({}, "model name").sort("weight").exec(),
        Storage.find({}, "name").sort("name").exec(),
        Client.find({}, "name").sort("name").exec(),
        Manufacturer.find({}, "name").sort("name").exec(),
        MechPartInstance.findOne({ _id: req.params.id }).exec(),
      ]);
    // console.log(
    //   `mechs: ${mechs} \n storages: ${storages} \n clients: ${clients} \n manufacturers: ${manufacturers} \n mechpartinstance: ${mechpartinstance}`
    // );
    const mech_part_instance = new MechPartInstance({
      serialNo: parseInt(req.body.serialNo, 10),
      status: req.body.status,
      dateReceived: req.body.dateReceived,
      dateSold: req.body.dateSold,
      mechs: req.body.mechs,
      storage: req.body.storage,
      client: req.body.client,
      manufacturer: req.body.manufacturer,
      _id: req.params.id,
    });
    // console.log(
    //   `mech_part_instance.mechs._id : ${
    //     mech_part_instance.mechs._id.toString() == mechs[0]._id.toString()
    //   } | ${mechs[0]._id} | ${mech_part_instance.mechs._id}`
    // );
    debug(
      `mechpartinstance_update_POST - updated mech_part_instance: `,
      mech_part_instance
    );
    if (!err.isEmpty()) {
      err
        .array()
        .map((e) => debug(`mechpartinstance_update_POST err: `, e.msg));
      res.render("mech_part_instance_form", {
        title: "Update Mech Part Instance",
        errors: err.array(),
        mech_part_instance: mech_part_instance,
        mechs: mechs,
        storages: storages,
        clients: clients,
        manufacturers: manufacturers,
      });
      return;
    } else {
      const updated_mech_part_instance =
        await MechPartInstance.findOneAndUpdate(
          { _id: req.params.id },
          mech_part_instance,
          {}
        ).exec();
      res.redirect(updated_mech_part_instance.url);
    }
  }),
];
