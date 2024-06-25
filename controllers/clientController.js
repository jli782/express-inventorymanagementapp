const Client = require("../models/client");
const MechPartInstance = require("../models/mechpartinstance");
const asyncHandler = require("express-async-handler");

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
  // res.send(`NOT IMPLEMENTED: Client detail ${req.params.id}`);
});

exports.client_create_GET = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Client create GET`);
});

exports.client_create_POST = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Client create POST`);
});

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
