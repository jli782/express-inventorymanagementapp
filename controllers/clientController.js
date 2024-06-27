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

  asyncHandler(async (req, res, next) => {
    const err = validationResult(req);
    const client = new Client({
      name: req.body.name,
      address: req.body.address,
      postalCode: req.body.postalCode,
      email: req.body.email,
      phone: req.body.phone,
      description: req.body.description,
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
        res.redirect(client.url);
      }
    }
  }),
];

exports.client_delete_GET = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Client delete GET`);
});

exports.client_delete_DELETE = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Client delete DELETE`);
});

exports.client_update_GET = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Client update GET`);
});

exports.client_update_PUT = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Client update PUT`);
});
