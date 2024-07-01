const Client = require("../models/client");
const MechPartInstance = require("../models/mechpartinstance");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.client_list = asyncHandler(async (req, res, next) => {
  const client_list_data = await Client.find({}).sort({ name: 1 }).exec();
  console.log(client_list_data);

  res.render("client_list", {
    title: `List of Clients`,
    data: client_list_data,
  });
  // res.send(`NOT IMPLEMENTED: Client list`);
});

exports.client_detail = asyncHandler(async (req, res, next) => {
  const [client, client_mechs_purchased] = await Promise.all([
    Client.findById(req.params.id).exec(),
    MechPartInstance.find({
      client: req.params.id,
    })
      .sort({ dateSold: -1 })
      .exec(),
  ]);
  console.log(client, client_mechs_purchased);
  res.render("client_detail", {
    title: `Client Detail`,
    client_data: client,
    client_mechs_data: client_mechs_purchased,
  });
});

exports.client_create_GET = asyncHandler(async (req, res, next) => {
  res.render("client_form", {
    title: `Create Client`,
    errors: undefined,
    form_client: undefined,
  });
});

exports.client_create_POST = [
  body("name")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Client name must contain at least 3 characters")
    .isAlphanumeric(["en-US"], { ignore: " _-" })
    .withMessage("Client name has non-alphanumeric characters."),
  body("address")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Client location is empty.")
    .isAlphanumeric(["en-US"], { ignore: " _-'" })
    .withMessage("Location has non-alphanumeric characters.")
    .escape(),
  body("postalCode")
    .trim()
    .isLength({ min: 6 })
    .escape()
    .withMessage("Postal is too short.")
    .isPostalCode("any")
    .withMessage("Postal is not valid postal code."),
  body("email").trim().isEmail().normalizeEmail().withMessage("Email is empty"),
  body("phone")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Phone no. too short.")
    .isNumeric()
    .withMessage("Phone no. has non-numeric characters."),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .withMessage(`Description is empty.`)
    .escape(),
  asyncHandler(async (req, res, next) => {
    const err = validationResult(req);
    const client = new Client({
      name: req.body.name,
      address: req.body.address.replaceAll("&#x27;", "'"),
      postalCode: req.body.postalCode,
      email: req.body.email,
      phone: req.body.phone,
      description: req.body.description.replaceAll("&#x27;", "'"),
    });
    if (!err.isEmpty()) {
      err.array().map((e) => console.log(e));
      console.log(client);
      res.render("client_form", {
        title: `Create Client`,
        errors: err.array(),
        form_client: client,
      });
    } else {
      const clientExists = await Client.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (clientExists) {
        res.redirect(clientExists.url);
      } else {
        await client.save();
        res.redirect(client.url);
      }
    }
  }),
];

exports.client_delete_GET = asyncHandler(async (req, res, next) => {
  const [client, client_mechs_purchased] = await Promise.all([
    Client.findById(req.params.id).exec(),
    MechPartInstance.find({
      client: req.params.id,
    })
      .sort({ dateSold: -1 })
      .exec(),
  ]);
  console.log(client, client_mechs_purchased);
  if (!client) {
    res.redirect("/shopwiki/clients");
  }
  res.render("client_delete", {
    title: `Delete Client`,
    client_data: client,
    client_mechs_data: client_mechs_purchased,
  });
});

exports.client_delete_DELETE = asyncHandler(async (req, res, next) => {
  const [client, client_mechs_purchased] = await Promise.all([
    Client.findById(req.params.id).exec(),
    MechPartInstance.find({
      client: req.params.id,
    })
      .sort({ dateSold: -1 })
      .exec(),
  ]);
  console.log(client, client_mechs_purchased);
  if (client_mechs_purchased.length > 0) {
    res.render("client_delete", {
      title: `Delete Client`,
      client_data: client,
      client_mechs_data: client_mechs_purchased,
    });
  } else {
    await Client.findByIdAndDelete(req.body.client_id).exec();
    res.redirect("/shopwiki/clients");
  }
});

exports.client_update_GET = asyncHandler(async (req, res, next) => {
  const client_data = await Client.findOne({ _id: req.params.id }).exec();
  if (!client_data) {
    const err = new Error("Client not found.");
    err.status = 404;
    return next(err);
  }
  res.render("client_form", {
    title: `Update Client`,
    errors: undefined,
    form_client: client_data,
  });
});

exports.client_update_POST = [
  body("name")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Client name must contain at least 3 characters")
    .isAlphanumeric(["en-US"], { ignore: " _-" })
    .withMessage("Client name has non-alphanumeric characters."),
  body("address")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Client location is empty.")
    .isAlphanumeric(["en-US"], { ignore: " _-'" })
    .withMessage("Location has non-alphanumeric characters.")
    .escape(),
  body("postalCode")
    .trim()
    .isLength({ min: 6 })
    .escape()
    .withMessage("Postal is too short.")
    .isPostalCode("any")
    .withMessage("Postal is not valid postal code."),
  body("email").trim().isEmail().normalizeEmail().withMessage("Email is empty"),
  body("phone")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Phone no. too short.")
    .isNumeric()
    .withMessage("Phone no. has non-numeric characters."),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .withMessage(`Description is empty.`)
    .escape(),
  asyncHandler(async (req, res, next) => {
    const err = validationResult(req);
    const client = new Client({
      name: req.body.name,
      address: req.body.address.replaceAll("&#x27;", "'"),
      postalCode: req.body.postalCode,
      email: req.body.email,
      phone: req.body.phone,
      description: req.body.description.replaceAll("&#x27;", "'"),
      _id: req.params.id,
    });
    if (!err.isEmpty()) {
      err.array().map((e) => console.log(e));
      console.log(`updated client: `, client);
      res.render("client_form", {
        title: `Update Client`,
        errors: err.array(),
        form_client: client,
      });
    } else {
      const updatedClient = await Client.findOneAndUpdate(
        { _id: req.params.id },
        client,
        {}
      ).exec();
      res.redirect(updatedClient.url);
    }
  }),
];
